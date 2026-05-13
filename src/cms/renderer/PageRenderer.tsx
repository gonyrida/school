import type { ComponentType } from 'react';
import type { SectionRecord, SectionType, Page } from '@/cms/schema/sections';
import { validateSection } from '@/cms/schema/sections';
import { getDefaultSectionData } from '@/cms/schema/defaults';
import { migrateSectionData } from '@/cms/schema/migrations';
import {
  HeroRenderer,
  BannerRenderer,
  RichTextRenderer,
  ImageTextRenderer,
  StatsRenderer,
  CardsRenderer,
  GalleryRenderer,
  PrincipalMessageRenderer,
  CTARenderer,
  TestimonialsRenderer,
  FAQRenderer,
  VideoRenderer,
  TimelineRenderer,
  EventsFeedRenderer,
  ContactInfoRenderer,
  ContactFormRenderer,
  MapRenderer,
} from './sectionRenderers';

/**
 * Section type → component map. Adding a new section type means:
 *   1. Add the schema (cms/schema/sections.ts)
 *   2. Build the renderer (cms/renderer/sectionRenderers.tsx)
 *   3. Register it here
 *   4. Add field config to the editor (cms/admin/sectionEditor/fieldConfig.ts)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_COMPONENTS: Record<SectionType, ComponentType<{ data: any }>> = {
  hero: HeroRenderer,
  banner: BannerRenderer,
  rich_text: RichTextRenderer,
  image_text: ImageTextRenderer,
  stats: StatsRenderer,
  cards: CardsRenderer,
  gallery: GalleryRenderer,
  principal_message: PrincipalMessageRenderer,
  cta: CTARenderer,
  testimonials: TestimonialsRenderer,
  faq: FAQRenderer,
  video: VideoRenderer,
  timeline: TimelineRenderer,
  events_feed: EventsFeedRenderer,
  contact_info: ContactInfoRenderer,
  contact_form: ContactFormRenderer,
  map: MapRenderer,
};

interface SectionRendererProps {
  section: SectionRecord;
  // When true (admin preview), render hidden sections with reduced opacity
  // instead of skipping them.
  showHidden?: boolean;
}

export function SectionRenderer({ section, showHidden = false }: SectionRendererProps) {
  if (!section.visible && !showHidden) return null;

  const Component = SECTION_COMPONENTS[section.type];
  if (!Component) {
    return (
      <div className="container-page py-8">
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-amber-900">
          <p className="font-semibold">Unknown section type: {section.type}</p>
        </div>
      </div>
    );
  }

  // Migrate old saved data to the current schema shape before validating.
  // (e.g. gallery's `layout: 'grid-3'` was renamed to `'standard-grid'`.)
  const migrated = migrateSectionData(section.type, section.data);

  // Validate at render time. If the saved data is incomplete (e.g. a fresh
  // section the admin hasn't filled in yet), merge with defaults and try
  // again. This keeps the editor experience smooth — admins see a working
  // preview they can edit, not a "Invalid section data" wall.
  let result = validateSection(section.type, migrated);
  if (!result.ok) {
    const defaults = getDefaultSectionData(section.type) as Record<string, unknown>;
    const merged = { ...defaults, ...(migrated as Record<string, unknown>) };
    result = validateSection(section.type, merged);
  }

  if (!result.ok) {
    // Merged data is *still* invalid — that's a real bug, not a missing field.
    // Show it loudly in dev so it gets fixed; silently skip in prod.
    if (import.meta.env.DEV) {
      return (
        <div className="container-page py-8">
          <div className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-6 text-red-900">
            <p className="font-semibold">Invalid section data ({section.type})</p>
            <pre className="mt-2 overflow-auto text-xs">
              {JSON.stringify(result.error.errors, null, 2)}
            </pre>
          </div>
        </div>
      );
    }
    return null;
  }

  const wrapper = !section.visible
    ? 'opacity-50 pointer-events-none ring-2 ring-amber-300 ring-inset'
    : '';

  return (
    <div className={wrapper}>
      <Component data={result.data} />
    </div>
  );
}

/**
 * Render an entire page from CMS data. This is what every public page calls
 * after fetching its content via `cms.getPage(key)`.
 */
export function PageRenderer({ page, showHidden = false }: { page: Page; showHidden?: boolean }) {
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);
  return (
    <>
      {sortedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} showHidden={showHidden} />
      ))}
    </>
  );
}
