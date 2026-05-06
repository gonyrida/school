import { useEffect, useState } from 'react';
import { cms } from '@/cms/api';
import type { Page } from '@/cms/schema/sections';

/**
 * Fetch a CMS page by key. Returns the page, loading state, and any error.
 * Used by public-site routes to render content dynamically from the CMS.
 */

export function useCmsPage(key: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    cms
      .getPage(key)
      .then((p) => {
        if (cancelled) return;
        setPage(p);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { page, loading, error };
}
