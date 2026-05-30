// Mirrors the Supabase schema — swap these for queries when the backend lands.

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about/school",
    children: [
      { label: "School", href: "/about/school" },
      { label: "Leader", href: "/about/leader" },
      { label: "Dormitory", href: "/about/dormitory" },
    ],
  },
  {
    label: "Curriculum",
    href: "/curriculum",
    children: [
      { label: "Overview", href: "/curriculum" },
      { label: "Kindergarten", href: "/curriculum/kindergarten" },
      { label: "Elementary", href: "/curriculum/elementary" },
    ],
  },
  { label: "Admissions", href: "/admissions" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export const HOMEPAGE = {
  hero: {
    title: "Home Page",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.",
    primaryCta: { label: "Visit Campus", href: "/admissions" },
    secondaryCta: { label: "Explore Curriculum", href: "/curriculum" },
  },
  intro: {
    eyebrow: "Welcome",
    title: "TITLE",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo.",
  },
  pathways: [
    {
      title: "Early Years",
      ageRange: "Age: 1-3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus.",
      href: "/curriculum/kindergarten",
    },
    {
      title: "Kindergarten",
      ageRange: "Age: 3-5",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus.",
      href: "/curriculum/kindergarten",
    },
    {
      title: "Elementary",
      ageRange: "Age: 6-12",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et. Maecenas vitae mattis tellus.",
      href: "/curriculum/elementary",
    },
  ],
  values: [
    {
      title: "Vision",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.",
    },
    {
      title: "Mission",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.",
    },
    {
      title: "Values",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.",
    },
  ],
  features: [
    {
      title: "Innovative Learning",
      description:
        "Lorem ipsum dolor sit amet, dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Expert Teachers",
      description:
        "Lorem ipsum dolor sit amet, dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Modern Facilities",
      description:
        "Lorem ipsum dolor sit amet, dolor sit amet, consectetur adipiscing elit.",
    },
  ],
  admissionSteps: [
    {
      title: "Inquiry",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    },
    {
      title: "Visit",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    },
    {
      title: "Application",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    },
    {
      title: "Assessment",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    },
    {
      title: "Interview",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    },
    {
      title: "Enrollment",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    },
  ],
  testimonials: [
    {
      name: "Mr. Sok Dara",
      position: "Parent",
      quote:
        "Lorem is finally addressing a long time problem we had when building Uls. It's ease of use and workflow seemsipsum dolor sit amet, consectetur adipiscing elit.",
      date: "March 2025",
    },
    {
      name: "Ms. Lina Chea",
      position: "Parent",
      quote:
        "Lorem is finally addressing a long time problem we had when building Uls. It's ease of use and workflow seemsipsum dolor sit amet, consectetur adipiscing elit.",
      date: "April 2025",
    },
    {
      name: "Mr. Vibol Pich",
      position: "Alumni",
      quote:
        "Lorem is finally addressing a long time problem we had when building Uls. It's ease of use and workflow seemsipsum dolor sit amet, consectetur adipiscing elit.",
      date: "May 2025",
    },
  ],
};

export const EVENTS = [
  {
    id: "1",
    slug: "annual-science-fair",
    title: "Annual Science Fair 2025",
    category: "Academy",
    date: "2025-10-12",
    location: "Main Auditorium",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    isNews: true,
  },
  {
    id: "2",
    slug: "sports-day",
    title: "Inter-house Sports Day",
    category: "Sports",
    date: "2025-11-04",
    location: "School Stadium",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "3",
    slug: "art-exhibition",
    title: "Annual Art Exhibition",
    category: "Arts",
    date: "2025-11-22",
    location: "Gallery Hall",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "4",
    slug: "community-day",
    title: "Community Service Day",
    category: "Community",
    date: "2025-12-08",
    location: "Phnom Penh",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "5",
    slug: "math-olympiad",
    title: "Math Olympiad Finals",
    category: "Academy",
    date: "2026-01-15",
    location: "Hall A",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export const STUDENT_LIFE = [
  {
    title: "Daily Routines",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Sports & Wellness",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Art & Music",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Community Outreach",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export const FAQS = [
  {
    q: "What documents are required for admission?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.",
  },
  {
    q: "What is the application timeline?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
  },
  {
    q: "Do you offer scholarships?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
  },
  {
    q: "What languages are taught?",
    a: "Khmer, Arabic, and English are taught across the curriculum.",
  },
  {
    q: "How can I schedule a campus visit?",
    a: "You can request a tour from the contact page or call our admissions office.",
  },
];

export const LEADERS = {
  principal: {
    name: "Dr. Ahmad Al-Hassan",
    role: "Principal",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.",
  },
  team: [
    {
      name: "Sarah Ibrahim",
      role: "Vice Principal",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      name: "Mohammed Yusuf",
      role: "Head of Academics",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      name: "Fatima Noor",
      role: "Head of Wellness",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
  staff: Array.from({ length: 12 }, (_, i) => ({
    name: `Staff Member ${i + 1}`,
    role: "Teacher",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et",
  })),
};

export const CURRICULUM_SUBJECTS = {
  khmer: [
    "Khmer Language",
    "Khmer Literature",
    "Khmer History",
    "Khmer Culture",
    "Civics & Society",
    "Geography",
  ],
  arabic: [
    "Arabic Language",
    "Quran Studies",
    "Hadith",
    "Islamic History",
    "Fiqh",
    "Arabic Literature",
  ],
};

export const SCHOOL_INFO = {
  name: "Norol Iman High School",
  tagline: "Excellence in Education",
  email: "info@noroliman.com",
  phones: ["096 651 6718", "097 777 0033"],
  address:
    "Chrouy Metrey Village, Russey Chroy Commune, Muk Kampoul District, Kandal Province, Cambodia",
  socials: {
    facebook: "#",
    instagram: "#",
    telegram: "#",
    youtube: "#",
    twitter: "#",
  },
};
