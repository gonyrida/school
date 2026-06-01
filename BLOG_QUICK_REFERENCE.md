# 🗺️ Blog System Routes & UI Quick Reference

## 📍 Routes Overview

```
PUBLIC ROUTES (No login required)
─────────────────────────────────
/blog
└─ Blog List Page
   ├─ Displays all published posts
   ├─ Search functionality
   └─ 3-column responsive grid

/blog/:slug
└─ Blog Detail Page
   ├─ Full content display
   ├─ SEO meta tags
   ├─ Cover image
   └─ Publication date

ADMIN ROUTES (Login required)
─────────────────────────────
/dashboard/blog
└─ Blog Management List
   ├─ View all posts (draft + published)
   ├─ Status indicator
   ├─ Quick actions (Edit, Delete, Toggle)
   └─ Create new post button

/dashboard/blog/new
└─ Create New Blog Post
   ├─ Title field (auto-generates slug)
   ├─ Slug field (editable)
   ├─ Excerpt field (200 chars max)
   ├─ Cover image upload
   ├─ Rich text editor
   ├─ SEO settings (collapsible)
   └─ Publish toggle

/dashboard/blog/edit/:id
└─ Edit Blog Post
   ├─ Pre-filled form
   ├─ All fields editable
   └─ Change publish status
```

---

## 🎨 Components Hierarchy

```
App
├── PublicLayout
│   ├── BlogListPage
│   │   ├── BlogCard (×n)
│   │   └── Search input
│   └── BlogDetailPage
│       ├── Cover image
│       ├── Article content
│       └── Helmet (SEO)
│
└── DashboardLayout
    └── Dashboard Routes
        ├── AdminBlogListPage
        │   ├── Blog table
        │   └── Action buttons
        ├── AdminBlogCreatePage
        │   ├── Form fields
        │   ├── BlogEditor
        │   ├── BlogImageUpload
        │   └── BlogSEO
        └── AdminBlogEditPage
            └── Same as Create (pre-filled)
```

---

## 🎯 Component Details

### BlogCard.tsx
```
┌─────────────────────────────┐
│   Cover Image (h-48)        │
├─────────────────────────────┤
│ Blog Title                  │
│                             │
│ Short excerpt or first 150  │
│ characters of content...    │
│                             │
│ Date  →  Read →            │
└─────────────────────────────┘
Hover: scale image, shadow increase
```

### BlogEditor.tsx
```
┌──────────────────────────────────────┐
│ B I | H1 H2 | • ≡ » | " 🖼           │ (Toolbar)
├──────────────────────────────────────┤
│                                      │
│ [Rich text content area]             │
│ Min height: 384px                    │
│                                      │
│                                      │
└──────────────────────────────────────┘
Support: Bold, Italic, Headings, Lists, Quotes, Images
```

### BlogImageUpload.tsx
```
Button: "📤 Choose Image"

When uploading:
├─ Validate file type (image/*)
├─ Validate file size (max 5MB)
├─ Upload to Supabase Storage
└─ Return public URL

Success: Toast notification
Error: Toast with error message
```

### BlogSEO.tsx
```
▼ SEO Settings (Collapsible)
├─ Meta Title (60 chars)
├─ Meta Description (160 chars)
├─ Keywords
├─ OG Title
├─ OG Description
└─ 💡 Tip: Good SEO helps search ranking
```

---

## 📊 Database Relations

```
blogs (Main table)
├── id (UUID)
├── slug (UNIQUE - URL path)
├── title
├── excerpt (short description)
├── content (HTML from TipTap)
├── cover_image (URL)
├── cover_alt (accessibility)
├── published (BOOLEAN)
├── seo (JSONB)
│   ├── title
│   ├── description
│   ├── keywords
│   ├── ogTitle
│   ├── ogDescription
│   └── ogImage
├── created_at
└── updated_at

Storage Bucket: blog-images
└── Images uploaded by admins
    └── Public URLs stored in cover_image
```

---

## 🔄 Data Flow

### Creating a Blog Post

```
User Input
    ↓
Form Validation
    ↓
Upload Image (optional)
    ├── → Supabase Storage
    └── ← Get public URL
    ↓
Create Blog Record
    ├── → Supabase Database
    └── ← Get blog ID
    ↓
Success Toast
    ↓
Redirect to /admin/blog
```

