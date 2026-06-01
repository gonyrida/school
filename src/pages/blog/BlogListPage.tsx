import { Helmet } from 'react-helmet';
import { useBlogs } from '@/hooks/useBlogs';
import { BlogCard } from '@/components/blog/BlogCard';
import { Search, Loader } from 'lucide-react';
import { useState } from 'react';

export default function BlogListPage() {
  const { blogs, loading } = useBlogs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Blog | Norol Iman High School</title>
        <meta
          name="description"
          content="Read our latest blog posts about education, student life, and school events."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog | Norol Iman High School" />
        <meta
          property="og:description"
          content="Read our latest blog posts about education, student life, and school events."
        />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container-page py-12">
            <p className="eyebrow text-brand-700">Latest Updates</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink-900">Blog</h1>
            <p className="mt-3 max-w-lg text-lg text-ink-600">
              Insights, stories, and updates from Norol Iman High School
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white py-6 shadow-sm">
          <div className="container-page">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-ink-900 placeholder-ink-400 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20"
              />
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="container-page py-16">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-ink-500">
                {searchQuery ? 'No blog posts match your search.' : 'No blog posts yet.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
