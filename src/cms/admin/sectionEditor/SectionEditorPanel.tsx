import { X } from 'lucide-react';
import { SECTION_META } from '@/cms/schema/sections';
import { SECTION_FIELDS } from './fieldConfig';
import { FieldRenderer } from './FieldRenderer';
import { usePageEditor } from '@/cms/store/pageEditor';

export function SectionEditorPanel() {
  const { page, selectedSectionId, updateSectionData, selectSection } = usePageEditor();

  if (!page || !selectedSectionId) return null;
  const section = page.sections.find((s) => s.id === selectedSectionId);
  if (!section) return null;

  const meta = SECTION_META[section.type];
  const fieldGroups = SECTION_FIELDS[section.type];

  return (
    <aside className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-ink-300/20 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{meta.label}</p>
          <p className="mt-0.5 text-sm text-ink-500">{meta.description}</p>
        </div>
        <button
          onClick={() => selectSection(null)}
          className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
          aria-label="Close editor"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="space-y-6">
          {fieldGroups.map((group, gi) => (
            <div key={gi}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
                {group.title}
              </h3>
              <div className="space-y-4">
                {group.fields.map((field) => (
                  <FieldRenderer
                    key={field.path}
                    field={field}
                    data={section.data as Record<string, unknown>}
                    onChange={(newData) => updateSectionData(section.id, newData)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
