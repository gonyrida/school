import type { SectionType } from './sections';

/**
 * PAGE REGISTRY
 * =============
 * The list of pages the admin can manage. Each entry defines:
 *  - the route on the public site
 *  - which section types are allowed (so admins don't add a "hero" to a "FAQ-only" page)
 *  - default sections to seed when creating the page for the first time
 */

export interface PageDefinition {
  key: string;
  title: string;
  route: string;
  description: string;
  allowedSections: SectionType[] | 'all';
  defaultSections: Array<{ type: SectionType; data: Record<string, unknown> }>;
}

const ALL_SECTIONS: SectionType[] = [
  'hero',
  'banner',
  'rich_text',
  'stats',
  'cards',
  'gallery',
  'principal_message',
  'cta',
  'testimonials',
  'faq',
  'video',
  'timeline',
];

export const PAGE_REGISTRY: PageDefinition[] = [
  {
    key: 'home',
    title: 'Home',
    route: '/',
    description: 'The main landing page',
    allowedSections: 'all',
    defaultSections: [
      {
        type: 'hero',
        data: {
          eyebrow: 'Welcome to',
          title: 'Norol Iman High School',
          subtitle: 'A modern learning environment rooted in faith and excellence.',
          align: 'left',
          size: 'large',
          primaryButton: { label: 'Apply Now', href: '/admissions', variant: 'primary' },
          secondaryButton: { label: 'Learn More', href: '/about/school', variant: 'outline' },
        },
      },
      {
        type: 'cards',
        data: {
          eyebrow: 'Education Pathway',
          title: 'A path for every learner',
          layout: 'grid-3',
          cards: [
            { id: '1', title: 'Kindergarten', description: 'Ages 3–5' },
            { id: '2', title: 'Elementary', description: 'Ages 6–11' },
            { id: '3', title: 'Junior High', description: 'Ages 12–14' },
          ],
        },
      },
    ],
  },
  {
    key: 'about/school',
    title: 'About — School',
    route: '/about/school',
    description: 'School overview, history, vision and mission',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'About Our School', size: 'compact' } },
      { type: 'rich_text', data: { title: 'Our History', body: '<p>Founded with a mission…</p>' } },
    ],
  },
  {
    key: 'about/leader',
    title: 'About — Leader',
    route: '/about/leader',
    description: 'Principal message, leadership team, and staff',
    allowedSections: ['hero', 'principal_message', 'cards', 'rich_text'],
    defaultSections: [
      { type: 'hero', data: { title: 'Meet Our Leader', size: 'compact' } },
      {
        type: 'principal_message',
        data: {
          name: 'Dr. Ahmad Al-Hassan',
          role: 'Principal',
          message: '<p>Welcome to our school community…</p>',
        },
      },
    ],
  },
  {
    key: 'about/dormitory',
    title: 'About — Dormitory',
    route: '/about/dormitory',
    description: 'Dormitory facilities and student life',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Dormitory & Student Life', size: 'compact' } },
    ],
  },
  {
    key: 'curriculum',
    title: 'Curriculum — Overview',
    route: '/curriculum',
    description: 'Curriculum overview across all levels',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Our Curriculum', size: 'compact' } },
    ],
  },
  {
    key: 'curriculum/kindergarten',
    title: 'Curriculum — Kindergarten',
    route: '/curriculum/kindergarten',
    description: 'Kindergarten level curriculum',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Kindergarten', size: 'compact' } },
    ],
  },
  {
    key: 'curriculum/elementary',
    title: 'Curriculum — Elementary',
    route: '/curriculum/elementary',
    description: 'Elementary level curriculum',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Elementary', size: 'compact' } },
    ],
  },
  {
    key: 'admissions',
    title: 'Admissions',
    route: '/admissions',
    description: 'Application process and requirements',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Admissions', size: 'compact' } },
      {
        type: 'timeline',
        data: {
          title: 'How to Apply',
          steps: [
            { id: '1', title: 'Submit Application', description: 'Complete the online form' },
            { id: '2', title: 'Document Review', description: 'We review your documents' },
            { id: '3', title: 'Interview', description: 'Meet our admissions team' },
          ],
        },
      },
    ],
  },
  {
    key: 'events',
    title: 'News & Events',
    route: '/events',
    description: 'Events listing page (events themselves managed under News & Events module)',
    allowedSections: ['hero', 'banner', 'rich_text'],
    defaultSections: [
      { type: 'hero', data: { title: 'News & Events', size: 'compact' } },
    ],
  },
  {
    key: 'contact',
    title: 'Contact',
    route: '/contact',
    description: 'Contact information and form',
    allowedSections: ['hero', 'rich_text', 'cta'],
    defaultSections: [
      { type: 'hero', data: { title: 'Contact Us', size: 'compact' } },
    ],
  },
  {
    key: 'support',
    title: 'Support Our School',
    route: '/support',
    description: 'Donations and sponsorship',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Support Our School', size: 'compact' } },
    ],
  },
];

export function getPageDefinition(key: string): PageDefinition | undefined {
  return PAGE_REGISTRY.find((p) => p.key === key);
}

export function isAllowedSection(pageKey: string, type: SectionType): boolean {
  const def = getPageDefinition(pageKey);
  if (!def) return true;
  if (def.allowedSections === 'all') return ALL_SECTIONS.includes(type);
  return def.allowedSections.includes(type);
}
