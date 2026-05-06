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
 * To add a new section type:
 *   1. Define the Zod schema below
 *   2. Add it to SECTION_SCHEMAS map
 *   3. Add the editor field config to SECTION_FIELDS
 *   4. Map the type → React component in src/cms/renderer/sectionMap.ts
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared field types
// ─────────────────────────────────────────────────────────────────────────────

export const ImageRefSchema = z.object({
  url: z.string().url().or(z.literal('')),
  alt: z.string().default(''),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

export const ButtonSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(['primary', 'outline', 'ghost']).default('primary'),
});
export type Button = z.infer<typeof ButtonSchema>;

export const CardItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().default(''),
  image: ImageRefSchema.optional(),
  href: z.string().optional(),
  icon: z.string().optional(), // lucide icon name
});
export type CardItem = z.infer<typeof CardItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Section type schemas
// ─────────────────────────────────────────────────────────────────────────────

export const HeroSectionSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().min(1),
  subtitle: z.string().default(''),
  description: z.string().default(''),
  backgroundImage: ImageRefSchema.optional(),
  primaryButton: ButtonSchema.optional(),
  secondaryButton: ButtonSchema.optional(),
  align: z.enum(['left', 'center']).default('left'),
  size: z.enum(['compact', 'default', 'large']).default('default'),
});

export const BannerSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  image: ImageRefSchema.optional(),
  button: ButtonSchema.optional(),
  theme: z.enum(['brand', 'soft', 'gold']).default('brand'),
});

export const RichTextSectionSchema = z.object({
  title: z.string().default(''),
  body: z.string().default(''), // HTML from TipTap
  maxWidth: z.enum(['narrow', 'normal', 'wide']).default('normal'),
});

export const StatsSectionSchema = z.object({
  title: z.string().default(''),
  stats: z
    .array(
      z.object({
        id: z.string(),
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(1)
    .max(6),
});

export const CardsSectionSchema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().min(1),
  description: z.string().default(''),
  layout: z.enum(['grid-3', 'grid-4', 'grid-2', 'list']).default('grid-3'),
  cards: z.array(CardItemSchema).min(1),
});

export const GallerySectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  images: z.array(ImageRefSchema).min(1),
  layout: z.enum(['grid-3', 'grid-4', 'masonry', 'carousel']).default('grid-3'),
});

export const PrincipalMessageSchema = z.object({
  eyebrow: z.string().default('Message from the Principal'),
  name: z.string().min(1),
  role: z.string().default('Principal'),
  portrait: ImageRefSchema.optional(),
  message: z.string().default(''), // HTML
  signature: z.string().default(''),
});

export const CTASectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  primaryButton: ButtonSchema.optional(),
  secondaryButton: ButtonSchema.optional(),
  backgroundImage: ImageRefSchema.optional(),
  theme: z.enum(['brand', 'soft', 'dark']).default('brand'),
});

export const TestimonialsSchema = z.object({
  title: z.string().default(''),
  testimonials: z
    .array(
      z.object({
        id: z.string(),
        quote: z.string().min(1),
        author: z.string().min(1),
        role: z.string().default(''),
        avatar: ImageRefSchema.optional(),
      }),
    )
    .min(1),
});

export const FAQSectionSchema = z.object({
  title: z.string().default('Frequently Asked Questions'),
  items: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .min(1),
});

export const VideoSectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  videoUrl: z.string().url(),
  poster: ImageRefSchema.optional(),
});

export const TimelineSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  steps: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().default(''),
      }),
    )
    .min(1),
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
    description: 'Reusable grid of card items',
    icon: 'LayoutGrid',
    category: 'Content',
  },
  gallery: {
    label: 'Gallery',
    description: 'Image grid, masonry, or carousel',
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
    description: 'Embedded video with poster image',
    icon: 'Video',
    category: 'Media',
  },
  timeline: {
    label: 'Timeline',
    description: 'Numbered steps (e.g., admissions process)',
    icon: 'ListOrdered',
    category: 'Content',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Page model
// ─────────────────────────────────────────────────────────────────────────────

export const SectionRecordSchema = z.object({
  id: z.string(),
  type: z.enum(SECTION_TYPES),
  data: z.record(z.any()), // validated per-type at edit time
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
  key: z.string(), // home, about/school, curriculum, ...
  title: z.string(),
  description: z.string().default(''),
  status: z.enum(['draft', 'published']).default('draft'),
  sections: z.array(SectionRecordSchema),
  seo: SEOSchema,
  updatedAt: z.string(),
});
export type Page = z.infer<typeof PageSchema>;

// Helper to validate a section's data against its type schema
export function validateSection<T extends SectionType>(
  type: T,
  data: unknown,
): { ok: true; data: SectionData<T> } | { ok: false; error: z.ZodError } {
  const schema = SECTION_SCHEMAS[type];
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data as SectionData<T> };
  return { ok: false, error: result.error };
}
