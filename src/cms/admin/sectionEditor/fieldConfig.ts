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
  | 'string_list'
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

export interface StringListField extends BaseField {
  type: 'string_list';
  itemPlaceholder?: string;
  addLabel?: string; // e.g. "Add bullet"
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
  | RepeaterField
  | StringListField;

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

  // Description: paragraph, bulleted list, or both stacked
  {
    type: 'select',
    path: 'descriptionMode',
    label: 'Description style',
    options: [
      { value: 'paragraph', label: 'Paragraph (text)' },
      { value: 'list', label: 'Bulleted list' },
      { value: 'both', label: 'Both: paragraph + list' },
    ],
  },
  {
    type: 'textarea',
    path: 'description',
    label: 'Description',
    showIf: { path: 'descriptionMode', equals: ['paragraph', 'both'] },
  },
  {
    type: 'string_list',
    path: 'descriptionList',
    label: 'List items',
    itemPlaceholder: 'Add a bullet point…',
    addLabel: 'Add list item',
    showIf: { path: 'descriptionMode', equals: ['list', 'both'] },
  },
  {
    type: 'toggle',
    path: 'collapsibleDescription',
    label: 'Collapsible description',
    description: 'Hide the description behind a "Read more" toggle',
    showIf: { path: 'descriptionMode', equals: 'paragraph' },
  },
  { type: 'url', path: 'href', label: 'Link URL (whole card)', placeholder: '/admissions' },

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
      { value: 'square', label: 'Square (no rounding)' },
      { value: 'rounded', label: 'Rounded corners' },
      { value: 'circle', label: 'Circle' },
    ],
  },
  {
    type: 'number',
    path: 'visual.size',
    label: 'Visual size (px)',
    description: 'Width and height of the icon/image badge',
    min: 24,
    max: 200,
    step: 4,
    showIf: { path: 'visual.kind', equals: ['image', 'icon'] },
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
    description: 'Override the section default for this card',
    options: [
      { value: 'inherit', label: 'Use section default' },
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },

  // Button inside the card
  { type: 'button', path: 'button', label: 'Card button' },
  {
    type: 'select',
    path: 'buttonAlign',
    label: 'Button alignment',
    description: 'Only used when card button is set',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },

  // Per-card background
  {
    type: 'select',
    path: 'cardBackground.type',
    label: 'Card background',
    options: [
      { value: 'inherit', label: 'Default (white)' },
      { value: 'none', label: 'None (transparent)' },
      { value: 'white', label: 'White' },
      { value: 'soft', label: 'Soft' },
      { value: 'muted', label: 'Muted' },
      { value: 'brand', label: 'Brand' },
      { value: 'dark', label: 'Dark' },
      { value: 'color', label: 'Custom color' },
    ],
  },
  {
    type: 'color',
    path: 'cardBackground.color',
    label: 'Custom background color',
    showIf: { path: 'cardBackground.type', equals: 'color' },
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

  image_text: [
    {
      title: 'Content',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'richtext', path: 'body', label: 'Body' },
      ],
    },
    {
      title: 'Image',
      fields: [
        { type: 'image', path: 'image', label: 'Image', folder: 'cards' },
        {
          type: 'select',
          path: 'imagePosition',
          label: 'Image position',
          description: 'When the image is on one side, text moves to the other',
          options: [
            { value: 'left', label: 'Left (text on right)' },
            { value: 'right', label: 'Right (text on left)' },
          ],
        },
        {
          type: 'select',
          path: 'imageShape',
          label: 'Image shape',
          options: [
            { value: 'square', label: 'Square (no rounding)' },
            { value: 'rounded', label: 'Rounded corners' },
            { value: 'circle', label: 'Circle' },
          ],
        },
        {
          type: 'select',
          path: 'verticalAlign',
          label: 'Text vertical alignment',
          options: [
            { value: 'top', label: 'Top' },
            { value: 'center', label: 'Center' },
            { value: 'bottom', label: 'Bottom' },
          ],
        },
      ],
    },
    {
      title: 'Buttons',
      fields: [
        { type: 'button', path: 'primaryButton', label: 'Primary Button' },
        { type: 'button', path: 'secondaryButton', label: 'Secondary Button' },
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
          path: 'titleAlign',
          label: 'Header alignment',
          description: 'Position of the eyebrow / title / description',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
        {
          type: 'select',
          path: 'layout',
          label: 'Layout',
          options: [
            { value: 'grid-1', label: '1 column' },
            { value: 'grid-2', label: '2 columns' },
            { value: 'grid-3', label: '3 columns' },
            { value: 'grid-4', label: '4 columns' },
            { value: 'list', label: 'List (stacked)' },
          ],
        },
        {
          type: 'select',
          path: 'lastCardPosition',
          label: 'Last card position (2-column layout)',
          description: 'Where the last card sits when the total count is odd',
          showIf: { path: 'layout', equals: 'grid-2' },
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
        {
          type: 'select',
          path: 'defaultTextAlign',
          label: 'Default card text alignment',
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
            descriptionMode: 'paragraph',
            description: '',
            descriptionList: [],
            visual: {
              kind: 'none',
              iconName: '',
              shape: 'rounded',
              size: 56,
              position: 'top',
            },
            textAlign: 'inherit',
            collapsibleDescription: false,
            href: '',
            cardBackground: { type: 'inherit', color: '' },
            buttonAlign: 'left',
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

  contact_info: [
    {
      title: 'Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'select',
          path: 'titleAlign',
          label: 'Title alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
        {
          type: 'select',
          path: 'layout',
          label: 'Layout',
          options: [
            { value: 'grid-2', label: '2 columns' },
            { value: 'grid-3', label: '3 columns' },
            { value: 'list', label: 'List (stacked)' },
          ],
        },
      ],
    },
    {
      title: 'Contact channels',
      fields: [
        {
          type: 'repeater',
          path: 'items',
          label: 'Contact items',
          itemLabel: 'Item',
          defaultItem: { id: '', label: '', value: '', icon: 'MapPin', href: '' },
          fields: [
            { type: 'text', path: 'label', label: 'Label', placeholder: 'Address' },
            { type: 'textarea', path: 'value', label: 'Value', placeholder: 'Phnom Penh, Cambodia' },
            {
              type: 'icon',
              path: 'icon',
              label: 'Icon',
              description: 'lucide name — e.g. MapPin, Phone, Mail',
            },
            {
              type: 'url',
              path: 'href',
              label: 'Link (optional)',
              placeholder: 'tel:+855... / mailto:... / https://maps.app.goo.gl/...',
            },
          ],
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  contact_form: [
    {
      title: 'Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow' },
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'select',
          path: 'titleAlign',
          label: 'Title alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
        { type: 'image', path: 'sideImage', label: 'Side illustration', folder: 'uploads' },
      ],
    },
    {
      title: 'Form fields',
      fields: [
        { type: 'text', path: 'nameLabel', label: 'Name field label' },
        { type: 'text', path: 'emailLabel', label: 'Email field label' },
        { type: 'text', path: 'messageLabel', label: 'Message field label' },
        { type: 'text', path: 'submitLabel', label: 'Submit button label' },
        { type: 'text', path: 'successMessage', label: 'Success message' },
        {
          type: 'url',
          path: 'submitUrl',
          label: 'Form submit URL',
          description: 'Leave empty to show success message only. Use Formspree, your API, etc.',
          placeholder: 'https://formspree.io/f/xyz',
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  map: [
    {
      title: 'Header',
      fields: [
        { type: 'text', path: 'title', label: 'Title' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'select',
          path: 'titleAlign',
          label: 'Title alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
      ],
    },
    {
      title: 'Map',
      fields: [
        {
          type: 'textarea',
          path: 'embedUrl',
          label: 'Map embed URL',
          description:
            'Paste a Google Maps embed URL. In Google Maps: Share → Embed a map → copy the src="..." value.',
        },
        {
          type: 'select',
          path: 'height',
          label: 'Map height',
          options: [
            { value: 'small', label: 'Small (300px)' },
            { value: 'medium', label: 'Medium (500px)' },
            { value: 'large', label: 'Large (700px)' },
          ],
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  fees_tuition: [
    {
      title: 'Section Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow', placeholder: 'Transparent Pricing' },
        { type: 'text', path: 'title', label: 'Title', placeholder: 'Fees & Tuition' },
        { type: 'textarea', path: 'description', label: 'Description' },
        {
          type: 'toggle',
          path: 'showNote',
          label: 'Show disclaimer note',
          description: 'Shows "* Fees are subject to change" note below cards',
        },
      ],
    },
    {
      title: 'Manage Fee Cards',
      fields: [
        {
          type: 'text',
          path: '_info',
          label: 'ℹ️ Fee cards are managed separately',
          description: 'Go to Dashboard → Fees & Tuition to add, edit, or reorder fee cards.',
          placeholder: '',
        },
      ],
    },
    APPEARANCE_GROUP,
  ],

  leadership: [
    {
      title: 'Section Header',
      fields: [
        { type: 'text', path: 'eyebrow', label: 'Eyebrow', placeholder: 'Our People' },
        { type: 'text', path: 'title', label: 'Title', placeholder: 'Leadership Team' },
        { type: 'textarea', path: 'description', label: 'Description' },
      ],
    },
    {
      title: 'Manage Leaders',
      fields: [
        {
          type: 'text',
          path: '_info',
          label: 'ℹ️ Leaders are managed separately',
          description: 'Go to Dashboard → Leadership to add, edit, reorder, or upload photos.',
          placeholder: '',
        },
      ],
    },
    APPEARANCE_GROUP,
  ],
};
