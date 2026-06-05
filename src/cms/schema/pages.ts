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
  'image_text',
  'stats',
  'cards',
  'gallery',
  'principal_message',
  'cta',
  'testimonials',
  'faq',
  'video',
  'timeline',
  'events_feed',
  'contact_info',
  'contact_form',
  'map',
  'fees_tuition',
  'leadership',
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
    allowedSections: ['hero', 'principal_message', 'leadership', 'cards', 'rich_text', 'gallery'],
    defaultSections: [
      { type: 'hero', data: { title: 'Meet Our Leaders', size: 'compact' } },
      {
        type: 'principal_message',
        data: {
          name: 'Dr. Ahmad Al-Hassan',
          role: 'Principal',
          message: '<p>Welcome to our school community…</p>',
        },
      },
      { type: 'leadership', data: {} },
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
    description: 'Application process, requirements, fees, and FAQ',
    allowedSections: 'all',
    defaultSections: [
      { type: 'hero', data: { title: 'Begin Your Journey With Us', subtitle: 'Everything you need to know about joining Norol Iman Islamic School.', size: 'compact' } },
      {
        type: 'timeline',
        data: {
          title: 'Admission Step By Step',
          layout: 'zigzag',
          steps: [
            { id: '1', title: 'Inquiry', description: 'Contact our admissions office or fill out an inquiry form online.' },
            { id: '2', title: 'Campus Visit', description: 'Schedule a visit to see our facilities and meet our team.' },
            { id: '3', title: 'Application', description: 'Submit the completed application form with required documents.' },
            { id: '4', title: 'Assessment', description: 'Student completes a brief academic and language assessment.' },
            { id: '5', title: 'Interview', description: 'Family interview with our admissions coordinator.' },
            { id: '6', title: 'Enrollment', description: 'Receive offer letter and complete enrollment formalities.' },
          ],
        },
      },
      { type: 'fees_tuition', data: {} },
      {
        type: 'faq',
        data: {
          title: 'Frequently Asked Questions',
          items: [
            { id: '1', question: 'What documents are required for admission?', answer: 'Birth certificate, previous school records, passport photo, and a completed application form.' },
            { id: '2', question: 'What is the application timeline?', answer: 'Applications open in October and close in December for the following academic year.' },
            { id: '3', question: 'Do you offer scholarships?', answer: 'Yes, we offer merit-based scholarships. Contact our admissions office for details.' },
            { id: '4', question: 'What languages are taught?', answer: 'Khmer, Arabic, and English are taught across the curriculum.' },
          ],
        },
      },
    ],
  },
  {
    key: 'events',
    title: 'News & Events',
    route: '/events',
    description: 'Events listing page (the page header — individual events managed under News & Events module)',
    allowedSections: 'all',
    defaultSections: [
      {
        type: 'hero',
        data: {
          title: 'News & Events',
          subtitle: 'Latest news, upcoming events, and community highlights from our school.',
          size: 'compact',
        },
      },
      {
        type: 'events_feed',
        data: {
          title: 'All events',
          limit: 12,
          category: 'All',
          layout: 'grid-3',
          showViewAll: false,
        },
      },
    ],
  },
  {
    key: 'contact',
    title: 'Contact',
    route: '/contact',
    description: 'Contact information, form, and map',
    allowedSections: 'all',
    defaultSections: [
      {
        type: 'hero',
        data: {
          title: 'Contact Us',
          subtitle: 'We would love to hear from you.',
          size: 'compact',
        },
      },
      {
        type: 'contact_info',
        data: {
          title: 'Get in touch',
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
        },
      },
      {
        type: 'contact_form',
        data: {
          title: "Let's keep in touch",
          description: 'Reach out with any question — we typically respond within two business days.',
        },
      },
      {
        type: 'map',
        data: { title: 'Find Us on Map' },
      },
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
