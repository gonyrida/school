import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBlogAdmin } from '@/hooks/useBlogs';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Eye, EyeOff, Plus, Loader } from 'lucide-react';

export default function AdminBlogListPage() {
  const navigate = useNavigate();
  const { blogs, loading, deleteBlog, togglePublish, refetch } = useBlogAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setDeleting(id);
    try {
      await deleteBlog(id);
      toast.success('Blog post deleted');
    } catch (error) {
      toast.error('Failed to delete blog post');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await togglePublish(id, !currentStatus);
      toast.success(currentStatus ? 'Post unpublished' : 'Post published');
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Blog Posts</h1>
          <p className="mt-1 text-ink-500">Manage all blog posts and content</p>
        </div>
        <button
          onClick={() => navigate('new')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-ink-500">No blog posts yet</p>
          <button
            onClick={() => navigate('/admin/blog/new')}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create First Post
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-gray-200 transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-ink-900">{blog.title}</p>
                      {blog.excerpt && (
                        <p className="mt-1 line-clamp-1 text-sm text-ink-500">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        blog.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {blog.published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-500">
                    {formatDate(blog.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(blog.id, blog.published)}
                        title={blog.published ? 'Unpublish' : 'Publish'}
                        className="rounded p-2 transition hover:bg-gray-100"
                      >
                        {blog.published ? (
                          <Eye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`edit/${blog.id}`)}
                        className="rounded p-2 transition hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 text-brand-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleting === blog.id}
                        className="rounded p-2 transition hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
