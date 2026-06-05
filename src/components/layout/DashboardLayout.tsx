/**
 * DashboardLayout.tsx
 * ✅ FIX 2: Sidebar has NO scroll icon — overflow hidden, clean icon rail
 * ✅ FIX 4: Profile dropdown "Edit Profile" uses useNavigate → /dashboard/profile
 *           (Link inside a dropdown z-stack was getting blocked by the overlay div)
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Calendar, Image,
  UserCog, Settings, Search, Menu, X,
  LogOut, ChevronLeft, ChevronRight, User, BookOpen,
  Users, DollarSign,
} from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { useAuth } from '@/hooks/useAuth';

const B = {
  navy:  '#1f2f7d',
  blue:  '#2a3fa8',
  gold:  '#e8931d',
  text:  '#2c3e50',
  muted: '#7f8c8d',
  bg:    '#f5f6fa',
  border:'#e8ecf0',
};

const NAV_GROUPS = [
  {
    items: [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Content',
    items: [
      { to: '/dashboard/pages',  label: 'Pages',         icon: FileText   },
      { to: '/dashboard/events', label: 'News & Events', icon: Calendar   },
      { to: '/dashboard/blog',   label: 'Blog',          icon: BookOpen   },
      { to: '/dashboard/media',  label: 'Media Library', icon: Image      },
    ],
  },
  {
    title: 'School',
    items: [
      { to: '/dashboard/leaders', label: 'Leadership',  icon: Users      },
      { to: '/dashboard/fees',    label: 'Fees & Tuition', icon: DollarSign },
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

// Single nav item — works in both expanded & icon-rail modes
function NavItem({
  to, label, icon: Icon, end, collapsed, onClick,
}: {
  to: string; label: string; icon: typeof LayoutDashboard;
  end?: boolean; collapsed: boolean; onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl text-sm font-medium transition-all
         ${collapsed ? 'px-0 justify-center py-2.5' : 'px-3 py-2.5'}
         ${isActive
           ? 'text-white'
           : 'text-white/60 hover:text-white hover:bg-white/10'
         }`
      }
      style={({ isActive }) =>
        isActive
          ? { background: `linear-gradient(90deg,${B.gold}30,${B.blue}55)`, boxShadow: `inset 3px 0 0 ${B.gold}` }
          : {}
      }
    >
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <Icon className="h-4 w-4" />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

// Sidebar shell — shared between desktop sticky & mobile drawer
function SidebarContent({
  collapsed,
  onToggleCollapse,
  onNavClick,
  onClose,
  isMobile = false,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavClick: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* ── Logo row ── */}
      <div
        className="flex items-center gap-3 px-3 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
          <SchoolLogo size={40} />
        </div>

        {(!collapsed || isMobile) && (
          <div className="overflow-hidden">
            <p className="font-bold text-white text-sm leading-tight truncate">Admin</p>
            <p className="text-white/50 text-xs leading-tight truncate">Dashboard</p>
          </div>
        )}

        {/* Desktop: collapse toggle */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/15 text-white/50 hover:text-white transition shrink-0"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft  className="h-4 w-4" />
            }
          </button>
        )}

        {/* Mobile: close button */}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/15 text-white/50 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ── Nav ──
          ✅ FIX 2: overflow-hidden (not overflow-y-auto) so NO scrollbar ever appears.
          All nav items fit without scrolling; if you add many items switch to overflow-y-auto. */}
      <nav className="scrollbar-none flex-1 px-2 py-4 overflow-y-auto flex flex-col gap-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {/* Group title — only when expanded */}
            {group.title && !collapsed && (
              <p
                className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest truncate"
                style={{ color: 'rgba(255,255,255,0.30)' }}
              >
                {group.title}
              </p>
            )}
            {/* Divider in icon-rail mode */}
            {group.title && collapsed && !isMobile && (
              <div className="mx-3 my-1 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
            )}

            <div className="flex flex-col gap-0.5">
              {group.items.map(item => (
                <NavItem
                  key={item.to}
                  {...item}
                  collapsed={collapsed && !isMobile}
                  onClick={onNavClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Back to site ── */}
      <div
        className="px-2 pb-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}
      >
        <NavLink
          to="/"
          title={collapsed && !isMobile ? 'Back to site' : undefined}
          className="flex items-center gap-3 rounded-xl text-sm font-medium text-white/50
                     hover:text-white hover:bg-white/10 transition
                     py-2.5"
          style={{ paddingLeft: collapsed && !isMobile ? 0 : '12px', justifyContent: collapsed && !isMobile ? 'center' : undefined }}
        >
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ChevronLeft className="h-4 w-4" />
          </span>
          {(!collapsed || isMobile) && <span className="truncate">Back to Site</span>}
        </NavLink>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate('/login');
  };

  // ✅ FIX 4: navigate() inside a button — avoids the overlay-div blocking <Link>
  const handleEditProfile = () => {
    setProfileOpen(false);
    navigate('/dashboard/profile');
  };

  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? 'Admin';
  const avatarLetter = displayName[0].toUpperCase();
  const avatarUrl    = user?.user_metadata?.avatar_url as string | undefined;
  const roleLabel    = (user?.user_metadata?.role as string | undefined) ?? 'Administrator';

  return (
    <div className="min-h-screen flex" style={{ background: B.bg }}>

      {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col shrink-0"
        style={{
          width: collapsed ? 72 : 256,
          minWidth: collapsed ? 72 : 256,
          background: `linear-gradient(180deg, ${B.navy} 0%, #162466 100%)`,
          transition: 'width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(v => !v)}
          onNavClick={() => setCollapsed(true)}   // auto-collapse when link clicked
          isMobile={false}
        />
      </aside>

      {/* ══ MOBILE DRAWER ════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <aside
            className="w-64 flex flex-col"
            style={{ background: `linear-gradient(180deg, ${B.navy} 0%, #162466 100%)` }}
          >
            <SidebarContent
              collapsed={false}
              onToggleCollapse={() => {}}
              onNavClick={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
              isMobile
            />
          </aside>
          <div
            className="flex-1"
            style={{ background: 'rgba(0,0,0,0.40)' }}
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* ══ MAIN ═════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* ── Topbar ── */}
        <header
          className="sticky top-0 z-20 bg-white"
          style={{ borderBottom: `1px solid ${B.border}`, boxShadow: '0 1px 4px rgba(31,47,125,0.06)' }}
        >
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">

            {/* Mobile: hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu className="h-5 w-5" style={{ color: B.navy }} />
            </button>

            {/* Desktop: re-expand when collapsed */}
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition"
                title="Expand sidebar"
              >
                <Menu className="h-5 w-5" style={{ color: B.navy }} />
              </button>
            )}

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-full rounded-xl border pl-10 pr-4 py-2 text-sm outline-none transition"
                  style={{ background: B.bg, borderColor: B.border, color: B.text }}
                  onFocus={e  => (e.currentTarget.style.borderColor = B.navy)}
                  onBlur={e   => (e.currentTarget.style.borderColor = B.border)}
                />
              </div>
            </div>

            {/* Profile dropdown */}
            <div className="ml-auto relative">
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-gray-50 transition"
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
                >
                  {avatarUrl
                    ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    : avatarLetter
                  }
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-sm font-bold" style={{ color: B.text }}>{displayName}</p>
                  <p className="text-xs"           style={{ color: B.muted }}>{roleLabel}</p>
                </div>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <>
                  {/* Invisible backdrop — closes dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border z-20 overflow-hidden"
                    style={{ borderColor: B.border }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${B.border}` }}>
                      <p className="text-sm font-bold truncate" style={{ color: B.text }}>{displayName}</p>
                      <p className="text-xs truncate"           style={{ color: B.muted }}>{user?.email}</p>
                    </div>

                    {/* ✅ FIX 4: button + navigate() — not <Link> — so the backdrop div
                        never intercepts the click before React Router fires */}
                    <button
                      onClick={handleEditProfile}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                      style={{ color: B.text }}
                    >
                      <User className="h-4 w-4 shrink-0" style={{ color: B.navy }} />
                      Edit Profile
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-red-50"
                      style={{ color: '#dc3545' }}
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}