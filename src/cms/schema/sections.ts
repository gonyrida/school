import { z } from 'zod';

/**
 * SECTION SCHEMA SYSTEM
 * ====================
 *
 * Every page is a list of "sections". Each section has:
 *  - a `type` (hero, banner, gallery, cards, ...)
 *  - a `data` object validated by a Zod schema specific to that type
 *  - a `visible` flag (admin can hide without deleting)
 *  - an `order` index for drag-and-drop reordering
 *
 * Required-ness of fields inside repeater items is enforced by the editor
 * UI, not the schema. The schema is permissive about empty strings inside
 * arrays so newly added items don't immediately fail validation.
 *
 * To add a new section type:
 *   1. Define the Zod schema below
 *   2. Add it to SECTION_SCHEMAS map
 *   3. Add the editor field config to SECTION_FIELDS
 *   4. Map the type → React component in src/cms/renderer/PageRenderer.tsx
 *   5. Add a default-data factory in src/cms/schema/defaults.ts
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

export const ImageRefSchema = z.object({
  url: z.string().default(''),
  alt: z.string().default(''),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

export const ButtonSchema = z.object({
  label: z.string().default(''),
  href: z.string().default(''),
  variant: z.enum(['primary', 'outline', 'ghost']).default('primary'),
});
export type Button = z.infer<typeof ButtonSchema>;

/**
 * BackgroundSchema — every section can have an optional wrapper background.
 * Picks one of: solid color (hex/CSS color), brand preset, gradient preset,
 * or "none" (transparent / inherit).
 */
export const BackgroundSchema = z
  .object({
    type: z.enum(['none', 'color', 'brand', 'soft', 'dark', 'muted']).default('none'),
    color: z.string().default(''), // used when type === 'color'
  })
  .default({ type: 'none', color: '' });
export type Background = z.infer<typeof BackgroundSchema>;

/**
 * CardItemSchema — extended for the Card Grid section update.
 * Visual element can be either an uploaded image, an image URL, or a lucide icon name.
 * The card itself controls inner alignment and shape.
 */
export const CardItemSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().default(''),
  // Visual element — either an image (with url) or an icon name (lucide-react)
  visual: z
    .object({
      kind: z.enum(['none', 'image', 'icon']).default('none'),
      image: ImageRefSchema.optional(),
      iconName: z.string().default(''), // e.g. "GraduationCap", "BookOpen"
      shape: z.enum(['square', 'rounded', 'circle']).default('rounded'),
      // Position of the visual relative to text
      position: z.enum(['top', 'left', 'right']).default('top'),
    })
    .default({ kind: 'none', iconName: '', shape: 'rounded', position: 'top' }),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
  // Whether the description should render collapsed (toggle reveal)
  collapsibleDescription: z.boolean().default(false),
  href: z.string().default(''),
});
export type CardItem = z.infer<typeof CardItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Section type schemas
// ─────────────────────────────────────────────────────────────────────────────

export const HeroSectionSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().default(''),
  subtitle: z.string().default(''),
  description: z.string().default(''),
  backgroundImage: ImageRefSchema.optional(),
  primaryButton: ButtonSchema.optional(),
  secondaryButton: ButtonSchema.optional(),
  align: z.enum(['left', 'center']).default('left'),
  size: z.enum(['compact', 'default', 'large']).default('default'),
  background: BackgroundSchema,
});

export const BannerSectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  image: ImageRefSchema.optional(),
  button: ButtonSchema.optional(),
  theme: z.enum(['brand', 'soft', 'gold']).default('brand'),
  background: BackgroundSchema,
});

export const RichTextSectionSchema = z.object({
  title: z.string().default(''),
  body: z.string().default(''), // HTML from TipTap
  maxWidth: z.enum(['narrow', 'normal', 'wide']).default('normal'),
  background: BackgroundSchema,
});

export const StatsSectionSchema = z.object({
  title: z.string().default(''),
  stats: z.array(
    z.object({
      id: z.string(),
      value: z.string().default(''),
      label: z.string().default(''),
    }),
  ),
  background: BackgroundSchema,
});

export const CardsSectionSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  layout: z.enum(['grid-2', 'grid-3', 'grid-4', 'list']).default('grid-3'),
  // Default text alignment for all cards (each card can override)
  defaultTextAlign: z.enum(['left', 'center', 'right']).default('left'),
  cards: z.array(CardItemSchema),
  background: BackgroundSchema,
});

export const GallerySectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  images: z.array(ImageRefSchema),
  layout: z
    .enum(['standard-grid', 'masonry', 'justified', 'metro', 'carousel'])
    .default('standard-grid'),
  columns: z.enum(['2', '3', '4', '5']).default('3'),
  gap: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  background: BackgroundSchema,
});

export const PrincipalMessageSchema = z.object({
  eyebrow: z.string().default('Message from the Principal'),
  name: z.string().default(''),
  role: z.string().default('Principal'),
  portrait: ImageRefSchema.optional(),
  message: z.string().default(''), // HTML
  signature: z.string().default(''),
  background: BackgroundSchema,
});

export const CTASectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  primaryButton: ButtonSchema.optional(),
  secondaryButton: ButtonSchema.optional(),
  backgroundImage: ImageRefSchema.optional(),
  theme: z.enum(['brand', 'soft', 'dark']).default('brand'),
  background: BackgroundSchema,
});

export const TestimonialsSchema = z.object({
  title: z.string().default(''),
  testimonials: z.array(
    z.object({
      id: z.string(),
      quote: z.string().default(''),
      author: z.string().default(''),
      role: z.string().default(''),
      avatar: ImageRefSchema.optional(),
    }),
  ),
  background: BackgroundSchema,
});

