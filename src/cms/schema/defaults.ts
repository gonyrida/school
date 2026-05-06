import type { SectionType, SectionData } from './sections';

/**
 * Default data for a brand-new section. Every value here must satisfy the
 * Zod schema for its type, so a freshly added section is immediately valid
 * and renders without errors.
 *
 * Admins can edit any of these placeholders right after adding the section.
 */

export function getDefaultSectionData<T extends SectionType>(type: T): SectionData<T> {
  switch (type) {
    case 'hero':
      return {
        eyebrow: '',
        title: 'New hero title',
        subtitle: '',
        description: '',
        align: 'left',
        size: 'default',
      } as SectionData<T>;

    case 'banner':
      return {
        title: 'New banner',
        description: '',
        theme: 'brand',
      } as SectionData<T>;

    case 'rich_text':
      return {
        title: '',
        body: '<p>Start writing…</p>',
        maxWidth: 'normal',
      } as SectionData<T>;

    case 'stats':
      return {
        title: '',
        stats: [
          { id: crypto.randomUUID(), value: '100+', label: 'Students' },
          { id: crypto.randomUUID(), value: '20+', label: 'Teachers' },
          { id: crypto.randomUUID(), value: '15', label: 'Years' },
        ],
      } as SectionData<T>;

    case 'cards':
      return {
        eyebrow: '',
        title: 'New card grid',
        description: '',
        layout: 'grid-3',
        cards: [
          { id: crypto.randomUUID(), title: 'Card one', description: '' },
          { id: crypto.randomUUID(), title: 'Card two', description: '' },
          { id: crypto.randomUUID(), title: 'Card three', description: '' },
        ],
      } as SectionData<T>;

    case 'gallery':
      return {
        title: '',
        description: '',
        layout: 'grid-3',
        images: [{ url: '', alt: '' }],
      } as SectionData<T>;

    case 'principal_message':
      return {
        eyebrow: 'Message from the Principal',
        name: 'Principal Name',
        role: 'Principal',
        message: '<p>Welcome to our school community…</p>',
        signature: '',
      } as SectionData<T>;

    case 'cta':
      return {
        title: 'Ready to get started?',
        description: '',
        theme: 'brand',
      } as SectionData<T>;

    case 'testimonials':
      return {
        title: 'What people say',
        testimonials: [
          {
            id: crypto.randomUUID(),
            quote: 'A wonderful school with a caring community.',
            author: 'A parent',
            role: '',
          },
        ],
      } as SectionData<T>;

    case 'faq':
      return {
        title: 'Frequently Asked Questions',
        items: [
          {
            id: crypto.randomUUID(),
            question: 'What are your school hours?',
            answer: 'Our school day runs from 7:30 AM to 3:00 PM.',
          },
        ],
      } as SectionData<T>;

    case 'video':
      return {
        title: '',
        description: '',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      } as SectionData<T>;

    case 'timeline':
      return {
        title: 'How it works',
        description: '',
        steps: [
          { id: crypto.randomUUID(), title: 'Step one', description: '' },
          { id: crypto.randomUUID(), title: 'Step two', description: '' },
          { id: crypto.randomUUID(), title: 'Step three', description: '' },
        ],
      } as SectionData<T>;

    default: {
      // Exhaustiveness check — TS will error if a new SectionType is added
      // without a default here.
      const _exhaustive: never = type;
      void _exhaustive;
      return {} as SectionData<T>;
    }
  }
}