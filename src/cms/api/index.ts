import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Page, SectionRecord, SEO } from '@/cms/schema/sections';
import type { PageDefinition } from '@/cms/schema/pages';
import { getPageDefinition, PAGE_REGISTRY } from '@/cms/schema/pages';
import { LocalCMSStore } from './localStore';

/**
 * CMS API — abstracts the backend. Two modes:
 *
 *   1. Supabase (when configured) — production mode, persists to Postgres.
 *   2. LocalStorage (fallback)    — design preview mode, persists in browser.
 *
 * The same interface is used throughout the CMS so swapping backends is
 * a matter of changing this file.
 */

export interface CMSApi {
  // Pages
  listPages(): Promise<Page[]>;
  getPage(key: string): Promise<Page | null>;
  upsertPage(page: Page): Promise<Page>;

  // News & Events
  listEvents(filter?: EventFilter): Promise<EventPost[]>;
  getEvent(id: string): Promise<EventPost | null>;
  createEvent(payload: Omit<EventPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventPost>;
  updateEvent(id: string, patch: Partial<EventPost>): Promise<EventPost>;
  deleteEvent(id: string): Promise<void>;

  // Media
  listMedia(folder?: string): Promise<MediaItem[]>;
  uploadMedia(file: File, folder?: string, alt?: string): Promise<MediaItem>;
  deleteMedia(id: string): Promise<void>;
  updateMediaAlt(id: string, alt: string): Promise<MediaItem>;
}

export interface EventFilter {
  category?: string;
  status?: 'draft' | 'published';
  search?: string;
}

export interface EventPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // HTML
  category: 'Academy' | 'Sports' | 'Arts' | 'Community';
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: { url: string; alt: string };
  gallery: Array<{ url: string; alt: string }>;
  eventDate: string | null;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  folder: string;
  alt: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase implementation
// ─────────────────────────────────────────────────────────────────────────────

class SupabaseCMS implements CMSApi {
  async listPages(): Promise<Page[]> {
    const { data, error } = await supabase.from('pages').select('*').order('key');
    if (error) throw error;
    // Hydrate any pages missing from DB with their default registry entries
    const existing = new Map(((data ?? []) as DbPageRow[]).map((p) => [p.key, p]));
    return PAGE_REGISTRY.map((def) => hydrateFromDef(def, existing.get(def.key)));
  }

  async getPage(key: string): Promise<Page | null> {
    const def = getPageDefinition(key);
    if (!def) return null;
    const { data, error } = await supabase.from('pages').select('*').eq('key', key).maybeSingle();
    if (error) throw error;
    return hydrateFromDef(def, data as DbPageRow | null);
  }

