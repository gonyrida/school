import type { SectionType, SectionData } from './sections';

/**
 * Default data for a brand-new section. Every value here must satisfy the
 * Zod schema for its type, so a freshly added section is immediately valid
 * and renders without errors.
 */

const noBg = { type: 'none' as const, color: '' };

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
        background: noBg,
      } as SectionData<T>;

    case 'banner':
      return {
        title: 'New banner',
        description: '',
        theme: 'brand',
        background: noBg,
      } as SectionData<T>;

    case 'rich_text':
      return {
        title: '',
        body: '<p>Start writing…</p>',
        maxWidth: 'normal',
        background: noBg,
      } as SectionData<T>;

    case 'stats':
      return {
        title: '',
        stats: [
          { id: crypto.randomUUID(), value: '100+', label: 'Students' },
          { id: crypto.randomUUID(), value: '20+', label: 'Teachers' },
          { id: crypto.randomUUID(), value: '15', label: 'Years' },
        ],
        background: noBg,
      } as SectionData<T>;

    case 'cards':
      return {
        eyebrow: '',
        title: 'New card grid',
        description: '',
        layout: 'grid-3',
        defaultTextAlign: 'left',
        cards: [
          {
            id: crypto.randomUUID(),
            title: 'Card one',
            description: 'Short description',
            visual: { kind: 'none', iconName: '', shape: 'rounded', position: 'top' },
            textAlign: 'left',
            collapsibleDescription: false,
            href: '',
          },
          {
            id: crypto.randomUUID(),
            title: 'Card two',
            description: 'Short description',
            visual: { kind: 'none', iconName: '', shape: 'rounded', position: 'top' },
            textAlign: 'left',
            collapsibleDescription: false,
            href: '',
          },
          {
            id: crypto.randomUUID(),
            title: 'Card three',
            description: 'Short description',
            visual: { kind: 'none', iconName: '', shape: 'rounded', position: 'top' },
            textAlign: 'left',
            collapsibleDescription: false,
            href: '',
          },
        ],
        background: noBg,
      } as SectionData<T>;

    case 'gallery':
      return {
        title: '',
        description: '',
        layout: 'standard-grid',
        columns: '3',
        gap: 'md',
        images: [],
        background: noBg,
      } as SectionData<T>;

    case 'principal_message':
      return {
        eyebrow: 'Message from the Principal',
        name: 'Principal Name',
        role: 'Principal',
        message: '<p>Welcome to our school community…</p>',
        signature: '',
        background: noBg,
      } as SectionData<T>;

    case 'cta':
      return {
        title: 'Ready to get started?',
        description: '',
        theme: 'brand',
        background: noBg,
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
        background: noBg,
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
        background: noBg,
      } as SectionData<T>;

    case 'video':
      return {
        title: '',
        description: '',
        videoUrl: '',
        background: noBg,
      } as SectionData<T>;

    case 'timeline':
      return {
        title: 'Timeline',
        description: '',
        layout: 'zigzag',
        steps: [
          { id: crypto.randomUUID(), title: 'Step one', description: 'Describe this step.' },
          { id: crypto.randomUUID(), title: 'Step two', description: 'Describe this step.' },
          { id: crypto.randomUUID(), title: 'Step three', description: 'Describe this step.' },
        ],
        background: noBg,
      } as SectionData<T>;

    case 'events_feed':
      return {
        eyebrow: '',
        title: 'Latest News & Events',
        description: '',
        limit: 3,
        category: 'All',
        layout: 'grid-3',
        showViewAll: true,
        viewAllLabel: 'View all events',
        background: noBg,
      } as SectionData<T>;

    default: {
      const _exhaustive: never = type;
      void _exhaustive;
      return {} as SectionData<T>;
    }
  }
}
