import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  ImageIcon,
  UserCog,
  Settings,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';

const NAV_GROUPS: Array<{
  title?: string;
  items: Array<{ to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }>;
}> = [
  {
    items: [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Content',
    items: [
      { to: '/dashboard/pages', label: 'Pages', icon: FileText },
      { to: '/dashboard/events', label: 'News & Events', icon: Calendar },
      { to: '/dashboard/media', label: 'Media Library', icon: ImageIcon },
    ],
  },
  {
    title: 'Settings',
    items: [
      { to: '/dashboard/users', label: 'User Management', icon: UserCog },
      { to: '/dashboard/settings', label: 'Site Settings', icon: Settings },
    ],
  },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-muted flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-brand-900 text-white z-40 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5">
          <SchoolLogo size={48} />
          <div>
            <p className="font-display font-bold text-lg leading-tight">Admin</p>
            <p className="font-display font-bold text-lg leading-tight">Dashboard</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 rounded hover:bg-brand-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-4 py-4 space-y-5 overflow-y-auto h-[calc(100vh-92px)]">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.title && (
                <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-brand-700 text-white shadow-glow'
                          : 'text-white/70 hover:bg-brand-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                      <item.icon className="h-3.5 w-3.5" />
                    </span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-ink-300/10">
          <div className="flex items-center gap-4 px-5 sm:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-muted"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                <input
                  type="text"
                  placeholder="Search here......"
                  className="w-full rounded-full bg-surface-muted border-0 pl-11 pr-4 py-2.5 text-sm placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link to="/" className="hidden sm:inline-flex btn-ghost text-xs">
                ← Back to site
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full checker-bg" />
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-ink-900">Admin User</p>
                  <p className="text-xs text-ink-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
