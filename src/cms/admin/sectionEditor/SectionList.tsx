import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Eye,
  EyeOff,
  GripVertical,
  Copy,
  Trash2,
  Plus,
  Edit3,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { SECTION_META, type SectionRecord, type SectionType } from '@/cms/schema/sections';
import { usePageEditor } from '@/cms/store/pageEditor';
import { SectionPicker } from './SectionPicker';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function SectionList({ pageKey }: { pageKey: string }) {
  const {
    page,
    selectedSectionId,
    addSection,
    deleteSection,
    duplicateSection,
    toggleSectionVisibility,
    reorderSections,
    selectSection,
  } = usePageEditor();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!page) return null;
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sortedSections.findIndex((s) => s.id === active.id);
    const newIdx = sortedSections.findIndex((s) => s.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = [...sortedSections];
    const [moved] = next.splice(oldIdx, 1);
    next.splice(newIdx, 0, moved);
    reorderSections(next.map((s) => s.id));
  };

  const handleAdd = (type: SectionType) => {
    addSection(type);
    toast.success(`Added ${SECTION_META[type].label} section`);
  };

  return (
    <>
      <div className="space-y-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sortedSections.map((section) => (
              <SectionListItem
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelect={() => selectSection(section.id)}
                onToggleVisibility={() => toggleSectionVisibility(section.id)}
                onDuplicate={() => {
                  duplicateSection(section.id);
                  toast.success('Section duplicated');
                }}
                onDelete={() => setConfirmDeleteId(section.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={() => setPickerOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300/40 py-4 text-sm font-medium text-ink-500 hover:border-brand-700 hover:bg-brand-50 hover:text-brand-700"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>
      </div>

      <SectionPicker
        open={pickerOpen}
        pageKey={pageKey}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAdd}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this section?"
        description="The section and its content will be removed. This action can only be undone by canceling without saving."
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteSection(confirmDeleteId);
            toast.success('Section deleted');
            setConfirmDeleteId(null);
          }
        }}
      />
    </>
  );
}

function SectionListItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}: {
  section: SectionRecord;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  const meta = SECTION_META[section.type];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[meta.icon] ?? Icons.Square;

  // Try to derive a friendly preview from the data
  const data = section.data as Record<string, unknown>;
  const preview = (data.title || data.name || meta.label) as string;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 transition-colors ${
        isSelected ? 'border-brand-700 ring-1 ring-brand-200' : 'border-ink-300/20 hover:border-ink-300/40'
      } ${!section.visible ? 'opacity-60' : ''}`}
    >
      <button {...attributes} {...listeners} type="button" className="cursor-grab text-ink-400 active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </button>

      <button onClick={onSelect} className="flex flex-1 items-center gap-3 text-left min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{preview}</p>
          <p className="text-xs text-ink-500">{meta.label}</p>
        </div>
      </button>

      <div className="flex items-center gap-0.5">
        <IconBtn onClick={onSelect} title="Edit" Icon={Edit3} />
        <IconBtn
          onClick={onToggleVisibility}
          title={section.visible ? 'Hide' : 'Show'}
          Icon={section.visible ? Eye : EyeOff}
        />
        <IconBtn onClick={onDuplicate} title="Duplicate" Icon={Copy} />
        <IconBtn onClick={onDelete} title="Delete" Icon={Trash2} variant="danger" />
      </div>
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  Icon,
  variant = 'default',
}: {
  onClick: () => void;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-lg p-1.5 transition-colors ${
        variant === 'danger'
          ? 'text-ink-400 hover:bg-red-50 hover:text-red-600'
          : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
