/**
 * ScrollToTop.tsx
 * ✅ FIX 3: Scrolls window to top smoothly on every React Router page change.
 *
 * Usage — add once inside <BrowserRouter> in main.tsx or App.tsx:
 *   import { ScrollToTop } from '@/components/ScrollToTop';
 *   // inside your JSX just above <Routes>:
 *   <ScrollToTop />
 *   <Routes> ... </Routes>
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'smooth' gives a nice glide; change to 'instant' if you prefer no animation
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null; // renders nothing
}
