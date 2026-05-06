import type { CMSApi, EventPost, MediaItem, EventFilter } from '@/cms/api';
import type { Page } from '@/cms/schema/sections';
import { PAGE_REGISTRY, getPageDefinition } from '@/cms/schema/pages';

/**
 * LocalCMSStore — persists CMS state in the browser's localStorage.
 *
 * Purpose: lets the entire CMS work offline / without Supabase configured.
 * Drop-in replacement for SupabaseCMS — same interface.
 */

const PAGES_KEY = 'cms.pages';
const EVENTS_KEY = 'cms.events';
const MEDIA_KEY = 'cms.media';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return crypto.randomUUID();
}

function seedPagesIfEmpty(): Page[] {
  const stored = read<Page[]>(PAGES_KEY, []);
  if (stored.length > 0) return stored;
  const seeded = PAGE_REGISTRY.map((def) => ({
    id: def.key,
    key: def.key,
    title: def.title,
    description: def.description,
    status: 'draft' as const,
    sections: def.defaultSections.map((s, i) => ({
      id: uid(),
      type: s.type,
      data: s.data,
      visible: true,
      order: i,
    })),
    seo: { metaTitle: def.title, metaDescription: def.description, slug: def.route },
    updatedAt: new Date().toISOString(),
  }));
  write(PAGES_KEY, seeded);
  return seeded;
}

function seedEventsIfEmpty(): EventPost[] {
  const stored = read<EventPost[]>(EVENTS_KEY, []);
  if (stored.length > 0) return stored;
  const now = new Date().toISOString();
  const seed: EventPost[] = [
    {
      id: uid(),
      slug: 'annual-science-fair-2025',
      title: 'Annual Science Fair 2025',
      excerpt: 'Showcasing student innovation across grades.',
      body: '<p>Our annual science fair brings together students from every grade…</p>',
      category: 'Academy',
      tags: ['science', 'students'],
      status: 'published',
      gallery: [],
      eventDate: '2025-10-12',
      seo: { metaTitle: 'Annual Science Fair 2025', metaDescription: '', slug: 'annual-science-fair-2025' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      slug: 'inter-house-sports-day',
      title: 'Inter-house Sports Day',
      excerpt: 'A day of athletics and team spirit.',
      body: '<p>Students competed in track, field, and team sports…</p>',
      category: 'Sports',
      tags: ['sports'],
      status: 'draft',
      gallery: [],
      eventDate: '2025-11-04',
      seo: { metaTitle: 'Inter-house Sports Day', metaDescription: '', slug: 'inter-house-sports-day' },
      createdAt: now,
      updatedAt: now,
    },
  ];
  write(EVENTS_KEY, seed);
  return seed;
}

export class LocalCMSStore implements CMSApi {
  async listPages(): Promise<Page[]> {
    return seedPagesIfEmpty();
  }

  async getPage(key: string): Promise<Page | null> {
    const def = getPageDefinition(key);
    if (!def) return null;
    const pages = seedPagesIfEmpty();
    return pages.find((p) => p.key === key) ?? null;
  }

  async upsertPage(page: Page): Promise<Page> {
    const pages = seedPagesIfEmpty();
    const idx = pages.findIndex((p) => p.key === page.key);
    const updated: Page = { ...page, updatedAt: new Date().toISOString() };
    if (idx >= 0) pages[idx] = updated;
    else pages.push(updated);
    write(PAGES_KEY, pages);
    return updated;
  }

  async listEvents(filter: EventFilter = {}): Promise<EventPost[]> {
    let events = seedEventsIfEmpty();
    if (filter.category) events = events.filter((e) => e.category === filter.category);
    if (filter.status) events = events.filter((e) => e.status === filter.status);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      events = events.filter((e) => e.title.toLowerCase().includes(q));
    }
    return [...events].sort((a, b) =>
      (b.eventDate ?? b.createdAt).localeCompare(a.eventDate ?? a.createdAt),
    );
  }

  async getEvent(id: string): Promise<EventPost | null> {
    const events = seedEventsIfEmpty();
    return events.find((e) => e.id === id) ?? null;
  }

  async createEvent(payload: Omit<EventPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventPost> {
    const events = seedEventsIfEmpty();
    const now = new Date().toISOString();
    const event: EventPost = { ...payload, id: uid(), createdAt: now, updatedAt: now };
    events.unshift(event);
    write(EVENTS_KEY, events);
    return event;
  }

  async updateEvent(id: string, patch: Partial<EventPost>): Promise<EventPost> {
    const events = seedEventsIfEmpty();
    const idx = events.findIndex((e) => e.id === id);
    if (idx < 0) throw new Error(`Event not found: ${id}`);
    const updated = { ...events[idx], ...patch, updatedAt: new Date().toISOString() };
    events[idx] = updated;
    write(EVENTS_KEY, events);
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    const events = seedEventsIfEmpty();
    write(EVENTS_KEY, events.filter((e) => e.id !== id));
  }

  async listMedia(folder?: string): Promise<MediaItem[]> {
    const all = read<MediaItem[]>(MEDIA_KEY, []);
    return folder ? all.filter((m) => m.folder === folder) : all;
  }

  async uploadMedia(file: File, folder = 'uploads', alt = ''): Promise<MediaItem> {
    // Convert to data URL for local persistence (only suitable for demo mode)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
    const media: MediaItem = {
      id: uid(),
      url: dataUrl,
      filename: file.name,
      folder,
      alt,
      mimeType: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
    };
    const all = read<MediaItem[]>(MEDIA_KEY, []);
    all.unshift(media);
    write(MEDIA_KEY, all);
    return media;
  }

  async deleteMedia(id: string): Promise<void> {
    const all = read<MediaItem[]>(MEDIA_KEY, []);
    write(MEDIA_KEY, all.filter((m) => m.id !== id));
  }

  async updateMediaAlt(id: string, alt: string): Promise<MediaItem> {
    const all = read<MediaItem[]>(MEDIA_KEY, []);
    const idx = all.findIndex((m) => m.id === id);
    if (idx < 0) throw new Error(`Media not found: ${id}`);
    all[idx] = { ...all[idx], alt };
    write(MEDIA_KEY, all);
    return all[idx];
  }
}
