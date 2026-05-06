import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import type {
  HeroSectionSchema,
  BannerSectionSchema,
  RichTextSectionSchema,
  StatsSectionSchema,
  CardsSectionSchema,
  GallerySectionSchema,
  PrincipalMessageSchema,
  CTASectionSchema,
  TestimonialsSchema,
  FAQSectionSchema,
  VideoSectionSchema,
  TimelineSectionSchema,
} from '@/cms/schema/sections';
import { z } from 'zod';

/**
 * Section renderers — one component per section `type`.
 *
 * These read from typed `data` and render the appropriate UI. They reuse
 * existing public-site styles (btn-primary, card, container-page, etc.)
 * so the public website stays visually identical.
 */

type Hero = z.infer<typeof HeroSectionSchema>;
type Banner = z.infer<typeof BannerSectionSchema>;
type RichText = z.infer<typeof RichTextSectionSchema>;
type Stats = z.infer<typeof StatsSectionSchema>;
type Cards = z.infer<typeof CardsSectionSchema>;
type Gallery = z.infer<typeof GallerySectionSchema>;
type PrincipalMessage = z.infer<typeof PrincipalMessageSchema>;
type CTA = z.infer<typeof CTASectionSchema>;
type Testimonials = z.infer<typeof TestimonialsSchema>;
type FAQ = z.infer<typeof FAQSectionSchema>;
type Video = z.infer<typeof VideoSectionSchema>;
type Timeline = z.infer<typeof TimelineSectionSchema>;

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
// Hero
// ─────────────────────────────────────────────────────────────────────────────

