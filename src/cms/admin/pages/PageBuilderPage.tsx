import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Save, ExternalLink, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePageEditor } from '@/cms/store/pageEditor';
import { getPageDefinition } from '@/cms/schema/pages';
import { SectionList } from '@/cms/admin/sectionEditor/SectionList';
import { SectionEditorPanel } from '@/cms/admin/sectionEditor/SectionEditorPanel';
import { PageRenderer } from '@/cms/renderer/PageRenderer';
import { SkeletonStack } from '@/cms/admin/components/Skeleton';
import { Breadcrumbs } from '@/cms/admin/components/Breadcrumbs';
import { PageSettingsDrawer } from './PageSettingsDrawer';

export default function PageBuilderPage() {
  const { pageKey } = useParams<{ pageKey: string }>();
  const decodedKey = pageKey ? decodeURIComponent(pageKey) : '';
  const def = getPageDefinition(decodedKey);

  const { page, loading, saving, dirty, selectedSectionId, load, save, reset } = usePageEditor();
  const [previewMode, setPreviewMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (decodedKey) {
      void load(decodedKey);
    }
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedKey]);

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleSave = async () => {
    try {
      await save();
      toast.success('Page saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  if (!def) {
    return (
      <div className="card p-8 text-center">
        <h2 className="font-display text-xl font-bold text-ink-900">Page not found</h2>
        <p className="mt-2 text-ink-500">The page key "{decodedKey}" is not registered.</p>
        <Link to="/dashboard/pages" className="btn-primary mt-4 inline-flex">
          Back to pages
        </Link>
      </div>
    );
  }

  return (
    <div className="-m-6 flex h-[calc(100vh-72px)] flex-col">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-300/20 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/pages"
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
            aria-label="Back to pages"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Pages', to: '/dashboard/pages' },
                { label: def.title },
              ]}
            />
            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-ink-900">{def.title}</h1>
              {page && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {page.status}
                </span>
              )}
              {dirty && (
                <span className="text-xs text-amber-600">• Unsaved changes</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={def.route} target="_blank" className="btn-ghost !py-2 text-sm">
            <ExternalLink className="h-4 w-4" /> View live
          </Link>
          <button onClick={() => setPreviewMode(!previewMode)} className="btn-ghost !py-2 text-sm">
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {previewMode ? 'Exit preview' : 'Preview'}
          </button>
          <button onClick={() => setSettingsOpen(true)} className="btn-ghost !py-2 text-sm">
            <Settings2 className="h-4 w-4" /> Settings
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="btn-primary !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section list (left) */}
        {!previewMode && (
          <aside className="w-80 shrink-0 overflow-y-auto border-r border-ink-300/20 bg-surface-soft px-4 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Sections</p>
            {loading ? <SkeletonStack count={4} className="h-14" /> : <SectionList pageKey={decodedKey} />}
          </aside>
        )}

        {/* Preview (center) */}
        <main className="flex-1 overflow-y-auto bg-ink-100/40">
          <div className="mx-auto my-4 max-w-6xl overflow-hidden rounded-2xl bg-white shadow-sm">
            {loading ? (
              <div className="space-y-4 p-8">
                <SkeletonStack count={3} className="h-32" />
              </div>
            ) : page ? (
              <PageRenderer page={page} showHidden={!previewMode} />
            ) : null}
          </div>
        </main>

        {/* Section editor (right) */}
        {!previewMode && selectedSectionId && (
          <div className="w-96 shrink-0 border-l border-ink-300/20">
            <SectionEditorPanel />
          </div>
        )}
      </div>

      <PageSettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
