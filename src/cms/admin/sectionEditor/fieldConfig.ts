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
 *   icon         — lucide icon name picker
 *   button       — composite (label + href + variant)
 *   select       — dropdown (with options)
 *   toggle       — boolean
 *   number       — numeric input
 *   color        — color picker (hex / preset)
 *   background   — composite background picker (type + color)
 *   repeater     — list of sub-objects (cards, stats, testimonials, etc.)
 *   url          — URL input
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'icon'
  | 'button'
  | 'select'
  | 'toggle'
  | 'number'
  | 'color'
  | 'background'
  | 'repeater'
  | 'url';

export interface BaseField {
  path: string;
  label: string;
  description?: string;
  required?: boolean;
  // Optional: only show this field when another field's value matches.
  // Use to keep the editor compact (e.g., only show "image url" when kind === 'image').
  showIf?: { path: string; equals: unknown | unknown[] };
}

export interface TextField extends BaseField {
  type: 'text' | 'textarea' | 'url';
  placeholder?: string;
  maxLength?: number;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface RichTextField extends BaseField {
  type: 'richtext';
}

export interface ImageField extends BaseField {
  type: 'image';
  folder?: string;
}

export interface IconField extends BaseField {
  type: 'icon';
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

export interface ColorField extends BaseField {
  type: 'color';
}

export interface BackgroundField extends BaseField {
  type: 'background';
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
  | NumberField
  | RichTextField
  | ImageField
  | IconField
  | ButtonField
  | SelectField
  | ToggleField
  | ColorField
  | BackgroundField
  | RepeaterField;

export interface FieldGroup {
  title: string;
  fields: FieldConfig[];
}

// Reusable groups
const APPEARANCE_GROUP: FieldGroup = {
  title: 'Appearance',
  fields: [{ type: 'background', path: 'background', label: 'Section background' }],
};

// Card item fields (used inside the cards repeater)
const CARD_ITEM_FIELDS: FieldConfig[] = [
  { type: 'text', path: 'title', label: 'Title' },
  { type: 'textarea', path: 'description', label: 'Description' },
  {
    type: 'toggle',
    path: 'collapsibleDescription',
    label: 'Collapsible description',
    description: 'Show description behind a "Read more" toggle',
  },
  { type: 'url', path: 'href', label: 'Link URL', placeholder: '/admissions' },

  // Visual element controls
  {
    type: 'select',
    path: 'visual.kind',
    label: 'Visual element',
    options: [
      { value: 'none', label: 'None' },
      { value: 'image', label: 'Image' },
      { value: 'icon', label: 'Icon' },
    ],
  },
  {
    type: 'image',
    path: 'visual.image',
    label: 'Image',
    folder: 'cards',
    showIf: { path: 'visual.kind', equals: 'image' },
  },
  {
    type: 'icon',
    path: 'visual.iconName',
    label: 'Icon (lucide-react name)',
    description: 'e.g. GraduationCap, BookOpen, Users — see lucide.dev/icons',
    showIf: { path: 'visual.kind', equals: 'icon' },
  },
  {
    type: 'select',
    path: 'visual.shape',
    label: 'Shape',
    showIf: { path: 'visual.kind', equals: ['image', 'icon'] },
    options: [
      { value: 'square', label: 'Square' },
      { value: 'rounded', label: 'Rounded' },
      { value: 'circle', label: 'Circle' },
    ],
  },
  {
    type: 'select',
    path: 'visual.position',
    label: 'Visual position',
    showIf: { path: 'visual.kind', equals: ['image', 'icon'] },
    options: [
      { value: 'top', label: 'Top' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
    ],
  },
  {
    type: 'select',
    path: 'textAlign',
    label: 'Text alignment',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Per-section field configs
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_FIELDS: Record<SectionType, FieldGroup[]> = {
  hero: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow', placeholder: 'Welcome to' },
        { type: 'text', path: 'title', label: 'Title' },
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
    APPEARANCE_GROUP,
  ],

  banner: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
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
    APPEARANCE_GROUP,
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
    APPEARANCE_GROUP,
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
          max: 6,
          defaultItem: { id: '', value: '100+', label: 'Students' },
          fields: [
            { type: 'text', path: 'value', label: 'Value' },
            { type: 'text', path: 'label', label: 'Label' },
          ],
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  cards: [
    {
      title: 'Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'select',
          path: 'layout',
          label: 'Layout',
          options: [
            { value: 'grid-2', label: '2 columns' },
            { value: 'grid-3', label: '3 columns' },
            { value: 'grid-4', label: '4 columns' },
            { value: 'list', label: 'List (stacked)' },
          ],
        },
        {
          type: 'select',
          path: 'defaultTextAlign',
          label: 'Default text alignment',
          description: 'Each card can override this',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
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
          defaultItem: {
            id: '',
            title: 'New card',
            description: '',
            visual: { kind: 'none', iconName: '', shape: 'rounded', position: 'top' },
            textAlign: 'left',
            collapsibleDescription: false,
            href: '',
          },
          fields: CARD_ITEM_FIELDS,
        },
      ],
    },
    APPEARANCE_GROUP,
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
            { value: 'standard-grid', label: 'Standard Grid (equal sizes)' },
            { value: 'masonry', label: 'Masonry (varying heights)' },
            { value: 'justified', label: 'Justified Gallery (rows)' },
            { value: 'metro', label: 'Metro Grid (asymmetric)' },
            { value: 'carousel', label: 'Carousel (horizontal scroll)' },
          ],
        },
        {
          type: 'select',
          path: 'columns',
          label: 'Columns',
          options: [
            { value: '2', label: '2 columns' },
            { value: '3', label: '3 columns' },
            { value: '4', label: '4 columns' },
            { value: '5', label: '5 columns' },
          ],
        },
        {
          type: 'select',
          path: 'gap',
          label: 'Spacing',
          options: [
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ],
        },
        {
          type: 'repeater',
          path: 'images',
          label: 'Images',
          itemLabel: 'Image',
          defaultItem: { url: '', alt: '' },
          fields: [{ type: 'image', path: '', label: 'Image', folder: 'gallery' }],
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  principal_message: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'name', label: 'Name' },
        { type: 'text', path: 'role', label: 'Role' },
        { type: 'image', path: 'portrait', label: 'Portrait', folder: 'staff' },
        { type: 'richtext', path: 'message', label: 'Message' },
        { type: 'text', path: 'signature', label: 'Signature' },
      ],
    },
    APPEARANCE_GROUP,
  ],

  cta: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
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
    APPEARANCE_GROUP,
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
          defaultItem: { id: '', quote: '', author: '', role: '' },
          fields: [
            { type: 'textarea', path: 'quote', label: 'Quote' },
            { type: 'text', path: 'author', label: 'Author' },
            { type: 'text', path: 'role', label: 'Role' },
            { type: 'image', path: 'avatar', label: 'Avatar', folder: 'avatars' },
          ],
        },
      ],
    },
    APPEARANCE_GROUP,
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
          defaultItem: { id: '', question: '', answer: '' },
          fields: [
            { type: 'text', path: 'question', label: 'Question' },
            { type: 'textarea', path: 'answer', label: 'Answer' },
          ],
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  video: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'url',
          path: 'videoUrl',
          label: 'Video URL',
          placeholder: 'https://youtube.com/watch?v=...',
        },
        { type: 'image', path: 'poster', label: 'Poster Image' },
      ],
    },
    APPEARANCE_GROUP,
  ],

  timeline: [
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
            { value: 'zigzag', label: 'Zigzag (alternating sides)' },
            { value: 'vertical', label: 'Vertical (single column)' },
            { value: 'horizontal', label: 'Horizontal (row)' },
          ],
        },
        {
          type: 'repeater',
          path: 'steps',
          label: 'Steps',
          itemLabel: 'Step',
          defaultItem: { id: '', title: '', description: '' },
          fields: [
            { type: 'text', path: 'title', label: 'Title' },
            { type: 'textarea', path: 'description', label: 'Description' },
          ],
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  events_feed: [
    {
      title: 'Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
      ],
    },
    {
      title: 'Display',
      fields: [
        {
          type: 'number',
          path: 'limit',
          label: 'How many events',
          min: 1,
          max: 12,
          step: 1,
        },
        {
          type: 'select',
          path: 'category',
          label: 'Filter by category',
          options: [
            { value: 'All', label: 'All categories' },
            { value: 'Academy', label: 'Academy' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Arts', label: 'Arts' },
            { value: 'Community', label: 'Community' },
          ],
        },
        {
          type: 'select',
          path: 'layout',
          label: 'Layout',
          options: [
            { value: 'grid-2', label: '2 columns' },
            { value: 'grid-3', label: '3 columns' },
          ],
        },
        { type: 'toggle', path: 'showViewAll', label: 'Show "View all" link' },
        { type: 'text', path: 'viewAllLabel', label: '"View all" label' },
      ],
    },
    APPEARANCE_GROUP,
  ],
};
