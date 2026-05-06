import { create } from 'zustand';
import type { Page, SectionRecord, SectionType } from '@/cms/schema/sections';
import { cms } from '@/cms/api';

/**
 * Page editor store — holds the page being edited and exposes mutations
 * for sections (add, update, delete, reorder, toggle visibility).
 *
 * The editor saves the entire page object on demand; nothing auto-saves
 * mid-edit, so admins can preview changes before committing.
 */

interface PageEditorState {
  page: Page | null;
  loading: boolean;
  saving: boolean;
  dirty: boolean;
  selectedSectionId: string | null;

  load(key: string): Promise<void>;
  save(): Promise<void>;
  reset(): void;

  // Page-level
  updatePageMeta(patch: Partial<Pick<Page, 'title' | 'description' | 'status' | 'seo'>>): void;

  // Sections
  addSection(type: SectionType, defaultData?: Record<string, unknown>): string;
  updateSectionData(id: string, data: Record<string, unknown>): void;
  toggleSectionVisibility(id: string): void;
  deleteSection(id: string): void;
  duplicateSection(id: string): void;
  reorderSections(orderedIds: string[]): void;
  selectSection(id: string | null): void;
}

export const usePageEditor = create<PageEditorState>((set, get) => ({
  page: null,
  loading: false,
  saving: false,
  dirty: false,
  selectedSectionId: null,

  async load(key) {
    set({ loading: true });
    try {
      const page = await cms.getPage(key);
      set({ page, loading: false, dirty: false, selectedSectionId: null });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  async save() {
    const { page } = get();
    if (!page) return;
    set({ saving: true });
    try {
      const saved = await cms.upsertPage(page);
      set({ page: saved, saving: false, dirty: false });
    } catch (err) {
      set({ saving: false });
      throw err;
    }
  },

  reset() {
    set({ page: null, dirty: false, selectedSectionId: null });
  },

  updatePageMeta(patch) {
    const { page } = get();
    if (!page) return;
    set({ page: { ...page, ...patch }, dirty: true });
  },

  addSection(type, defaultData = {}) {
    const { page } = get();
    if (!page) return '';
    const newId = crypto.randomUUID();
    const newSection: SectionRecord = {
      id: newId,
      type,
      data: defaultData,
      visible: true,
      order: page.sections.length,
    };
    set({
      page: { ...page, sections: [...page.sections, newSection] },
      dirty: true,
      selectedSectionId: newId,
    });
    return newId;
  },

  updateSectionData(id, data) {
    const { page } = get();
    if (!page) return;
    set({
      page: {
        ...page,
        sections: page.sections.map((s) => (s.id === id ? { ...s, data } : s)),
      },
      dirty: true,
    });
  },

  toggleSectionVisibility(id) {
    const { page } = get();
    if (!page) return;
    set({
      page: {
        ...page,
        sections: page.sections.map((s) =>
          s.id === id ? { ...s, visible: !s.visible } : s,
        ),
      },
      dirty: true,
    });
  },

  deleteSection(id) {
    const { page, selectedSectionId } = get();
    if (!page) return;
    const remaining = page.sections.filter((s) => s.id !== id);
    set({
      page: {
        ...page,
        sections: remaining.map((s, i) => ({ ...s, order: i })),
      },
      dirty: true,
      selectedSectionId: selectedSectionId === id ? null : selectedSectionId,
    });
  },

  duplicateSection(id) {
    const { page } = get();
    if (!page) return;
    const source = page.sections.find((s) => s.id === id);
    if (!source) return;
    const copy: SectionRecord = {
      ...source,
      id: crypto.randomUUID(),
      data: JSON.parse(JSON.stringify(source.data)),
    };
    const idx = page.sections.findIndex((s) => s.id === id);
    const next = [...page.sections];
    next.splice(idx + 1, 0, copy);
    set({
      page: { ...page, sections: next.map((s, i) => ({ ...s, order: i })) },
      dirty: true,
      selectedSectionId: copy.id,
    });
  },

  reorderSections(orderedIds) {
    const { page } = get();
    if (!page) return;
    const map = new Map(page.sections.map((s) => [s.id, s]));
    const reordered = orderedIds
      .map((id, i) => {
        const s = map.get(id);
        return s ? { ...s, order: i } : null;
      })
      .filter((s): s is SectionRecord => s !== null);
    set({ page: { ...page, sections: reordered }, dirty: true });
  },

  selectSection(id) {
    set({ selectedSectionId: id });
  },
}));