  async upsertPage(page: Page): Promise<Page> {
    const { error } = await supabase.from('pages').upsert(
      {
        key: page.key,
        title: page.title,
        description: page.description,
        status: page.status,
        sections: page.sections,
        seo: page.seo,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    );
    if (error) throw error;
    return { ...page, updatedAt: new Date().toISOString() };
  }

  async listEvents(filter: EventFilter = {}): Promise<EventPost[]> {
    let query = supabase.from('events').select('*').order('event_date', { ascending: false });
    if (filter.category) query = query.eq('category', filter.category);
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.search) query = query.ilike('title', `%${filter.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(rowToEvent);
  }

  async getEvent(id: string): Promise<EventPost | null> {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToEvent(data) : null;
  }

  async createEvent(payload: Omit<EventPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventPost> {
    const { data, error } = await supabase.from('events').insert(eventToRow(payload)).select().single();
    if (error) throw error;
    return rowToEvent(data);
  }

  async updateEvent(id: string, patch: Partial<EventPost>): Promise<EventPost> {
    const { data, error } = await supabase
      .from('events')
      .update({ ...eventToRow(patch as EventPost), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToEvent(data);
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  }

  async listMedia(folder?: string): Promise<MediaItem[]> {
    let query = supabase.from('media').select('*').order('created_at', { ascending: false });
    if (folder) query = query.eq('folder', folder);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(rowToMedia);
  }

  async uploadMedia(file: File, folder = 'uploads', alt = ''): Promise<MediaItem> {
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `${folder}/${filename}`;
    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadErr) throw uploadErr;

    const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
    const url = pub.publicUrl;

    const { data, error } = await supabase
      .from('media')
      .insert({
        url,
        filename: file.name,
        folder,
        alt,
        mime_type: file.type,
        size: file.size,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToMedia(data);
  }

  async deleteMedia(id: string): Promise<void> {
    const { data: row } = await supabase.from('media').select('url, folder, filename').eq('id', id).single();
    if (row) {
      const path = `${row.folder}/${row.url.split('/').pop()}`;
      await supabase.storage.from('media').remove([path]);
    }
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  }

  async updateMediaAlt(id: string, alt: string): Promise<MediaItem> {
    const { data, error } = await supabase.from('media').update({ alt }).eq('id', id).select().single();
    if (error) throw error;
    return rowToMedia(data);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────────────────────────────────────

interface DbPageRow {
  key: string;
  title: string;
  description: string | null;
  status: 'draft' | 'published';
  sections: SectionRecord[];
  seo: SEO;
  updated_at: string;
}

function hydrateFromDef(def: PageDefinition, row: DbPageRow | null | undefined): Page {
  if (row) {
    return {
      id: row.key,
      key: row.key,
      title: row.title || def.title,
      description: row.description || def.description,
      status: row.status,
      sections: (row.sections || []).map((s, i) => ({ ...s, order: s.order ?? i })),
      seo: row.seo || { metaTitle: '', metaDescription: '', slug: def.route },
      updatedAt: row.updated_at,
    };
  }
  // First-time page: use registry defaults
  return {
    id: def.key,
    key: def.key,
    title: def.title,
    description: def.description,
    status: 'draft',
    sections: def.defaultSections.map((s, i) => ({
      id: crypto.randomUUID(),
      type: s.type,
      data: s.data,
      visible: true,
      order: i,
    })),
    seo: { metaTitle: def.title, metaDescription: def.description, slug: def.route },
    updatedAt: new Date().toISOString(),
  };
}

function rowToEvent(row: any): EventPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    body: row.body ?? '',
    category: row.category,
    tags: row.tags ?? [],
    status: row.status,
    coverImage: row.cover_image ? { url: row.cover_image, alt: row.cover_alt ?? '' } : undefined,
    gallery: row.gallery ?? [],
    eventDate: row.event_date,
    seo: row.seo ?? { metaTitle: '', metaDescription: '', slug: row.slug },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function eventToRow(e: Partial<EventPost>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (e.slug !== undefined) row.slug = e.slug;
  if (e.title !== undefined) row.title = e.title;
  if (e.excerpt !== undefined) row.excerpt = e.excerpt;
  if (e.body !== undefined) row.body = e.body;
  if (e.category !== undefined) row.category = e.category;
  if (e.tags !== undefined) row.tags = e.tags;
  if (e.status !== undefined) row.status = e.status;
  if (e.coverImage !== undefined) {
    row.cover_image = e.coverImage?.url ?? null;
    row.cover_alt = e.coverImage?.alt ?? null;
  }
  if (e.gallery !== undefined) row.gallery = e.gallery;
  if (e.eventDate !== undefined) row.event_date = e.eventDate;
  if (e.seo !== undefined) row.seo = e.seo;
  return row;
}

function rowToMedia(row: any): MediaItem {
  return {
    id: row.id,
    url: row.url,
    filename: row.filename,
    folder: row.folder,
    alt: row.alt ?? '',
    mimeType: row.mime_type,
    size: row.size,
    createdAt: row.created_at,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API selector
// ─────────────────────────────────────────────────────────────────────────────

export const cms: CMSApi = isSupabaseConfigured ? new SupabaseCMS() : new LocalCMSStore();
