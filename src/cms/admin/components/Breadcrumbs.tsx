import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.to && !isLast ? (
              <Link to={c.to} className="text-ink-500 hover:text-brand-700">
                {c.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-semibold text-ink-900' : 'text-ink-500'}>
                {c.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-ink-400" />}
          </span>
        );
      })}
    </nav>
  );
}
