export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  cover_alt?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  cover_alt?: string;
  published: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}
