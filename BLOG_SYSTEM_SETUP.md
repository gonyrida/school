# 📚 Blog System Setup & Documentation

Welcome to the Norol Iman High School Blog System! This guide will walk you through setting up and using the complete blog management system.

## 🚀 Quick Start

### 1. Database Setup (Supabase)

First, create the `blogs` table in your Supabase project:

1. Go to your Supabase Dashboard
2. Click **SQL Editor** → **New query**
3. Copy and paste the SQL below:

```sql
-- ── blogs ────────────────────────────────────────────────────
create table if not exists public.blogs (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  title       text        not null default '',
  excerpt     text,
  content     text        not null,
  cover_image text,
  cover_alt   text,
  published   boolean     not null default false,
  seo         jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "Public can read published blogs"
  on public.blogs for select
  using (published = true);

create policy "Admins have full access to blogs"
  on public.blogs for all
  to authenticated
  using (true)
  with check (true);
```

4. Click **Run** and confirm

### 2. Storage Setup (Supabase)

Create a storage bucket for blog images:

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket** → Name it `blog-images`
3. Make it **Public**
4. Click **Create bucket**

Then create the policies. Go to **Storage → Policies (blog-images)** and add:

```sql
-- Policy 1: Public can read blog images
create policy "Public can read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Policy 2: Admins can upload blog images
create policy "Admins can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

-- Policy 3: Admins can delete blog images
create policy "Admins can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');
```

### 3. Environment Variables

Your `.env.local` file should already have your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📖 Features Overview

### Public Blog Pages

#### Blog List Page (`/blog`)
- Display all published blog posts
- Search functionality
- Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each post shows:
  - Cover image
  - Title
  - Short excerpt
  - Publication date

#### Blog Detail Page (`/blog/:slug`)
- Full blog content with rich text formatting
- Cover image
- Publication date and update timestamp
- SEO-optimized meta tags:
  - Dynamic title tag
  - Meta description
  - Open Graph tags (for social media sharing)
  - Canonical URL

### Admin Dashboard

Access the admin section at `/dashboard/blog`

#### Blog List (`/admin/blog`)
**Features:**
- View all blog posts (published + drafts)
- Filter by status (Published/Draft)
- Quick actions:
  - 👁️ Toggle publish/unpublish
  - ✏️ Edit post
  - 🗑️ Delete post
- Create new post button

#### Create Blog Post (`/admin/blog/new`)
**Fields:**
- **Title** (auto-generates slug)
- **Slug** (editable, URL-friendly)
- **Excerpt** (short description, 200 chars max)
- **Cover Image** (upload to Supabase Storage)
- **Rich Text Editor** (powered by TipTap)
  - Formatting: Bold, Italic, Headings, Lists, Quotes
  - Embed images
  - Links
- **SEO Settings** (collapsible)
  - Meta title (60 chars)
  - Meta description (160 chars)
  - Keywords
  - OG title (for social media)
  - OG description (for social media)
- **Publish Toggle** (Draft / Published)

#### Edit Blog Post (`/admin/blog/edit/:id`)
- Same as create form but with pre-filled data
- Update any field
- Publish/unpublish existing posts

## 🎨 Design & UI

The blog system follows Apple's minimal design style:

- ✨ **Clean white-space layout**
- 📱 **Fully responsive** (mobile, tablet, desktop)
- 🎯 **Large readable typography**
- ✨ **Smooth hover animations**
- 🌙 **Consistent with site design** (using existing Tailwind config)

## 🔍 SEO Optimization

Each blog post includes comprehensive SEO settings:

### Meta Tags Generated:
```html
<title>How to Study Effectively | Norol Iman High School Blog</title>
<meta name="description" content="Learn effective study techniques...">
<meta name="keywords" content="study, tips, learning">

<!-- Open Graph (Social Media) -->
<meta property="og:type" content="article">
<meta property="og:title" content="How to Study Effectively | NICS Blog">
<meta property="og:description" content="Learn effective study techniques...">
<meta property="og:image" content="https://...">
<meta property="og:url" content="https://school.com/blog/how-to-study-effectively">

<!-- Article metadata -->
<meta property="article:published_time" content="2024-01-15T10:00:00Z">
<meta property="article:author" content="Norol Iman High School">

<!-- Canonical URL -->
<link rel="canonical" href="https://school.com/blog/how-to-study-effectively">
```

## 📂 Project Structure