### Viewing Blog Post

```
User visits /blog/:slug
    ↓
useBlogBySlug hook
    ↓
Query: SELECT * WHERE slug = ? AND published = true
    ↓
Supabase RLS
    ├── Check: Is published?
    └── Yes → Return data
    ↓
Render BlogDetailPage
    ├── Set Helmet meta tags
    ├── Display cover image
    └── Render content HTML
```

### Publishing Post

```
Admin clicks eye icon
    ↓
togglePublish(id, true/false)
    ↓
Update: published = !published
    ↓
Supabase updates record
    ↓
UI updates immediately
    ↓
Toast: "Post published/unpublished"
```

---

## 🎯 User Flows

### Writer Creating Blog Post

```
1. Navigate to /admin/blog
2. Click "New Post" button
3. Fill in Title
   └─ Slug auto-generates
4. Write excerpt (optional)
5. Upload cover image
6. Write content using editor
7. (Optional) Configure SEO
8. Toggle "Publish this post" ON
9. Click "Create Post"
10. ✅ Redirected to blog list
11. Public can see at /blog/:slug
```

### Admin Publishing Draft

```
1. Go to /admin/blog
2. Find draft post (🚫 icon)
3. Click 👁️ icon to toggle
4. Post is now published
5. Public can see at /blog/:slug
```

### Reader Viewing Blog

```
1. Navigate to /blog
2. See grid of published posts
3. (Optional) Use search
4. Click post to view
5. SEO tags loaded for sharing
6. Can share on social media
```

---

## 🎨 Color & Typography

```
Text Colors:
├── ink-900: Headings (#0f172a)
├── ink-600: Body text (#475569)
├── ink-500: Secondary text (#64748b)
└── ink-400: Tertiary text (#94a3b8)

Brand Colors:
├── brand-600: Links, buttons
└── brand-700: Hover state

Backgrounds:
├── white: Main content
└── gray-50: Page backgrounds
```

---

## 📱 Responsive Breakpoints

```
Mobile (<640px)
├─ Blog cards: 1 column
├─ Editor: Full width
└─ Margins: px-4

Tablet (640-1024px)
├─ Blog cards: 2 columns
├─ Editor: Full width
└─ Margins: px-6

Desktop (>1024px)
├─ Blog cards: 3 columns
├─ Editor: max-w-4xl
└─ Margins: px-8
```

---

## ⚡ Performance Tips

```
For Writers:
├─ Keep excerpts <200 chars
├─ Use descriptive alt text
├─ Optimize images before upload
└─ Use headings for structure

For SEO:
├─ Meta title: 50-60 chars
├─ Meta description: 150-160 chars
├─ Use keywords naturally
└─ Set proper OG tags

For Loading:
├─ Images: compress to <500KB
├─ Content: use semantic HTML
└─ Avoid excessive nested lists
```

---

## 🔍 SEO Checklist Per Post

- [ ] Unique, descriptive title (60 chars)
- [ ] Meta description (160 chars)
- [ ] Keywords field populated
- [ ] Cover image optimized
- [ ] Alt text for cover image
- [ ] OG title set
- [ ] OG description set
- [ ] Headings hierarchy used
- [ ] Links have context
- [ ] Content >500 words (optional)

---

## 📞 Common Actions

| Action | Route | Component |
|--------|-------|-----------|
| View all blogs | `/blog` | BlogListPage |
| View single blog | `/blog/how-to-study` | BlogDetailPage |
| Manage blogs | `/admin/blog` | AdminBlogListPage |
| Create blog | `/admin/blog/new` | AdminBlogCreatePage |
| Edit blog | `/admin/blog/edit/uuid` | AdminBlogEditPage |
| Upload image | (in forms) | BlogImageUpload |
| Edit text | (in forms) | BlogEditor |
| Set SEO | (in forms) | BlogSEO |

---

## 🆘 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Posts not showing | Check `published = true` |
| Images not uploading | Check storage bucket + permissions |
| SEO tags missing | Clear cache, check helmet setup |
| Slug not unique | Use different title |
| Can't edit | Check admin login |
| Search not working | Check excerpt + title fields |
| Layout broken mobile | Check Tailwind responsive classes |

---

**Last Updated:** 2024
**Blog System Version:** 1.0
**Status:** ✅ Production Ready