export const FAQSectionSchema = z.object({
  title: z.string().default('Frequently Asked Questions'),
  items: z.array(
    z.object({
      id: z.string(),
      question: z.string().default(''),
      answer: z.string().default(''),
    }),
  ),
  background: BackgroundSchema,
});

export const VideoSectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  videoUrl: z.string().default(''),
  poster: ImageRefSchema.optional(),
  background: BackgroundSchema,
});

export const TimelineSectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  // Visual style: 'zigzag' alternates left/right (matching the design),
  // 'vertical' stacks them, 'horizontal' is a row.
  layout: z.enum(['zigzag', 'vertical', 'horizontal']).default('zigzag'),
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string().default(''),
      description: z.string().default(''),
    }),
  ),
  background: BackgroundSchema,
});

/**
 * EventsFeedSection — display latest published events as cards.
 * Lets admins drop the events list onto the home page or anywhere else.
 */
export const EventsFeedSectionSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().default('Latest News & Events'),
  description: z.string().default(''),
  limit: z.number().int().min(1).max(12).default(3),
  category: z.enum(['All', 'Academy', 'Sports', 'Arts', 'Community']).default('All'),
  layout: z.enum(['grid-2', 'grid-3']).default('grid-3'),
  showViewAll: z.boolean().default(true),
  viewAllLabel: z.string().default('View all events'),
  background: BackgroundSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Section type registry
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_TYPES = [
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
  'events_feed',
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_SCHEMAS = {
  hero: HeroSectionSchema,
  banner: BannerSectionSchema,
  rich_text: RichTextSectionSchema,
  stats: StatsSectionSchema,
  cards: CardsSectionSchema,
  gallery: GallerySectionSchema,
  principal_message: PrincipalMessageSchema,
  cta: CTASectionSchema,
  testimonials: TestimonialsSchema,
  faq: FAQSectionSchema,
  video: VideoSectionSchema,
  timeline: TimelineSectionSchema,
  events_feed: EventsFeedSectionSchema,
} as const;

export type SectionData<T extends SectionType = SectionType> = z.infer<
  (typeof SECTION_SCHEMAS)[T]
>;

// Display metadata for the section picker UI
export const SECTION_META: Record<
  SectionType,
  { label: string; description: string; icon: string; category: string }
> = {
  hero: {
    label: 'Hero',
    description: 'Large headline with optional CTA buttons',
    icon: 'Sparkles',
    category: 'Header',
  },
  banner: {
    label: 'Banner',
    description: 'Full-width promotional banner',
    icon: 'Megaphone',
    category: 'Header',
  },
  rich_text: {
    label: 'Rich Text',
    description: 'Formatted text content with TipTap editor',
    icon: 'AlignLeft',
    category: 'Content',
  },
  stats: {
    label: 'Statistics',
    description: 'Numerical highlights (students, awards, etc.)',
    icon: 'TrendingUp',
    category: 'Content',
  },
  cards: {
    label: 'Card Grid',
    description: 'Grid of cards with images or icons, customizable layout',
    icon: 'LayoutGrid',
    category: 'Content',
  },
  gallery: {
    label: 'Gallery',
    description: 'Image grid: standard, masonry, justified, metro, or carousel',
    icon: 'Images',
    category: 'Media',
  },
  principal_message: {
    label: 'Principal Message',
    description: 'Quote or message from school leadership',
    icon: 'Quote',
    category: 'Content',
  },
  cta: {
    label: 'Call to Action',
    description: 'Conversion-focused section with buttons',
    icon: 'MousePointerClick',
    category: 'Conversion',
  },
  testimonials: {
    label: 'Testimonials',
    description: 'Quotes from parents, students, or alumni',
    icon: 'MessageCircle',
    category: 'Content',
  },
  faq: {
    label: 'FAQ',
    description: 'Frequently asked questions accordion',
    icon: 'HelpCircle',
    category: 'Content',
  },
  video: {
    label: 'Video',
    description: 'Embedded YouTube/Vimeo video',
    icon: 'Video',
    category: 'Media',
  },
  timeline: {
    label: 'Timeline',
    description: 'Numbered steps (e.g., admissions process)',
    icon: 'ListOrdered',
    category: 'Content',
  },
  events_feed: {
    label: 'Events Feed',
    description: 'Display latest news & events on any page',
    icon: 'Calendar',
    category: 'Content',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Page model
// ─────────────────────────────────────────────────────────────────────────────

export const SectionRecordSchema = z.object({
  id: z.string(),
  type: z.enum(SECTION_TYPES),
  data: z.record(z.any()),
  visible: z.boolean().default(true),
  order: z.number().int(),
});
export type SectionRecord = z.infer<typeof SectionRecordSchema>;

export const SEOSchema = z.object({
  metaTitle: z.string().default(''),
  metaDescription: z.string().default(''),
  ogImage: ImageRefSchema.optional(),
  slug: z.string().default(''),
});
export type SEO = z.infer<typeof SEOSchema>;

export const PageSchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string(),
  description: z.string().default(''),
  status: z.enum(['draft', 'published']).default('draft'),
  sections: z.array(SectionRecordSchema),
  seo: SEOSchema,
  updatedAt: z.string(),
});
export type Page = z.infer<typeof PageSchema>;

export function validateSection<T extends SectionType>(
  type: T,
  data: unknown,
): { ok: true; data: SectionData<T> } | { ok: false; error: z.ZodError } {
  const schema = SECTION_SCHEMAS[type];
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data as SectionData<T> };
  return { ok: false, error: result.error };
}
