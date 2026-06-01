import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Blog, BlogFormData } from '@/types/blog';

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blogs'));
    } finally {
      setLoading(false);
    }
  };

  return { blogs, loading, error, refetch: fetchBlogs };
}

export function useBlogBySlug(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blog'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  return { blog, loading, error };
}

export function useBlogAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blogs'));
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (formData: BlogFormData) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      setBlogs([data, ...blogs]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create blog');
    }
  };

  const updateBlog = async (id: string, formData: Partial<BlogFormData>) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBlogs(blogs.map(b => b.id === id ? data : b));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update blog');
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete blog');
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    return updateBlog(id, { published });
  };

  const getBlogById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch blog');
    }
  }, []);

  return {
    blogs,
    loading,
    error,
    refetch: fetchAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    togglePublish,
    getBlogById,
  };
}
