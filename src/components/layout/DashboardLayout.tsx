/**
 * DashboardLayout.tsx
 * ✅ Fix 2: Sidebar collapses to icon-only rail when user clicks any page link
 *           — or manually via the toggle button. Expands back on hover or click.
 * ✅ Fix 3: Styled to NICS brand guidelines
 *   Primary:  #1f2f7d  Secondary: #2a3fa8  Gold: #e8931d  Text: #2c3e50
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Calendar, ImageIcon,
  UserCog, Settings, Search, Menu, X, LogOut,
  ChevronLeft, User, ChevronRight,
} from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { useAuth } from '@/hooks/useAuth';

const BRAND = {
  navy: '#1f2f7d',
  blue: '#2a3fa8',
  gold: '#e8931d',
  text: '#2c3e50',
  muted: '#7f8c8d',
};

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
      { to: '/dashboard/pages',  label: 'Pages',          icon: FileText  },
      { to: '/dashboard/events', label: 'News & Events',  icon: Calendar  },
      { to: '/dashboard/media',  label: 'Media Library',  icon: ImageIcon },
    ],
  },
  {
    title: 'Settings',
    items: [
      { to: '/dashboard/users',    label: 'User Management', icon: UserCog  },
      { to: '/dashboard/settings', label: 'Site Settings',   icon: Settings },
    ],
  },
];

export function DashboardLayout() {
  /** collapsed = icon-rail mode; mobileOpen = drawer on mobile */
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // When user clicks a nav link → collapse sidebar to icon-rail
  const handleNavClick = () => {
    setCollapsed(true);   // collapse on desktop
    setMobileOpen(false); // close drawer on mobile
  };

  const sidebarWidth = collapsed ? '72px' : '260px';

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f6fa' }}>

      {/* ═══ SIDEBAR ═══════════════════════════════════════════════ */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: `linear-gradient(180deg, ${BRAND.navy} 0%, #162466 100%)`,
          transition: 'width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          flexShrink: 0,
        }}
        className="hidden lg:flex flex-col"
      >
        {/* Logo row */}
        <div
          className="flex items-center gap-3 px-4 py-5 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <SchoolLogo size={40} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="font-bold text-white text-base leading-tight">Admin</p>
              <p className="font-bold text-white/70 text-xs leading-tight">Dashboard</p>
            </div>
          )}
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed(v => !v)}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/15 text-white/60 hover:text-white transition shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft className="h-4 w-4" />
            }
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto overflow-x-hidden">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.title && !collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {group.title}
                </p>
              )}
              {group.title && collapsed && (
                <div className="my-2 mx-3 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              )}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={handleNavClick}   // ← collapse on click
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`
                    }
                    style={({ isActive }) => isActive ? {
                      background: `linear-gradient(90deg, ${BRAND.gold}30, ${BRAND.blue}60)`,
                      boxShadow: `inset 3px 0 0 ${BRAND.gold}`,
                    } : {}}
                  >
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    {!collapsed && (
                      <span className="overflow-hidden whitespace-nowrap">{item.label}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Back to site */}
        <div className="px-2 pb-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <button
            onClick={() => navigate('/')}
            title={collapsed ? 'Back to site' : undefined}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ChevronLeft className="h-4 w-4" />
            </span>
            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Back to Site</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MOBILE DRAWER ════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <aside
            className="w-72 h-full flex flex-col"
            style={{ background: `linear-gradient(180deg, ${BRAND.navy} 0%, #162466 100%)` }}
          >
            <div className="flex items-center gap-3 px-5 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <SchoolLogo size={40} />
              <div>
                <p className="font-bold text-white text-base leading-tight">Admin</p>
                <p className="font-bold text-white/60 text-xs">Dashboard</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="ml-auto p-1.5 rounded-lg hover:bg-white/15 text-white/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
              {NAV_GROUPS.map((group, gi) => (
                <div key={gi}>
                  {group.title && (
                    <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.35)' }}>{group.title}</p>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map(item => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`
                        }
                        style={({ isActive }) => isActive ? {
                          background: `linear-gradient(90deg, ${BRAND.gold}30, ${BRAND.blue}60)`,
                          boxShadow: `inset 3px 0 0 ${BRAND.gold}`,
                        } : {}}
                      >
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <item.icon className="h-4 w-4" />
                        </span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <button onClick={() => navigate('/')}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}><ChevronLeft className="h-4 w-4" /></span>
                Back to Site
              </button>
            </div>
          </aside>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ═══ MAIN AREA ════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white" style={{ borderBottom: '1px solid #e8ecf0', boxShadow: '0 1px 4px rgba(31,47,125,0.06)' }}>
          <div className="flex items-center gap-4 px-5 sm:px-7 py-3.5">
            {/* Mobile menu btn */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-5 w-5" style={{ color: BRAND.navy }} />
            </button>

            {/* Desktop: expand sidebar if collapsed */}
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition"
                title="Expand sidebar"
              >
                <Menu className="h-5 w-5" style={{ color: BRAND.navy }} />
              </button>
            )}

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: BRAND.muted }} />
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-full rounded-xl border pl-10 pr-4 py-2 text-sm outline-none transition"
                  style={{ background: '#f5f6fa', borderColor: '#e8ecf0', color: BRAND.text }}
                  onFocus={e => (e.currentTarget.style.borderColor = BRAND.navy)}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e8ecf0')}
                />
              </div>
            </div>

            {/* Profile */}
            <div className="ml-auto relative">
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
                >
                  {user?.user_metadata?.avatar_url
                    ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    : (user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()
                  }
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-tight" style={{ color: BRAND.text }}>
                    {user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Admin'}
                  </p>
                  <p className="text-xs" style={{ color: BRAND.muted }}>
                    {user?.user_metadata?.role ?? 'Administrator'}
                  </p>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border z-20 overflow-hidden"
                    style={{ borderColor: '#e8ecf0' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <p className="text-sm font-bold truncate" style={{ color: BRAND.text }}>
                        {user?.user_metadata?.full_name ?? 'Admin'}
                      </p>
                      <p className="text-xs truncate" style={{ color: BRAND.muted }}>{user?.email}</p>
                    </div>
                    <NavLink
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                      style={{ color: BRAND.text }}
                    >
                      <User className="h-4 w-4" style={{ color: BRAND.navy }} />
                      Edit Profile
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-red-50"
                      style={{ color: '#dc3545' }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
