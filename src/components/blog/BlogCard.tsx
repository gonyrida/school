import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types/blog';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <article className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
        {/* Cover Image */}
        {blog.cover_image && (
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <img
              src={blog.cover_image}
              alt={blog.cover_alt || blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h3 className="line-clamp-2 text-lg font-semibold text-ink-900 transition-colors group-hover:text-brand-600">
            {blog.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm text-ink-500">
            {blog.excerpt || blog.content.substring(0, 150).replace(/<[^>]*>/g, '')}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <time className="text-xs font-medium text-ink-400">
              {formatDate(blog.created_at)}
            </time>
            <span className="text-xs font-medium text-brand-600 transition-opacity group-hover:opacity-75">
              Read →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
