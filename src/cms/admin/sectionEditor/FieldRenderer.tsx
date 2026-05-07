import { useState } from 'react';
import { ImageIcon, Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RichTextEditor } from '../components/RichTextEditor';
import { MediaPicker } from '../components/MediaPicker';
import type { FieldConfig, RepeaterField } from './fieldConfig';
import { getAtPath, setAtPath } from './pathUtils';
import type {
  ImageRef,
  Button as ButtonType,
  Background,
} from '@/cms/schema/sections';

interface Props {
  field: FieldConfig;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

/**
 * Decide whether to render a field based on its `showIf` condition.
 * The condition is checked against the *parent* data object that this field
 * lives in, supporting dot-paths and value-equality (single value or array
 * of allowed values).
 */
function shouldShow(field: FieldConfig, data: Record<string, unknown>): boolean {
  if (!field.showIf) return true;
  const actual = getAtPath(data, field.showIf.path);
  const expected = field.showIf.equals;
  if (Array.isArray(expected)) return expected.includes(actual as never);
  return actual === expected;
}

export function FieldRenderer({ field, data, onChange }: Props) {
  if (!shouldShow(field, data)) return null;

  const value = getAtPath(data, field.path);
  const set = (newValue: unknown) =>
    onChange(setAtPath(data, field.path, newValue));

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div>
          <Label field={field} />
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            value={(value as string) ?? ''}
            onChange={(e) => set(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className="input-field"
          />
        </div>
      );

    case 'textarea':
      return (
        <div>
          <Label field={field} />
          <textarea
            value={(value as string) ?? ''}
            onChange={(e) => set(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="input-field resize-y"
          />
        </div>
      );

    case 'number':
      return (
        <div>
          <Label field={field} />
          <input
            type="number"
            value={(value as number) ?? ''}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            onChange={(e) =>
              set(e.target.value === '' ? undefined : Number(e.target.value))
            }
            className="input-field"
          />
        </div>
      );

    case 'richtext':
      return (
        <div>
          <Label field={field} />
          <RichTextEditor
            value={(value as string) ?? ''}
            onChange={set}
            placeholder={`Write ${field.label.toLowerCase()}…`}
          />
        </div>
      );

    case 'image':
      return (
        <ImageFieldComponent
          field={field}
          value={value as ImageRef | undefined}
          onChange={set}
        />
      );

    case 'icon':
      return (
        <IconFieldComponent
          field={field}
          value={(value as string) ?? ''}
          onChange={set}
        />
      );

    case 'button':
      return (
        <ButtonFieldComponent
          field={field}
          value={value as ButtonType | undefined}
          onChange={set}
        />
      );

    case 'select':
      return (
        <div>
          <Label field={field} />
          <select
            value={(value as string) ?? ''}
            onChange={(e) => set(e.target.value)}
            className="input-field"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'toggle':
      return (
        <label className="flex items-center justify-between gap-3">
          <Label field={field} className="!mb-0" />
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(value)}
            onClick={() => set(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? 'bg-brand-700' : 'bg-ink-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      );

    case 'color':
      return (
        <ColorFieldComponent
          field={field}
          value={(value as string) ?? ''}
          onChange={set}
        />
      );

    case 'background':
      return (
        <BackgroundFieldComponent
          field={field}
          value={(value as Background) ?? { type: 'none', color: '' }}
          onChange={set}
        />
      );

    case 'repeater':
      return (
        <RepeaterFieldRenderer
          field={field}
          value={(value as Array<Record<string, unknown>>) ?? []}
          onChange={set}
        />
      );
  }
}

function Label({
  field,
  className = '',
}: {
  field: FieldConfig;
  className?: string;
}) {
  return (
    <div className={`mb-1.5 ${className}`}>
      <label className="text-sm font-medium text-ink-700">
        {field.label}
        {field.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {field.description && (
        <p className="text-xs text-ink-500">{field.description}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image field
// ─────────────────────────────────────────────────────────────────────────────

function ImageFieldComponent({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldConfig, { type: 'image' }>;
  value: ImageRef | undefined;
  onChange: (v: ImageRef | undefined) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const hasImage = value?.url;

  return (
    <div>
      <Label field={field} />
      <div className="space-y-2">
        {hasImage ? (
          <div className="group relative overflow-hidden rounded-xl border border-ink-300/30 bg-surface-soft">
            <img
              src={value.url}
              alt={value.alt}
              className="h-40 w-full object-cover"
            />
            <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/50 group-hover:flex">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300/40 text-ink-500 hover:border-brand-700 hover:text-brand-700"
          >
            <ImageIcon className="h-6 w-6" />
            <span className="text-sm font-medium">Choose image</span>
          </button>
        )}
        {hasImage && (
          <input
            type="text"
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Alt text (for accessibility)"
            className="input-field !py-2 text-sm"
          />
        )}
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(item) =>
          onChange({ url: item.url, alt: item.alt || value?.alt || '' })
        }
        defaultFolder={field.folder}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon field — accepts a lucide icon name with live preview
// ─────────────────────────────────────────────────────────────────────────────

function IconFieldComponent({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (v: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = value ? (Icons as any)[value] : null;
  const valid = Boolean(Icon);

  return (
    <div>
      <Label field={field} />
      <div className="flex gap-2">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
            valid
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-ink-300/30 bg-surface-soft text-ink-300'
          }`}
        >
          {Icon ? <Icon className="h-5 w-5" /> : <span className="text-xs">?</span>}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="GraduationCap"
          className="input-field flex-1 font-mono text-sm"
        />
        <a
          href="https://lucide.dev/icons/"
          target="_blank"
          rel="noreferrer"
          title="Browse icons"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink-300/30 text-ink-500 hover:border-brand-700 hover:text-brand-700"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      {value && !valid && (
        <p className="mt-1 text-xs text-amber-600">
          "{value}" isn't a valid lucide icon name. Browse at lucide.dev/icons.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Button field (composite)
// ─────────────────────────────────────────────────────────────────────────────

function ButtonFieldComponent({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: ButtonType | undefined;
  onChange: (v: ButtonType | undefined) => void;
}) {
  const enabled = Boolean(value);
  const current = value ?? { label: '', href: '', variant: 'primary' as const };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-ink-700">{field.label}</label>
        <button
          type="button"
          onClick={() =>
            onChange(
              enabled
                ? undefined
                : { label: 'Click me', href: '#', variant: 'primary' },
            )
          }
          className="text-xs font-medium text-brand-700 hover:underline"
        >
          {enabled ? 'Remove' : 'Add button'}
        </button>
      </div>
      {enabled && (
        <div className="space-y-2 rounded-xl border border-ink-300/20 bg-surface-soft p-3">
          <input
            type="text"
            value={current.label}
            onChange={(e) => onChange({ ...current, label: e.target.value })}
            placeholder="Button label"
            className="input-field !py-2 text-sm"
          />
          <input
            type="text"
            value={current.href}
            onChange={(e) => onChange({ ...current, href: e.target.value })}
            placeholder="URL (e.g., /admissions)"
            className="input-field !py-2 text-sm"
          />
          <select
            value={current.variant}
            onChange={(e) =>
              onChange({
                ...current,
                variant: e.target.value as ButtonType['variant'],
              })
            }
            className="input-field !py-2 text-sm"
          >
            <option value="primary">Primary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Color field
// ─────────────────────────────────────────────────────────────────────────────

function ColorFieldComponent({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label field={field} />
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-ink-300/30"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="input-field flex-1 font-mono text-sm"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Background field — composite (preset + optional color)
// ─────────────────────────────────────────────────────────────────────────────

const BG_PRESETS: Array<{
  value: Background['type'];
  label: string;
  swatch: string;
}> = [
  { value: 'none', label: 'None', swatch: 'bg-transparent ring-1 ring-ink-300/40' },
  { value: 'soft', label: 'Soft', swatch: 'bg-surface-soft' },
  { value: 'muted', label: 'Muted', swatch: 'bg-surface-muted' },
  { value: 'brand', label: 'Brand', swatch: 'bg-brand-700' },
  { value: 'dark', label: 'Dark', swatch: 'bg-ink-900' },
  { value: 'color', label: 'Custom', swatch: 'bg-gradient-to-br from-rose-400 to-amber-300' },
];

function BackgroundFieldComponent({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: Background;
  onChange: (v: Background) => void;
}) {
  const safe: Background = value ?? { type: 'none', color: '' };
  return (
    <div>
      <Label field={field} />
      <div className="grid grid-cols-3 gap-2">
        {BG_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange({ ...safe, type: preset.value })}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-colors ${
              safe.type === preset.value
                ? 'border-brand-700 ring-2 ring-brand-200'
                : 'border-ink-300/30 hover:border-ink-300'
            }`}
          >
            <span
              className={`h-8 w-full rounded-lg ${preset.swatch}`}
              aria-hidden
            />
            <span className="text-xs font-medium text-ink-700">{preset.label}</span>
          </button>
        ))}
      </div>
      {safe.type === 'color' && (
        <div className="mt-3 flex gap-2">
          <input
            type="color"
            value={safe.color || '#ffffff'}
            onChange={(e) => onChange({ ...safe, color: e.target.value })}
            className="h-10 w-14 cursor-pointer rounded-lg border border-ink-300/30"
          />
          <input
            type="text"
            value={safe.color}
            onChange={(e) => onChange({ ...safe, color: e.target.value })}
            placeholder="#ffffff or rgb(...)"
            className="input-field flex-1 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Repeater field
// ─────────────────────────────────────────────────────────────────────────────

function RepeaterFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: RepeaterField;
  value: Array<Record<string, unknown>>;
  onChange: (v: Array<Record<string, unknown>>) => void;
}) {
  const items = value.map((item, i) => ({
    ...item,
    id: (item.id as string) || `item-${i}`,
  }));

  const addItem = () => {
    const newItem = { ...field.defaultItem, id: crypto.randomUUID() };
    onChange([...items, newItem]);
  };

  const updateItem = (idx: number, newItem: Record<string, unknown>) => {
    const next = [...items];
    next[idx] = { ...newItem, id: (newItem.id as string) ?? items[idx].id };
    onChange(next);
  };

  const removeItem = (idx: number) => {
    if (field.min !== undefined && items.length <= field.min) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = [...items];
    const [moved] = next.splice(oldIdx, 1);
    next.splice(newIdx, 0, moved);
    onChange(next);
  };

  const canAdd = field.max === undefined || items.length < field.max;
  const canRemove = field.min === undefined || items.length > field.min;

  return (
    <div>
      <Label field={field} />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => i.id as string)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item, idx) => (
              <RepeaterItem
                key={item.id as string}
                id={item.id as string}
                index={idx}
                item={item}
                field={field}
                onChange={(newItem) => updateItem(idx, newItem)}
                onRemove={canRemove ? () => removeItem(idx) : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {canAdd && (
        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300/40 py-3 text-sm font-medium text-ink-500 hover:border-brand-700 hover:text-brand-700"
        >
          <Plus className="h-4 w-4" /> Add {field.itemLabel}
        </button>
      )}
    </div>
  );
}

function RepeaterItem({
  id,
  index,
  item,
  field,
  onChange,
  onRemove,
}: {
  id: string;
  index: number;
  item: Record<string, unknown>;
  field: RepeaterField;
  onChange: (item: Record<string, unknown>) => void;
  onRemove?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const preview = (item.title ||
    item.question ||
    item.label ||
    item.value ||
    item.author ||
    `${field.itemLabel} ${index + 1}`) as string;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-xl border border-ink-300/20 bg-white"
    >
      <div className="flex items-center gap-2 bg-surface-soft px-3 py-2">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="cursor-grab text-ink-400 hover:text-ink-700 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex-1 truncate text-left text-sm font-medium text-ink-700"
        >
          {preview || `${field.itemLabel} ${index + 1}`}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {!collapsed && (
        <div className="space-y-3 p-3">
          {field.fields.map((subField, i) => (
            <FieldRenderer
              key={`${subField.path}-${i}`}
              field={subField}
              data={item}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
