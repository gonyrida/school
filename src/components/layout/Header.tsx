import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Search, Menu, X } from "lucide-react";
import { NAV, SCHOOL_INFO } from "@/data/content";
import { SchoolLogo } from "@/components/ui/SchoolLogo";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ink-300/10">
      <div className="container-page">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <SchoolLogo size={42} />
            <span className="hidden sm:block font-display font-semibold text-ink-900 tracking-tight">
              {SCHOOL_INFO.name}
            </span>
          </Link>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
              <input
                type="text"
                placeholder="Search here......"
                className="w-full rounded-full bg-surface-muted border-0 pl-11 pr-4 py-2.5 text-sm placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-700/30"
              />
            </div>
          </div>

          {/* Right utilities */}
          <div className="flex items-center gap-3 shrink-0">
            <select
              className="hidden md:block bg-white border border-ink-300/30 rounded-lg text-sm py-2 px-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-700/30"
              defaultValue="en"
              aria-label="Select language"
            >
              <option value="en">Language</option>
              <option value="km">ខ្មែរ</option>
              <option value="ar">العربية</option>
            </select>
            <Link to="/support" className="hidden sm:inline-flex btn-primary !py-2.5 !px-5">
              Sponsor / Donate
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-muted"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center justify-center gap-1 pb-3">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <NavLink
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isActive || location.pathname.startsWith(item.href.split("/").slice(0, 2).join("/")) && item.href !== "/"
                      ? "text-brand-700"
                      : "text-ink-700 hover:text-brand-700"
                  }`
                }
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5" />}
              </NavLink>
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 min-w-[200px]">
                  <div className="bg-white rounded-xl shadow-soft border border-ink-300/10 py-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        className="block px-4 py-2 text-sm text-ink-700 hover:bg-surface-muted hover:text-brand-700"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-300/10 bg-white">
          <div className="container-page py-4 space-y-1">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-surface-muted"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-1.5 rounded-lg text-sm text-ink-500 hover:bg-surface-muted"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/support" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-3">
              Sponsor / Donate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
