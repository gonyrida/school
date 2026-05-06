import { create } from 'zustand';
import type { MediaItem } from '@/cms/api';
import { cms } from '@/cms/api';

interface MediaState {
  items: MediaItem[];
  loading: boolean;
  uploading: boolean;
  folder: string;
  search: string;

  setFolder(folder: string): void;
  setSearch(search: string): void;
  refresh(): Promise<void>;
  upload(files: FileList | File[], folder?: string): Promise<MediaItem[]>;
  remove(id: string): Promise<void>;
  updateAlt(id: string, alt: string): Promise<void>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  items: [],
  loading: false,
  uploading: false,
  folder: '',
  search: '',

  setFolder(folder) {
    set({ folder });
    void get().refresh();
  },

  setSearch(search) {
    set({ search });
  },

  async refresh() {
    set({ loading: true });
    try {
      const items = await cms.listMedia(get().folder || undefined);
      set({ items, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  async upload(files, folder) {
    set({ uploading: true });
    const targetFolder = folder ?? get().folder ?? 'uploads';
    try {
      const fileList = Array.from(files);
      const uploaded: MediaItem[] = [];
      for (const file of fileList) {
        const item = await cms.uploadMedia(file, targetFolder || 'uploads');
        uploaded.push(item);
      }
      set((s) => ({ items: [...uploaded, ...s.items], uploading: false }));
      return uploaded;
    } catch (err) {
      set({ uploading: false });
      throw err;
    }
  },

  async remove(id) {
    await cms.deleteMedia(id);
    set((s) => ({ items: s.items.filter((m) => m.id !== id) }));
  },

  async updateAlt(id, alt) {
    const updated = await cms.updateMediaAlt(id, alt);
    set((s) => ({ items: s.items.map((m) => (m.id === id ? updated : m)) }));
  },
}));
