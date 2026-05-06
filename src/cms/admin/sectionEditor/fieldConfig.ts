import type { SectionType } from '@/cms/schema/sections';

/**
 * Field configuration drives the section editor's form UI. Each entry tells
 * the editor what input control to render for which data path.
 *
 * Supported field types:
 *   text         — single line input
 *   textarea     — multi-line input
 *   richtext     — TipTap editor
 *   image        — opens MediaPicker
 *   button       — composite (label + href + variant)
 *   select       — dropdown (with options)
 *   toggle       — boolean
 *   repeater     — list of sub-objects (cards, stats, testimonials, etc.)
 *   url          — URL input
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'button'
  | 'select'
  | 'toggle'
  | 'repeater'
  | 'url';

export interface BaseField {
  path: string; // dot-notation path into the section's data
  label: string;
  description?: string;
  required?: boolean;
}

export interface TextField extends BaseField {
  type: 'text' | 'textarea' | 'url';
  placeholder?: string;
  maxLength?: number;
}

export interface RichTextField extends BaseField {
  type: 'richtext';
}

export interface ImageField extends BaseField {
  type: 'image';
  // Media folder to default to when picking
  folder?: string;
}

export interface ButtonField extends BaseField {
  type: 'button';
}

export interface SelectField extends BaseField {
  type: 'select';
  options: Array<{ value: string; label: string }>;
}

export interface ToggleField extends BaseField {
  type: 'toggle';
}

export interface RepeaterField extends BaseField {
  type: 'repeater';
  itemLabel: string;
  defaultItem: Record<string, unknown>;
  fields: FieldConfig[];
  min?: number;
  max?: number;
}

export type FieldConfig =
  | TextField
  | RichTextField
  | ImageField
  | ButtonField
  | SelectField
  | ToggleField
  | RepeaterField;

export interface FieldGroup {
  title: string;
  fields: FieldConfig[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-section field configs
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_FIELDS: Record<SectionType, FieldGroup[]> = {
  hero: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow', placeholder: 'Welcome to' },
        { type: 'text', path: 'title', label: 'Title', required: true },
        { type: 'textarea', path: 'subtitle', label: 'Subtitle' },
        { type: 'textarea', path: 'description', label: 'Description' },
      ],
    },
    {
      title: 'Buttons',
      fields: [
        { type: 'button', path: 'primaryButton', label: 'Primary Button' },
        { type: 'button', path: 'secondaryButton', label: 'Secondary Button' },
      ],
    },
    {
      title: 'Layout',
      fields: [
        {
          type: 'select',
          path: 'align',
          label: 'Alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
          ],
        },
        {
          type: 'select',
          path: 'size',
          label: 'Size',
          options: [
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'large', label: 'Large' },
          ],
        },
        { type: 'image', path: 'backgroundImage', label: 'Background Image', folder: 'hero' },
      ],
    },
  ],

  banner: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title', required: true },
        { type: 'textarea', path: 'description', label: 'Description' },
        { type: 'image', path: 'image', label: 'Image', folder: 'banners' },
        { type: 'button', path: 'button', label: 'Button' },
        {
          type: 'select',
          path: 'theme',
          label: 'Theme',
          options: [
            { value: 'brand', label: 'Brand' },
            { value: 'soft', label: 'Soft' },
            { value: 'gold', label: 'Gold' },
          ],
        },
      ],
    },
  ],

  rich_text: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'richtext', path: 'body', label: 'Body' },
        {
          type: 'select',
          path: 'maxWidth',
          label: 'Max Width',
          options: [
            { value: 'narrow', label: 'Narrow' },
            { value: 'normal', label: 'Normal' },
            { value: 'wide', label: 'Wide' },
          ],
        },
      ],
    },
  ],

  stats: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        {
          type: 'repeater',
          path: 'stats',
          label: 'Statistics',
          itemLabel: 'Stat',
          min: 1,
          max: 6,
          defaultItem: { id: '', value: '100+', label: 'Students' },
          fields: [
            { type: 'text', path: 'value', label: 'Value', required: true },
            { type: 'text', path: 'label', label: 'Label', required: true },
          ],
        },
      ],
    },
  ],

  cards: [
    {
      title: 'Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'title', label: 'Title', required: true },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'select',
          path: 'layout',
          label: 'Layout',
          options: [
            { value: 'grid-2', label: '2 columns' },
            { value: 'grid-3', label: '3 columns' },
            { value: 'grid-4', label: '4 columns' },
            { value: 'list', label: 'List' },
          ],
        },
      ],
    },
    {
      title: 'Cards',
      fields: [
        {
          type: 'repeater',
          path: 'cards',
          label: 'Cards',
          itemLabel: 'Card',
          min: 1,
          defaultItem: { id: '', title: 'New Card', description: '' },
          fields: [
            { type: 'text', path: 'title', label: 'Title', required: true },
            { type: 'textarea', path: 'description', label: 'Description' },
            { type: 'image', path: 'image', label: 'Image', folder: 'cards' },
            { type: 'url', path: 'href', label: 'Link URL' },
          ],
        },
      ],
    },
  ],

  gallery: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'select',
          path: 'layout',
          label: 'Layout',
          options: [
            { value: 'grid-3', label: '3 columns' },
            { value: 'grid-4', label: '4 columns' },
            { value: 'masonry', label: 'Masonry' },
            { value: 'carousel', label: 'Carousel' },
          ],
        },
        {
          type: 'repeater',
          path: 'images',
          label: 'Images',
          itemLabel: 'Image',
          min: 1,
          defaultItem: { url: '', alt: '' },
          fields: [
            { type: 'image', path: '', label: 'Image', folder: 'gallery' },
          ],
        },
      ],
    },
  ],

  principal_message: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'name', label: 'Name', required: true },
        { type: 'text', path: 'role', label: 'Role' },
        { type: 'image', path: 'portrait', label: 'Portrait', folder: 'staff' },
        { type: 'richtext', path: 'message', label: 'Message' },
        { type: 'text', path: 'signature', label: 'Signature' },
      ],
    },
  ],

  cta: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title', required: true },
        { type: 'textarea', path: 'description', label: 'Description' },
        { type: 'button', path: 'primaryButton', label: 'Primary Button' },
        { type: 'button', path: 'secondaryButton', label: 'Secondary Button' },
        { type: 'image', path: 'backgroundImage', label: 'Background Image' },
        {
          type: 'select',
          path: 'theme',
          label: 'Theme',
          options: [
            { value: 'brand', label: 'Brand' },
            { value: 'soft', label: 'Soft' },
            { value: 'dark', label: 'Dark' },
          ],
        },
      ],
    },
  ],

  testimonials: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        {
          type: 'repeater',
          path: 'testimonials',
          label: 'Testimonials',
          itemLabel: 'Testimonial',
          min: 1,
          defaultItem: { id: '', quote: '', author: '', role: '' },
          fields: [
            { type: 'textarea', path: 'quote', label: 'Quote', required: true },
            { type: 'text', path: 'author', label: 'Author', required: true },
            { type: 'text', path: 'role', label: 'Role' },
            { type: 'image', path: 'avatar', label: 'Avatar', folder: 'avatars' },
          ],
        },
      ],
    },
  ],

  faq: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        {
          type: 'repeater',
          path: 'items',
          label: 'Questions',
          itemLabel: 'Question',
          min: 1,
          defaultItem: { id: '', question: '', answer: '' },
          fields: [
            { type: 'text', path: 'question', label: 'Question', required: true },
            { type: 'textarea', path: 'answer', label: 'Answer', required: true },
          ],
        },
      ],
    },
  ],

  video: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        { type: 'url', path: 'videoUrl', label: 'Video URL', placeholder: 'https://youtube.com/watch?v=...', required: true },
        { type: 'image', path: 'poster', label: 'Poster Image' },
      ],
    },
  ],

  timeline: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title', required: true },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'repeater',
          path: 'steps',
          label: 'Steps',
          itemLabel: 'Step',
          min: 1,
          defaultItem: { id: '', title: '', description: '' },
          fields: [
            { type: 'text', path: 'title', label: 'Title', required: true },
            { type: 'textarea', path: 'description', label: 'Description' },
          ],
        },
      ],
    },
  ],
};