export function HeroRenderer({ data }: { data: Hero }) {
  const sizeClasses = {
    compact: 'py-16 md:py-20',
    default: 'py-20 md:py-28',
    large: 'py-24 md:py-36',
  };
  const alignClass = data.align === 'center' ? 'text-center mx-auto' : '';

  return (
    <section className={`relative ${data.backgroundImage?.url ? 'bg-ink-100' : 'checker-bg'} ${sizeClasses[data.size]}`}>
      {data.backgroundImage?.url && (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.backgroundImage.url})` }}
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/80 to-white/20" />
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
            <div className={`mt-8 flex flex-wrap gap-3 ${data.align === 'center' ? 'justify-center' : ''}`}>
              {data.primaryButton && (
                <Link to={data.primaryButton.href} className={buttonClass(data.primaryButton.variant)}>
                  {data.primaryButton.label}
                </Link>
              )}
              {data.secondaryButton && (
                <Link to={data.secondaryButton.href} className={buttonClass(data.secondaryButton.variant)}>
                  {data.secondaryButton.label}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
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
    <section className="container-page py-12">
      <motion.div
        {...fadeUp}
        className={`flex flex-col items-center gap-6 rounded-3xl px-6 py-10 md:flex-row md:px-12 ${themes[data.theme]}`}
      >
        {data.image?.url && (
          <ImageSlot src={data.image.url} alt={data.image.alt} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
        )}
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display text-2xl font-bold md:text-3xl">{data.title}</h2>
          {data.description && <p className="mt-2 opacity-90">{data.description}</p>}
        </div>
        {data.button && (
          <Link
            to={data.button.href}
            className={`shrink-0 rounded-xl px-5 py-3 font-semibold ${data.theme === 'brand' || data.theme === 'gold' ? 'bg-white text-ink-900' : 'btn-primary'}`}
          >
            {data.button.label}
          </Link>
        )}
      </motion.div>
    </section>
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
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp} className={`mx-auto ${widthClass}`}>
        {data.title && <h2 className="section-title mb-6">{data.title}</h2>}
        <div
          className="prose prose-ink max-w-none prose-headings:font-display prose-a:text-brand-700"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────────────────────

export function StatsRenderer({ data }: { data: Stats }) {
  return (
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp}>
        {data.title && <h2 className="section-title mb-8 text-center">{data.title}</h2>}
        <div className={`grid gap-6 ${data.stats.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          {data.stats.map((stat) => (
            <div key={stat.id} className="card p-8 text-center">
              <p className="font-display text-4xl font-bold text-brand-700 md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-ink-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cards
// ─────────────────────────────────────────────────────────────────────────────

export function CardsRenderer({ data }: { data: Cards }) {
  const layoutClass = {
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    list: 'grid-cols-1',
  }[data.layout];

  return (
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp} className="mb-10 max-w-2xl">
        {data.eyebrow && <p className="eyebrow text-brand-700">{data.eyebrow}</p>}
        <h2 className="section-title mt-2">{data.title}</h2>
        {data.description && <p className="mt-3 text-ink-500">{data.description}</p>}
      </motion.div>
      <div className={`grid gap-6 ${layoutClass}`}>
        {data.cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="card group overflow-hidden"
          >
            {card.image?.url && (
              <ImageSlot src={card.image.url} alt={card.image.alt} className="aspect-[4/3] w-full object-cover" />
            )}
            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-ink-900">{card.title}</h3>
              {card.description && <p className="mt-2 text-ink-500">{card.description}</p>}
              {card.href && (
                <Link
                  to={card.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all"
                >
                  Learn more <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery
// ─────────────────────────────────────────────────────────────────────────────

export function GalleryRenderer({ data }: { data: Gallery }) {
  const layoutClass = {
    'grid-3': 'grid-cols-2 md:grid-cols-3',
    'grid-4': 'grid-cols-2 md:grid-cols-4',
    masonry: 'grid-cols-2 md:grid-cols-3 [&>*:nth-child(3n+1)]:row-span-2',
    carousel: 'grid-flow-col auto-cols-[80%] md:auto-cols-[40%] overflow-x-auto snap-x snap-mandatory',
  }[data.layout];

  return (
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp} className="mb-8">
        {data.title && <h2 className="section-title">{data.title}</h2>}
        {data.description && <p className="mt-3 max-w-2xl text-ink-500">{data.description}</p>}
      </motion.div>
      <div className={`grid gap-3 ${layoutClass}`}>
        {data.images.map((img, i) => (
          <ImageSlot
            key={i}
            src={img.url}
            alt={img.alt}
            className="aspect-square w-full rounded-2xl object-cover snap-center"
          />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Principal message
// ─────────────────────────────────────────────────────────────────────────────

export function PrincipalMessageRenderer({ data }: { data: PrincipalMessage }) {
  return (
    <section className="container-page py-12 md:py-20">
      <motion.div {...fadeUp} className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
        <div className="text-center md:text-left">
          <ImageSlot
            src={data.portrait?.url}
            alt={data.portrait?.alt ?? data.name}
            className="mx-auto aspect-square w-48 rounded-3xl object-cover md:mx-0 md:w-full md:max-w-xs"
          />
          <p className="mt-4 font-display text-xl font-bold text-ink-900">{data.name}</p>
          <p className="text-sm text-ink-500">{data.role}</p>
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
          <h2 className="font-display text-3xl font-bold md:text-4xl">{data.title}</h2>
          {data.description && <p className="mt-4 opacity-90">{data.description}</p>}
          {(data.primaryButton || data.secondaryButton) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {data.primaryButton && (
                <Link
                  to={data.primaryButton.href}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-ink-900 hover:opacity-90"
                >
                  {data.primaryButton.label}
                </Link>
              )}
              {data.secondaryButton && (
                <Link
                  to={data.secondaryButton.href}
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────

export function TestimonialsRenderer({ data }: { data: Testimonials }) {
  return (
    <section className="container-page py-12 md:py-16">
      {data.title && <h2 className="section-title mb-10 text-center">{data.title}</h2>}
      <div className="grid gap-6 md:grid-cols-3">
        {data.testimonials.map((t) => (
          <motion.div
            key={t.id}
            {...fadeUp}
            className="card p-8"
          >
            <p className="text-ink-700">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              {t.avatar?.url && (
                <ImageSlot src={t.avatar.url} alt={t.avatar.alt} className="h-12 w-12 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold text-ink-900">{t.author}</p>
                {t.role && <p className="text-xs text-ink-500">{t.role}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

export function FAQRenderer({ data }: { data: FAQ }) {
  const [openId, setOpenId] = useState<string | null>(data.items[0]?.id ?? null);
  return (
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp} className="mx-auto max-w-3xl">
        <h2 className="section-title mb-8 text-center">{data.title}</h2>
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
                  <ChevronDown className={`h-5 w-5 shrink-0 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`} />
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video
// ─────────────────────────────────────────────────────────────────────────────

export function VideoRenderer({ data }: { data: Video }) {
  // Convert YouTube/Vimeo URLs to embed format
  const embedUrl = toEmbedUrl(data.videoUrl);
  return (
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp} className="mx-auto max-w-4xl">
        {data.title && <h2 className="section-title mb-4 text-center">{data.title}</h2>}
        {data.description && <p className="mb-8 text-center text-ink-500">{data.description}</p>}
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
            <video src={data.videoUrl} poster={data.poster?.url} controls className="h-full w-full" />
          )}
        </div>
      </motion.div>
    </section>
  );
}

function toEmbedUrl(url: string): string | null {
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
// Timeline
// ─────────────────────────────────────────────────────────────────────────────

export function TimelineRenderer({ data }: { data: Timeline }) {
  return (
    <section className="container-page py-12 md:py-16">
      <motion.div {...fadeUp} className="mx-auto max-w-3xl">
        <h2 className="section-title mb-3 text-center">{data.title}</h2>
        {data.description && <p className="mb-10 text-center text-ink-500">{data.description}</p>}
        <ol className="space-y-6">
          {data.steps.map((step, i) => (
            <li key={step.id} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 font-display text-lg font-bold text-white">
                {i + 1}
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-lg font-bold text-ink-900">{step.title}</h3>
                {step.description && <p className="mt-1 text-ink-500">{step.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