```
src/
├── components/blog/
│   ├── BlogCard.tsx              # Blog preview card
│   ├── BlogEditor.tsx            # Rich text editor (TipTap)
│   ├── BlogImageUpload.tsx       # Image upload to Supabase
│   └── BlogSEO.tsx               # SEO settings form
├── hooks/
│   └── useBlogs.ts               # Blog CRUD operations
├── pages/
│   ├── blog/
│   │   ├── BlogListPage.tsx      # /blog - public list
│   │   └── BlogDetailPage.tsx    # /blog/:slug - public detail
│   └── admin/blog/
│       ├── AdminBlogListPage.tsx    # /admin/blog - list all
│       ├── AdminBlogCreatePage.tsx  # /admin/blog/new - create
│       └── AdminBlogEditPage.tsx    # /admin/blog/edit/:id - edit
├── types/
│   └── blog.ts                   # TypeScript interfaces
└── lib/
    ├── utils.ts                  # Utility functions
    └── supabase.ts               # Supabase client

database:
├── supabase_schema.sql           # Updated with blogs table
```

## 🛠️ API Reference

### useBlogs Hook

#### Public Blog Fetching:
```typescript
// Get all published blogs
const { blogs, loading, error } = useBlogs();

// Get single blog by slug
const { blog, loading, error } = useBlogBySlug(slug);
```

#### Admin Blog Operations:
```typescript
const {
  blogs,              // Array of all blogs
  loading,            // Loading state
  error,              // Error object
  refetch,            // Refresh blog list
  createBlog,         // Create new blog
  updateBlog,         // Update existing blog
  deleteBlog,         // Delete blog
  togglePublish,      // Toggle published status
  getBlogById,        // Fetch single blog by ID
} = useBlogAdmin();
```

### Database Schema

```typescript
interface Blog {
  id: string;                    // UUID
  slug: string;                  // URL-friendly slug (unique)
  title: string;                 // Blog title
  excerpt?: string;              // Short description (≤200 chars)
  content: string;               // Rich HTML content
  cover_image?: string;          // Supabase Storage URL
  cover_alt?: string;            // Alt text for image
  published: boolean;            // Draft/Published status
  created_at: string;            // Creation timestamp
  updated_at: string;            // Last update timestamp
  seo?: {                         // SEO fields
    title?: string;              // Meta title (60 chars)
    description?: string;        // Meta description (160 chars)
    keywords?: string;           // Keywords
    ogTitle?: string;            // OG title for social
    ogDescription?: string;      // OG description for social
    ogImage?: string;            // OG image for social
  };
}
```

## 🔐 Security & Permissions

### Row Level Security (RLS)

- **Public:** Can only see published blogs (published = true)
- **Authenticated Admins:** Full access to all blogs
- **Storage:** Public can read images, only admins can upload/delete

## 💡 Usage Examples

### Adding a Blog Post

1. Login to admin dashboard
2. Navigate to **Blog** → **New Post**
3. Fill in the form:
   - Title: "How to Study Effectively"
   - Slug will auto-generate: "how-to-study-effectively"
   - Add excerpt and cover image
   - Write content using rich text editor
   - Set SEO fields for better search visibility
4. Toggle **Publish** on
5. Click **Create Post**

### Viewing Blog Posts

**Public Site:**
- List: https://school.com/blog
- Detail: https://school.com/blog/how-to-study-effectively

**Search:** The blog list page includes a search function to find posts by title or excerpt.

### Updating a Blog Post

1. Go to **Admin → Blog**
2. Click the ✏️ **Edit** button on any post
3. Update fields as needed
4. Click **Save Changes**

### Publishing a Draft

Two ways:
1. Create post with **Publish** toggle ON
2. Or go to blog list, click 👁️ to toggle status

## 📱 Responsive Design

The blog system is fully responsive:

- **Desktop:** 3-column grid for blog cards
- **Tablet:** 2-column grid
- **Mobile:** 1-column layout

## ⚡ Performance Tips

- Images should be optimized (JPG/PNG, <500KB recommended)
- Use descriptive alt text for accessibility
- Keep excerpts concise (150-200 chars)
- Use SEO fields properly for better search ranking

## 🐛 Troubleshooting

### Images not uploading
- Check storage bucket exists and is public
- Verify Supabase credentials in .env
- Check file size (max 5MB)

### Blog posts not appearing
- Verify post is marked as **Published**
- Check Supabase connection
- Try refreshing the page

### SEO tags not showing
- Clear browser cache
- Verify meta tags are filled in SEO settings
- Check page source (Ctrl+U) for meta tags

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com
- **TipTap Editor:** https://tiptap.dev
- **Tailwind CSS:** https://tailwindcss.com

---

**Happy blogging! 🎉**
