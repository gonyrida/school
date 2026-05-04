-- Optional seed content for local/dev.

insert into public.pages (slug, type, title, status, content)
values
  ('about-school', 'about', 'About Our School', 'published', jsonb_build_object('html', '<p>Welcome to our school.</p>')),
  ('about-leader', 'about', 'Meet Our Leader', 'published', jsonb_build_object('html', '<p>Message from the leader.</p>')),
  ('about-dormitory', 'about', 'Dormitory', 'published', jsonb_build_object('html', '<p>Dormitory information.</p>')),
  ('support', 'support', 'Support Our School', 'published', jsonb_build_object('html', '<p>Support campaigns and sponsorships.</p>'))
on conflict (slug) do nothing;

insert into public.news_categories (name, slug)
values ('News', 'news'), ('Events', 'events')
on conflict (slug) do nothing;

