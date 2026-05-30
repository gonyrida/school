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

    case 'image_text':
      return {
        eyebrow: '',
        title: 'Image with text',
        body: '<p>Add some descriptive text here. You can use <strong>bold</strong>, <em>italics</em>, lists, and links.</p>',
        imagePosition: 'left',
        imageShape: 'rounded',
        verticalAlign: 'center',
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

    case 'cards': {
      const makeCard = (title: string): unknown => ({
        id: crypto.randomUUID(),
        title,
        descriptionMode: 'paragraph',
        description: 'Short description',
        descriptionList: [],
        visual: {
          kind: 'none',
          iconName: '',
          shape: 'rounded',
          size: 56,
          position: 'top',
        },
        textAlign: 'inherit',
        collapsibleDescription: false,
        href: '',
        cardBackground: { type: 'inherit', color: '' },
        buttonAlign: 'left',
      });
      return {
        eyebrow: '',
        title: 'New card grid',
        description: '',
        titleAlign: 'left',
        layout: 'grid-3',
        lastCardPosition: 'left',
        defaultTextAlign: 'center',
        cards: [makeCard('Card one'), makeCard('Card two'), makeCard('Card three')],
        background: noBg,
      } as SectionData<T>;
    }

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

    case 'contact_info':
      return {
        eyebrow: '',
        title: 'Get in touch',
        description: '',
        titleAlign: 'center',
        layout: 'grid-3',
        items: [
          {
            id: crypto.randomUUID(),
            label: 'Address',
            value: 'Phnom Penh, Cambodia',
            icon: 'MapPin',
            href: '',
          },
          {
            id: crypto.randomUUID(),
            label: 'Phone',
            value: '+855 12 345 678',
            icon: 'Phone',
            href: 'tel:+85512345678',
          },
          {
            id: crypto.randomUUID(),
            label: 'Email',
            value: 'info@noroliman.com',
            icon: 'Mail',
            href: 'mailto:info@noroliman.com',
          },
        ],
        background: noBg,
      } as SectionData<T>;

    case 'contact_form':
      return {
        eyebrow: '',
        title: "Let's keep in touch",
        description:
          'Reach out with any question — we typically respond within two business days.',
        titleAlign: 'left',
        nameLabel: 'Your Full Name',
        emailLabel: 'Your Email',
        messageLabel: 'Your Message',
        submitLabel: 'Send Message',
        successMessage: "Thanks! We'll be in touch soon.",
        submitUrl: '',
        background: noBg,
      } as SectionData<T>;

    case 'map':
      return {
        title: 'Find Us on Map',
        description: '',
        titleAlign: 'center',
        embedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62649.18!2d104.8773!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951298b8b8b8b%3A0x0!2sPhnom+Penh!5e0!3m2!1sen!2skh!4v1700000000000',
        height: 'medium',
        background: noBg,
      } as SectionData<T>;

    default: {
      const _exhaustive: never = type;
      void _exhaustive;
      return {} as SectionData<T>;
    }
  }
}
