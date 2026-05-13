import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import type {
  HeroSectionSchema,
  BannerSectionSchema,
  RichTextSectionSchema,
  ImageTextSectionSchema,
  StatsSectionSchema,
  CardsSectionSchema,
  GallerySectionSchema,
  PrincipalMessageSchema,
  CTASectionSchema,
  TestimonialsSchema,
  FAQSectionSchema,
  VideoSectionSchema,
  TimelineSectionSchema,
  EventsFeedSectionSchema,
  ContactInfoSectionSchema,
  ContactFormSectionSchema,
  MapSectionSchema,
  Background,
  CardItem,
} from '@/cms/schema/sections';
import { z } from 'zod';
import { cms } from '@/cms/api';
import type { EventPost } from '@/cms/api';

type Hero = z.infer<typeof HeroSectionSchema>;
type Banner = z.infer<typeof BannerSectionSchema>;
type RichText = z.infer<typeof RichTextSectionSchema>;
type ImageText = z.infer<typeof ImageTextSectionSchema>;
type Stats = z.infer<typeof StatsSectionSchema>;
type Cards = z.infer<typeof CardsSectionSchema>;
type Gallery = z.infer<typeof GallerySectionSchema>;
type PrincipalMessage = z.infer<typeof PrincipalMessageSchema>;
type CTA = z.infer<typeof CTASectionSchema>;
type Testimonials = z.infer<typeof TestimonialsSchema>;
type FAQ = z.infer<typeof FAQSectionSchema>;
type Video = z.infer<typeof VideoSectionSchema>;
type Timeline = z.infer<typeof TimelineSectionSchema>;
type EventsFeed = z.infer<typeof EventsFeedSectionSchema>;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const buttonClass = (variant: 'primary' | 'outline' | 'ghost' | undefined) => {
  switch (variant) {
    case 'outline':
      return 'btn-outline';
    case 'ghost':
      return 'btn-ghost';
    default:
      return 'btn-primary';
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Background wrapper (used by every renderer to apply admin-chosen bg)
// ─────────────────────────────────────────────────────────────────────────────

function bgClassesFor(bg: Background | undefined): {
  className: string;
  style?: React.CSSProperties;
  textInverse: boolean;
} {
  if (!bg || bg.type === 'none') return { className: '', textInverse: false };
  switch (bg.type) {
    case 'soft':
      return { className: 'bg-surface-soft', textInverse: false };
    case 'muted':
      return { className: 'bg-surface-muted', textInverse: false };
    case 'brand':
      return { className: 'bg-brand-700 text-white', textInverse: true };
    case 'dark':
      return { className: 'bg-ink-900 text-white', textInverse: true };
    case 'color':
      return {
        className: '',
        style: { backgroundColor: bg.color || 'transparent' },
        textInverse: false,
      };
  }
}

function SectionBg({
  background,
  children,
  className = '',
}: {
  background?: Background;
  children: React.ReactNode;
  className?: string;
}) {
  const { className: bgClass, style } = bgClassesFor(background);
  // If no background is set, render children directly without an extra wrapper
  // so the existing section spacing/dividers still work as before.
  if (!bgClass && !style) return <div className={className}>{children}</div>;
  return (
    <div className={`${bgClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────

export function HeroRenderer({ data }: { data: Hero }) {
  const sizeClasses = {
    compact: 'py-16 md:py-20',
    default: 'py-20 md:py-28',
    large: 'py-24 md:py-36',
  };
  const alignClass = data.align === 'center' ? 'text-center mx-auto' : '';
  const hasBgImage = Boolean(data.backgroundImage?.url);

  return (
    <SectionBg background={data.background}>
      <section
        className={`relative ${sizeClasses[data.size]} ${
          !hasBgImage && (!data.background || data.background.type === 'none')
            ? 'checker-bg'
            : ''
        }`}
      >
        {hasBgImage && (
          <>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${data.backgroundImage!.url})` }}
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/85 via-white/40 to-white/0" />
          </>
        )}
        <div className="container-page relative z-10">
          <motion.div {...fadeUp} className={`max-w-3xl ${alignClass}`}>
            {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
            <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 md:text-5xl lg:text-6xl">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="mt-5 text-lg text-ink-500 md:text-xl">{data.subtitle}</p>
            )}
            {data.description && (
              <p className="mt-3 text-ink-500">{data.description}</p>
            )}
            {(data.primaryButton || data.secondaryButton) && (
              <div
                className={`mt-8 flex flex-wrap gap-3 ${
                  data.align === 'center' ? 'justify-center' : ''
                }`}
              >
                {data.primaryButton && (
                  <Link
                    to={data.primaryButton.href || '#'}
                    className={buttonClass(data.primaryButton.variant)}
                  >
                    {data.primaryButton.label}
                  </Link>
                )}
                {data.secondaryButton && (
                  <Link
                    to={data.secondaryButton.href || '#'}
                    className={buttonClass(data.secondaryButton.variant)}
                  >
                    {data.secondaryButton.label}
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Banner
// ─────────────────────────────────────────────────────────────────────────────

export function BannerRenderer({ data }: { data: Banner }) {
  const themes = {
    brand: 'bg-brand-700 text-white',
    soft: 'bg-surface-soft text-ink-900',
    gold: 'bg-gold text-white',
  };
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12">
        <motion.div
          {...fadeUp}
          className={`flex flex-col items-center gap-6 rounded-3xl px-6 py-10 md:flex-row md:px-12 ${themes[data.theme]}`}
        >
          {data.image?.url && (
            <ImageSlot
              src={data.image.url}
              alt={data.image.alt}
              className="h-24 w-24 shrink-0 rounded-2xl object-cover"
            />
          )}
          <div className="flex-1 text-center md:text-left">
            {data.title && (
              <h2 className="font-display text-2xl font-bold md:text-3xl">{data.title}</h2>
            )}
            {data.description && <p className="mt-2 opacity-90">{data.description}</p>}
          </div>
          {data.button && data.button.label && (
            <Link
              to={data.button.href || '#'}
              className={`shrink-0 rounded-xl px-5 py-3 font-semibold ${
                data.theme === 'brand' || data.theme === 'gold'
                  ? 'bg-white text-ink-900'
                  : 'btn-primary'
              }`}
            >
              {data.button.label}
            </Link>
          )}
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich text
// ─────────────────────────────────────────────────────────────────────────────

export function RichTextRenderer({ data }: { data: RichText }) {
  const widthClass = {
    narrow: 'max-w-2xl',
    normal: 'max-w-3xl',
    wide: 'max-w-5xl',
  }[data.maxWidth];

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        <motion.div {...fadeUp} className={`mx-auto ${widthClass}`}>
          {data.title && <h2 className="section-title mb-6">{data.title}</h2>}
          <div
            className="prose prose-ink max-w-none prose-headings:font-display prose-a:text-brand-700"
            dangerouslySetInnerHTML={{ __html: data.body }}
          />
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image + Text (side-by-side, swappable)
// ─────────────────────────────────────────────────────────────────────────────

export function ImageTextRenderer({ data }: { data: ImageText }) {
  const shape = shapeClass(data.imageShape);
  const verticalClass =
    data.verticalAlign === 'top'
      ? 'items-start'
      : data.verticalAlign === 'bottom'
        ? 'items-end'
        : 'items-center';
  const flipped = data.imagePosition === 'right';

  const imageEl = (
    <div className="w-full">
      {data.image?.url ? (
        <img
          src={data.image.url}
          alt={data.image.alt}
          className={`aspect-[4/3] w-full object-cover ${shape}`}
        />
      ) : (
        <ImageSlot className={`aspect-[4/3] w-full ${shape}`} rounded="rounded-none" />
      )}
    </div>
  );

  const textEl = (
    <div className="flex flex-col">
      {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
      {data.title && (
        <h2 className="section-title mt-2">{data.title}</h2>
      )}
      {data.body && (
        <div
          className="prose prose-ink mt-4 max-w-none prose-headings:font-display prose-a:text-brand-700"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      )}
      {(data.primaryButton || data.secondaryButton) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {data.primaryButton && data.primaryButton.label && (
            <Link
              to={data.primaryButton.href || '#'}
              className={buttonClass(data.primaryButton.variant)}
            >
              {data.primaryButton.label}
            </Link>
          )}
          {data.secondaryButton && data.secondaryButton.label && (
            <Link
              to={data.secondaryButton.href || '#'}
              className={buttonClass(data.secondaryButton.variant)}
            >
              {data.secondaryButton.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-20">
        <motion.div
          {...fadeUp}
          className={`grid gap-8 md:gap-12 md:grid-cols-2 ${verticalClass}`}
        >
          {flipped ? (
            <>
              {textEl}
              {imageEl}
            </>
          ) : (
            <>
              {imageEl}
              {textEl}
            </>
          )}
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────────────────────

export function StatsRenderer({ data }: { data: Stats }) {
  if (data.stats.length === 0) return null;
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        <motion.div {...fadeUp}>
          {data.title && <h2 className="section-title mb-8 text-center">{data.title}</h2>}
          <div
            className={`grid gap-6 ${
              data.stats.length >= 4
                ? 'grid-cols-2 md:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {data.stats.map((stat) => (
              <div key={stat.id} className="card p-8 text-center">
                <p className="font-display text-4xl font-bold text-brand-700 md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cards (rich version)
// ─────────────────────────────────────────────────────────────────────────────

const cardLayoutClass = (layout: Cards['layout']) => {
  switch (layout) {
    case 'grid-1':
      return 'grid-cols-1 mx-auto max-w-2xl';
    case 'grid-2':
      return 'grid-cols-1 md:grid-cols-2';
    case 'grid-3':
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 'grid-4':
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    case 'list':
      return 'grid-cols-1';
  }
};

const shapeClass = (shape: 'square' | 'rounded' | 'circle') =>
  shape === 'square' ? 'rounded-none' : shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

const textAlignClass = (a: 'left' | 'center' | 'right') =>
  a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left';

function CardVisual({ visual }: { visual: CardItem['visual'] }) {
  if (!visual || visual.kind === 'none') return null;

  const shape = shapeClass(visual.shape);
  const size = visual.size ?? 56;
  const inlineSize = { width: `${size}px`, height: `${size}px` };

  if (visual.kind === 'image') {
    if (!visual.image?.url) return null;
    return (
      <img
        src={visual.image.url}
        alt={visual.image.alt}
        className={`shrink-0 object-cover ${shape}`}
        style={inlineSize}
      />
    );
  }

  if (visual.kind === 'icon') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (Icons as any)[visual.iconName] ?? Icons.Square;
    // Icon glyph scales relative to badge size (~50%), capped for legibility
    const glyph = Math.max(16, Math.min(64, Math.round(size * 0.5)));
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-brand-100 text-brand-700 ${shape}`}
        style={inlineSize}
      >
        <Icon style={{ width: `${glyph}px`, height: `${glyph}px` }} />
      </div>
    );
  }

  return null;
}

/**
 * Resolve a card's effective alignment.
 * The card stores 'inherit' to mean "use the section's defaultTextAlign";
 * any explicit value overrides.
 */
function resolveAlign(
  cardAlign: CardItem['textAlign'],
  sectionDefault: 'left' | 'center' | 'right',
): 'left' | 'center' | 'right' {
  if (!cardAlign || cardAlign === 'inherit') return sectionDefault;
  return cardAlign;
}

function CardListItems({
  items,
  align,
}: {
  items: string[];
  align: 'left' | 'center' | 'right';
}) {
  const listAlign =
    align === 'center'
      ? 'mx-auto inline-block text-left'
      : align === 'right'
        ? 'ml-auto inline-block text-left'
        : '';
  return (
    <ul className={`mt-3 space-y-1.5 text-ink-500 ${listAlign}`}>
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2">
          <span
            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700"
            aria-hidden
          />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function CardDescription({
  card,
  align,
}: {
  card: CardItem;
  align: 'left' | 'center' | 'right';
}) {
  const [open, setOpen] = useState(!card.collapsibleDescription);
  const listItems = (card.descriptionList ?? []).filter((s) => s.trim().length > 0);
  const hasParagraph = Boolean(card.description);
  const hasList = listItems.length > 0;

  // List-only mode
  if (card.descriptionMode === 'list') {
    if (!hasList) return null;
    return <CardListItems items={listItems} align={align} />;
  }

  // Both modes — paragraph + list, stacked
  if (card.descriptionMode === 'both') {
    return (
      <>
        {hasParagraph && <p className="mt-3 text-ink-500">{card.description}</p>}
        {hasList && <CardListItems items={listItems} align={align} />}
      </>
    );
  }

  // Paragraph mode
  if (!hasParagraph) return null;

  if (card.collapsibleDescription) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 ${
            align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
          }`}
        >
          {open ? 'Show less' : 'Read more'}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && <p className="mt-2 text-ink-500">{card.description}</p>}
      </>
    );
  }

  return <p className="mt-3 text-ink-500">{card.description}</p>;
}

/**
 * Compute the inline style + class for a card's background.
 * Returns whether text should flip to white (for dark/brand backgrounds).
 */
function cardBgFor(bg: CardItem['cardBackground']): {
  className: string;
  style?: React.CSSProperties;
} {
  if (!bg || bg.type === 'inherit') return { className: 'card' };
  switch (bg.type) {
    case 'none':
      return { className: 'rounded-2xl' };
    case 'white':
      return { className: 'rounded-2xl bg-white shadow-soft' };
    case 'soft':
      return { className: 'rounded-2xl bg-surface-soft' };
    case 'muted':
      return { className: 'rounded-2xl bg-surface-muted' };
    case 'brand':
      return { className: 'rounded-2xl bg-brand-700 text-white' };
    case 'dark':
      return { className: 'rounded-2xl bg-ink-900 text-white' };
    case 'color':
      return {
        className: 'rounded-2xl',
        style: { backgroundColor: bg.color || 'transparent' },
      };
  }
}

function CardButton({
  button,
  align,
}: {
  button: CardItem['button'];
  align: CardItem['buttonAlign'];
}) {
  if (!button || !button.label) return null;
  const justify =
    align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';
  return (
    <div className={`mt-4 flex ${justify}`}>
      <Link to={button.href || '#'} className={buttonClass(button.variant)}>
        {button.label}
      </Link>
    </div>
  );
}

function CardItemRenderer({
  card,
  defaultAlign,
}: {
  card: CardItem;
  defaultAlign: 'left' | 'center' | 'right';
}) {
  const align = resolveAlign(card.textAlign, defaultAlign);
  const visual = card.visual;
  const position = visual?.position ?? 'top';
  const isHorizontal = position === 'left' || position === 'right';
  const hasVisual = visual && visual.kind !== 'none';
  const bg = cardBgFor(card.cardBackground);

  // Vertical (icon-on-top) layout
  if (!isHorizontal) {
    return (
      <div
        className={`flex h-full flex-col p-6 ${bg.className}`}
        style={bg.style}
      >
        {hasVisual && (
          <div
            className={`mb-5 flex ${
              align === 'center'
                ? 'justify-center'
                : align === 'right'
                  ? 'justify-end'
                  : 'justify-start'
            }`}
          >
            <CardVisual visual={visual} />
          </div>
        )}
        <div className={`flex-1 ${textAlignClass(align)}`}>
          {card.title && (
            <h3 className="font-display text-lg font-bold">{card.title}</h3>
          )}
          <CardDescription card={card} align={align} />
          {card.href && (
            <Link
              to={card.href}
              className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all hover:gap-2 ${
                align === 'center'
                  ? 'justify-center'
                  : align === 'right'
                    ? 'justify-end'
                    : ''
              }`}
            >
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          <CardButton button={card.button} align={card.buttonAlign ?? 'left'} />
        </div>
      </div>
    );
  }

  // Horizontal (icon-beside-text) layout
  return (
    <div className={`p-6 ${bg.className}`} style={bg.style}>
      <div
        className={`flex items-start gap-4 ${
          position === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        {hasVisual && <CardVisual visual={visual} />}
        <div className={`flex-1 ${textAlignClass(align)}`}>
          {card.title && (
            <h3 className="font-display text-lg font-bold">{card.title}</h3>
          )}
          <CardDescription card={card} align={align} />
          {card.href && (
            <Link
              to={card.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2 transition-all"
            >
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          <CardButton button={card.button} align={card.buttonAlign ?? 'left'} />
        </div>
      </div>
    </div>
  );
}

export function CardsRenderer({ data }: { data: Cards }) {
  if (data.cards.length === 0) {
    return (
      <SectionBg background={data.background}>
        <section className="container-page py-12 md:py-16 text-center text-ink-500">
          {data.title && <h2 className="section-title mb-4">{data.title}</h2>}
          <p className="text-sm">No cards to display yet. Add cards in the editor.</p>
        </section>
      </SectionBg>
    );
  }

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        {(data.eyebrow || data.title || data.description) && (
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
            {data.title && (
              <h2 className={`section-title mt-2 ${textAlignClass(data.titleAlign ?? 'left')}`}>
                {data.title}
              </h2>
            )}
            {data.description && <p className="mt-3 text-ink-500">{data.description}</p>}
          </motion.div>
        )}
        <div className={`grid gap-6 ${cardLayoutClass(data.layout)}`}>
          {data.cards.map((card, i) => {
            // Handle lastCardPosition for 2-column layouts with odd count
            const isLastOdd =
              data.layout === 'grid-2' &&
              i === data.cards.length - 1 &&
              data.cards.length % 2 === 1;
            const lastClass = isLastOdd
              ? data.lastCardPosition === 'center'
                ? 'md:col-span-2 md:max-w-md md:mx-auto'
                : data.lastCardPosition === 'right'
                  ? 'md:col-start-2'
                  : '' // 'left' is the default position
              : '';
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={lastClass}
              >
                <CardItemRenderer card={card} defaultAlign={data.defaultTextAlign} />
              </motion.div>
            );
          })}
        </div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery (5 layouts)
// ─────────────────────────────────────────────────────────────────────────────

const gapClass = (g: Gallery['gap']) =>
  g === 'none' ? 'gap-0' : g === 'sm' ? 'gap-1.5' : g === 'lg' ? 'gap-5' : 'gap-3';

const colCount = (c: Gallery['columns']) => parseInt(c, 10);

export function GalleryRenderer({ data }: { data: Gallery }) {
  if (data.images.length === 0) {
    return (
      <SectionBg background={data.background}>
        <section className="container-page py-12 md:py-16 text-center text-ink-500">
          {data.title && <h2 className="section-title mb-4">{data.title}</h2>}
          <p className="text-sm">No images yet. Upload some in the editor.</p>
        </section>
      </SectionBg>
    );
  }

  const images = data.images.filter((i) => i.url);
  const cols = colCount(data.columns);
  const gap = gapClass(data.gap);

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        {(data.title || data.description) && (
          <motion.div {...fadeUp} className="mb-8">
            {data.title && <h2 className="section-title">{data.title}</h2>}
            {data.description && (
              <p className="mt-3 max-w-2xl text-ink-500">{data.description}</p>
            )}
          </motion.div>
        )}

        {data.layout === 'standard-grid' && (
          <div
            className={`grid ${gap}`}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {images.map((img, i) => (
              <ImageSlot
                key={i}
                src={img.url}
                alt={img.alt}
                className="aspect-square w-full object-cover"
                rounded="rounded-2xl"
              />
            ))}
          </div>
        )}

        {data.layout === 'masonry' && (
          <div
            className={gap}
            style={{ columnCount: cols, columnGap: '0.75rem' }}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt}
                className="mb-3 w-full break-inside-avoid rounded-2xl"
                style={{ display: 'block' }}
              />
            ))}
          </div>
        )}

        {data.layout === 'justified' && (
          <div className={`flex flex-wrap ${gap}`}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt}
                className="h-48 flex-grow rounded-2xl object-cover"
                style={{ minWidth: '200px' }}
              />
            ))}
          </div>
        )}

        {data.layout === 'metro' && <MetroGallery images={images} gap={gap} cols={cols} />}

        {data.layout === 'carousel' && (
          <div className={`flex ${gap} overflow-x-auto snap-x snap-mandatory pb-4`}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt}
                className="aspect-[4/3] flex-shrink-0 snap-center rounded-2xl object-cover"
                style={{ width: `${100 / Math.min(cols, 3)}%`, minWidth: '280px' }}
              />
            ))}
          </div>
        )}
      </section>
    </SectionBg>
  );
}

function MetroGallery({
  images,
  gap,
  cols,
}: {
  images: Gallery['images'];
  gap: string;
  cols: number;
}) {
  // "Metro" layout: each image gets a different (deterministic) span.
  // Pattern repeats every 7 images — visually irregular, mathematically stable.
  const SPANS: Array<{ col: number; row: number }> = [
    { col: 2, row: 2 },
    { col: 1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 2 },
    { col: 2, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 1 },
  ];
  return (
    <div
      className={`grid ${gap}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: '120px',
      }}
    >
      {images.map((img, i) => {
        const span = SPANS[i % SPANS.length];
        return (
          <img
            key={i}
            src={img.url}
            alt={img.alt}
            className="h-full w-full rounded-2xl object-cover"
            style={{
              gridColumn: `span ${Math.min(span.col, cols)} / span ${Math.min(span.col, cols)}`,
              gridRow: `span ${span.row} / span ${span.row}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Principal message
// ─────────────────────────────────────────────────────────────────────────────

export function PrincipalMessageRenderer({ data }: { data: PrincipalMessage }) {
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-20">
        <motion.div {...fadeUp} className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
          <div className="text-center md:text-left">
            <ImageSlot
              src={data.portrait?.url}
              alt={data.portrait?.alt ?? data.name}
              className="mx-auto aspect-square w-48 rounded-3xl object-cover md:mx-0 md:w-full md:max-w-xs"
            />
            {data.name && (
              <p className="mt-4 font-display text-xl font-bold text-ink-900">{data.name}</p>
            )}
            {data.role && <p className="text-sm text-ink-500">{data.role}</p>}
          </div>
          <div>
            {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
            <div
              className="prose prose-ink mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: data.message }}
            />
            {data.signature && (
              <p className="mt-6 font-display text-lg italic text-ink-700">— {data.signature}</p>
            )}
          </div>
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────────────────────

export function CTARenderer({ data }: { data: CTA }) {
  const themes = {
    brand: 'bg-brand-700 text-white',
    soft: 'bg-surface-soft text-ink-900',
    dark: 'bg-ink-900 text-white',
  };
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        <motion.div
          {...fadeUp}
          className={`relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16 md:py-20 ${themes[data.theme]}`}
          style={
            data.backgroundImage?.url
              ? { backgroundImage: `url(${data.backgroundImage.url})`, backgroundSize: 'cover' }
              : undefined
          }
        >
          <div className="relative z-10 mx-auto max-w-3xl">
            {data.title && (
              <h2 className="font-display text-3xl font-bold md:text-4xl">{data.title}</h2>
            )}
            {data.description && <p className="mt-4 opacity-90">{data.description}</p>}
            {(data.primaryButton || data.secondaryButton) && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {data.primaryButton && data.primaryButton.label && (
                  <Link
                    to={data.primaryButton.href || '#'}
                    className="rounded-xl bg-white px-6 py-3 font-semibold text-ink-900 hover:opacity-90"
                  >
                    {data.primaryButton.label}
                  </Link>
                )}
                {data.secondaryButton && data.secondaryButton.label && (
                  <Link
                    to={data.secondaryButton.href || '#'}
                    className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
                  >
                    {data.secondaryButton.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────

export function TestimonialsRenderer({ data }: { data: Testimonials }) {
  if (data.testimonials.length === 0) return null;
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        {data.title && <h2 className="section-title mb-10 text-center">{data.title}</h2>}
        <div className="grid gap-6 md:grid-cols-3">
          {data.testimonials.map((t) => (
            <motion.div key={t.id} {...fadeUp} className="card p-8">
              {t.quote && <p className="text-ink-700">"{t.quote}"</p>}
              <div className="mt-6 flex items-center gap-3">
                {t.avatar?.url && (
                  <ImageSlot
                    src={t.avatar.url}
                    alt={t.avatar.alt}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  {t.author && <p className="font-semibold text-ink-900">{t.author}</p>}
                  {t.role && <p className="text-xs text-ink-500">{t.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

export function FAQRenderer({ data }: { data: FAQ }) {
  const [openId, setOpenId] = useState<string | null>(data.items[0]?.id ?? null);
  if (data.items.length === 0) return null;
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          {data.title && <h2 className="section-title mb-8 text-center">{data.title}</h2>}
          <div className="space-y-3">
            {data.items.map((item) => {
              const open = openId === item.id;
              return (
                <div key={item.id} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-ink-900">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-ink-500 transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-ink-300/10 px-6 py-5 text-ink-500">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video
// ─────────────────────────────────────────────────────────────────────────────

export function VideoRenderer({ data }: { data: Video }) {
  const embedUrl = toEmbedUrl(data.videoUrl);
  if (!data.videoUrl) {
    return (
      <SectionBg background={data.background}>
        <section className="container-page py-12 md:py-16 text-center text-ink-500">
          <p className="text-sm">Add a video URL in the editor.</p>
        </section>
      </SectionBg>
    );
  }
  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl">
          {data.title && <h2 className="section-title mb-4 text-center">{data.title}</h2>}
          {data.description && (
            <p className="mb-8 text-center text-ink-500">{data.description}</p>
          )}
          <div className="aspect-video overflow-hidden rounded-2xl shadow-soft">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={data.title || 'Video'}
              />
            ) : (
              <video
                src={data.videoUrl}
                poster={data.poster?.url}
                controls
                className="h-full w-full"
              />
            )}
          </div>
        </motion.div>
      </section>
    </SectionBg>
  );
}

function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline (with the blue connector line!)
// ─────────────────────────────────────────────────────────────────────────────

export function TimelineRenderer({ data }: { data: Timeline }) {
  if (data.steps.length === 0) {
    return (
      <SectionBg background={data.background}>
        <section className="container-page py-12 md:py-16 text-center text-ink-500">
          {data.title && <h2 className="section-title mb-4">{data.title}</h2>}
          <p className="text-sm">No steps yet. Add steps in the editor.</p>
        </section>
      </SectionBg>
    );
  }

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        <motion.div {...fadeUp} className="mx-auto max-w-5xl">
          {data.title && <h2 className="section-title mb-3 text-center">{data.title}</h2>}
          {data.description && (
            <p className="mb-10 text-center text-ink-500">{data.description}</p>
          )}

          {data.layout === 'zigzag' && <TimelineZigzag steps={data.steps} />}
          {data.layout === 'vertical' && <TimelineVertical steps={data.steps} />}
          {data.layout === 'horizontal' && <TimelineHorizontal steps={data.steps} />}
        </motion.div>
      </section>
    </SectionBg>
  );
}

function TimelineZigzag({ steps }: { steps: Timeline['steps'] }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* The blue vertical connector line */}
      <div
        className="absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-brand-700/40"
        aria-hidden
      />
      <ol className="relative space-y-12">
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <li
              key={step.id}
              className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4`}
            >
              <div className={isLeft ? 'text-right' : ''}>
                {isLeft && <StepCard step={step} index={i} align="right" />}
              </div>
              {/* Dot on the line */}
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-bold text-white shadow-glow">
                {i + 1}
              </div>
              <div className={!isLeft ? 'text-left' : ''}>
                {!isLeft && <StepCard step={step} index={i} align="left" />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TimelineVertical({ steps }: { steps: Timeline['steps'] }) {
  return (
    <div className="relative mx-auto max-w-2xl pl-12">
      {/* Blue line on the left */}
      <div
        className="absolute left-5 top-0 h-full w-0.5 bg-brand-700/40"
        aria-hidden
      />
      <ol className="space-y-8">
        {steps.map((step, i) => (
          <li key={step.id} className="relative">
            <div className="absolute -left-12 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-bold text-white shadow-glow">
              {i + 1}
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900">
              {step.title || `Step ${i + 1}`}
            </h3>
            {step.description && (
              <p className="mt-1 text-ink-500">{step.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function TimelineHorizontal({ steps }: { steps: Timeline['steps'] }) {
  return (
    <div className="relative">
      {/* Horizontal blue line behind the dots */}
      <div
        className="absolute left-0 right-0 top-5 h-0.5 bg-brand-700/40"
        aria-hidden
      />
      <ol
        className="relative grid gap-6"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => (
          <li key={step.id} className="text-center">
            <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-bold text-white shadow-glow">
              {i + 1}
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-ink-900">
              {step.title || `Step ${i + 1}`}
            </h3>
            {step.description && (
              <p className="mt-1 text-sm text-ink-500">{step.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepCard({
  step,
  index,
  align,
}: {
  step: Timeline['steps'][number];
  index: number;
  align: 'left' | 'right';
}) {
  return (
    <div className={`card p-5 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <h3 className="font-display text-lg font-bold text-ink-900">
        {step.title || `Step ${index + 1}`}
      </h3>
      {step.description && <p className="mt-1 text-ink-500">{step.description}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Events feed (NEW — for displaying events on home page)
// ─────────────────────────────────────────────────────────────────────────────

export function EventsFeedRenderer({ data }: { data: EventsFeed }) {
  const [events, setEvents] = useState<EventPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await cms.listEvents({
          status: 'published',
          category: data.category === 'All' ? undefined : data.category,
        });
        if (!cancelled) setEvents(list.slice(0, data.limit));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data.category, data.limit]);

  const layoutClass = data.layout === 'grid-2' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        {(data.eyebrow || data.title || data.description) && (
          <motion.div {...fadeUp} className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
              {data.title && <h2 className="section-title mt-2">{data.title}</h2>}
              {data.description && <p className="mt-3 max-w-2xl text-ink-500">{data.description}</p>}
            </div>
            {data.showViewAll && (
              <Link
                to="/events"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:gap-2 transition-all"
              >
                {data.viewAllLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className={`grid gap-6 grid-cols-1 ${layoutClass}`}>
            {Array.from({ length: data.limit }).map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-surface-soft" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-ink-500 text-sm py-12">
            No published events yet. Create one in News & Events.
          </p>
        ) : (
          <div className={`grid gap-6 grid-cols-1 ${layoutClass}`}>
            {events.map((evt, i) => (
              <motion.article
                key={evt.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card overflow-hidden flex flex-col"
              >
                {evt.coverImage?.url ? (
                  <img
                    src={evt.coverImage.url}
                    alt={evt.coverImage.alt}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <ImageSlot className="aspect-[16/10] w-full" rounded="rounded-none" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-ink-500">
                    {evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : ''} · {evt.category}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink-900 line-clamp-2">
                    {evt.title}
                  </h3>
                  {evt.excerpt && (
                    <p className="mt-2 text-sm text-ink-500 line-clamp-2">{evt.excerpt}</p>
                  )}
                  <Link
                    to={`/events/${evt.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-700 hover:gap-2 transition-all"
                  >
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Info — labeled cards with icons (address / phone / email / etc.)
// ─────────────────────────────────────────────────────────────────────────────

type ContactInfo = z.infer<typeof ContactInfoSectionSchema>;

export function ContactInfoRenderer({ data }: { data: ContactInfo }) {
  if (data.items.length === 0) return null;

  const layoutClass =
    data.layout === 'list'
      ? 'grid-cols-1 max-w-3xl mx-auto'
      : data.layout === 'grid-2'
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-3';

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        {(data.eyebrow || data.title || data.description) && (
          <motion.div {...fadeUp} className="mb-10 max-w-2xl mx-auto text-center">
            {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
            {data.title && (
              <h2 className={`section-title mt-2 ${textAlignClass(data.titleAlign ?? 'center')}`}>
                {data.title}
              </h2>
            )}
            {data.description && <p className="mt-3 text-ink-500">{data.description}</p>}
          </motion.div>
        )}
        <div className={`grid gap-6 ${layoutClass}`}>
          {data.items.map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (Icons as any)[item.icon] ?? Icons.MapPin;
            const inner = (
              <div className="card flex items-start gap-4 p-6 h-full">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  {item.label && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      {item.label}
                    </p>
                  )}
                  {item.value && (
                    <p className="mt-1 font-display font-bold text-ink-900 break-words">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            );
            return item.href ? (
              <a
                key={item.id}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="block transition-transform hover:-translate-y-0.5"
              >
                {inner}
              </a>
            ) : (
              <div key={item.id}>{inner}</div>
            );
          })}
        </div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Form — admin-managed form (labels editable, optional submit URL)
// ─────────────────────────────────────────────────────────────────────────────

type ContactForm = z.infer<typeof ContactFormSectionSchema>;

export function ContactFormRenderer({ data }: { data: ContactForm }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.submitUrl) {
      // No backend configured — pretend success so admins can preview the flow
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch(data.submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div {...fadeUp}>
            {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
            {data.title && (
              <h2 className={`font-display text-2xl sm:text-3xl font-bold text-brand-700 mt-2 ${textAlignClass(data.titleAlign ?? 'left')}`}>
                {data.title}
              </h2>
            )}
            {data.description && (
              <p className="text-sm text-ink-500 leading-relaxed mt-2 max-w-md">
                {data.description}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  {data.nameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  {data.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  {data.messageLabel}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="input-field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : data.submitLabel}
              </button>
              {status === 'sent' && (
                <p className="text-sm text-green-700">{data.successMessage}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600">
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}
            </form>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="hidden lg:flex items-center justify-center"
          >
            {data.sideImage?.url ? (
              <img
                src={data.sideImage.url}
                alt={data.sideImage.alt}
                className="rounded-3xl object-cover w-full max-h-[500px]"
              />
            ) : (
              <ImageSlot className="rounded-3xl w-full aspect-[4/5]" />
            )}
          </motion.div>
        </div>
      </section>
    </SectionBg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Map — embedded iframe (Google Maps, etc.)
// ─────────────────────────────────────────────────────────────────────────────

type MapSection = z.infer<typeof MapSectionSchema>;

export function MapRenderer({ data }: { data: MapSection }) {
  const heightPx =
    data.height === 'small' ? '300px' : data.height === 'large' ? '700px' : '500px';

  return (
    <SectionBg background={data.background}>
      <section className="container-page py-12 md:py-16">
        {(data.title || data.description) && (
          <motion.div {...fadeUp} className="mb-8 max-w-2xl mx-auto text-center">
            {data.title && (
              <h2 className={`section-title ${textAlignClass(data.titleAlign ?? 'center')}`}>
                {data.title}
              </h2>
            )}
            {data.description && (
              <p className="mt-3 text-ink-500">{data.description}</p>
            )}
          </motion.div>
        )}
        <div
          className="rounded-2xl overflow-hidden border border-ink-300/10"
          style={{ height: heightPx }}
        >
          {data.embedUrl ? (
            <iframe
              title={data.title || 'Map'}
              src={data.embedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          ) : (
            <div className="h-full w-full bg-surface-soft flex items-center justify-center text-ink-500 text-sm">
              Add a map embed URL in the editor
            </div>
          )}
        </div>
      </section>
    </SectionBg>
  );
}
