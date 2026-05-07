import type { SectionType } from './sections';

/**
 * SCHEMA MIGRATIONS
 * =================
 * When section schemas evolve, old saved data may use values that the current
 * schema no longer accepts (e.g. an enum option was renamed). This module
 * upgrades old data to the current shape *before* Zod validates it, so old
 * pages keep rendering without manual database migration.
 *
 * Migrations are pure, idempotent, and conservative: if the data is already
 * in the current shape, the migration is a no-op.
 *
 * Add a new entry here whenever you change a schema in a backward-incompatible
 * way. Common cases: enum value rename, field move, type change.
 */

export function migrateSectionData(type: SectionType, raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw;
  const data = { ...(raw as Record<string, unknown>) };

  switch (type) {
    case 'gallery':
      return migrateGallery(data);
    case 'cards':
      return migrateCards(data);
    default:
      return data;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery: layout enum was renamed in the v2 update
//   'grid-3' / 'grid-4' → 'standard-grid' (with `columns` field)
//   'masonry' → 'masonry' (unchanged)
//   'carousel' → 'carousel' (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function migrateGallery(data: Record<string, unknown>): Record<string, unknown> {
  const layout = data.layout;
  if (typeof layout !== 'string') return data;

  // Map legacy column-based layouts to the new standard-grid + columns shape
  if (layout === 'grid-2' || layout === 'grid-3' || layout === 'grid-4' || layout === 'grid-5') {
    const cols = layout.split('-')[1];
    return {
      ...data,
      layout: 'standard-grid',
      columns: data.columns ?? cols,
    };
  }

  // Already-current values pass through
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cards: card items gained `visual`, `textAlign`, `collapsibleDescription`
// in the v2 update. Old card items had `image`, `icon`, `href` only.
// ─────────────────────────────────────────────────────────────────────────────

function migrateCards(data: Record<string, unknown>): Record<string, unknown> {
  const cards = data.cards;
  if (!Array.isArray(cards)) return data;

  const migrated = cards.map((c) => {
    if (!c || typeof c !== 'object') return c;
    const card = c as Record<string, unknown>;

    // Already in the new shape — leave alone
    if (card.visual && typeof card.visual === 'object') return card;

    // Derive a `visual` from old top-level image/icon fields
    const oldImage = card.image as { url?: string; alt?: string } | undefined;
    const oldIcon = card.icon as string | undefined;

    let visual: Record<string, unknown> = {
      kind: 'none',
      iconName: '',
      shape: 'rounded',
      position: 'top',
    };
    if (oldImage && oldImage.url) {
      visual = {
        kind: 'image',
        image: { url: oldImage.url, alt: oldImage.alt ?? '' },
        shape: 'rounded',
        position: 'top',
        iconName: '',
      };
    } else if (oldIcon) {
      visual = {
        kind: 'icon',
        iconName: oldIcon,
        shape: 'rounded',
        position: 'top',
      };
    }

    return {
      id: card.id ?? crypto.randomUUID(),
      title: card.title ?? '',
      description: card.description ?? '',
      href: card.href ?? '',
      visual,
      textAlign: card.textAlign ?? 'left',
      collapsibleDescription: card.collapsibleDescription ?? false,
    };
  });

  return { ...data, cards: migrated };
}