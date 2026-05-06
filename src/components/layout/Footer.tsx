import { Link } from "react-router-dom";
import { Facebook, Instagram, Send, Youtube, Twitter, Mail, Phone, ChevronRight } from "lucide-react";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { SCHOOL_INFO } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-ink-300/10 bg-white">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand */}
        <div className="md:col-span-3 space-y-4">
          <SchoolLogo size={88} />
          <p className="text-sm font-semibold text-ink-900">{SCHOOL_INFO.name}</p>
          <div className="flex items-center gap-3 text-ink-500">
            <a href={SCHOOL_INFO.socials.facebook} aria-label="Facebook" className="hover:text-brand-700 transition">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={SCHOOL_INFO.socials.instagram} aria-label="Instagram" className="hover:text-brand-700 transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SCHOOL_INFO.socials.telegram} aria-label="Telegram" className="hover:text-brand-700 transition">
              <Send className="h-4 w-4" />
            </a>
            <a href={SCHOOL_INFO.socials.youtube} aria-label="YouTube" className="hover:text-brand-700 transition">
              <Youtube className="h-4 w-4" />
            </a>
            <a href={SCHOOL_INFO.socials.twitter} aria-label="Twitter" className="hover:text-brand-700 transition">
              <Twitter className="h-4 w-4" />
            </a>
            <a href={`mailto:${SCHOOL_INFO.email}`} aria-label="Email" className="hover:text-brand-700 transition">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold text-brand-700 mb-4">Quick Link</h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about/school" },
              { label: "Curriculum", href: "/curriculum" },
              { label: "Admissions", href: "/admissions" },
              { label: "Events", href: "/events" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="inline-flex items-center justify-between gap-2 text-ink-700 hover:text-brand-700 transition w-full"
                >
                  <span>{l.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Address */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-sm font-semibold text-brand-700">ADDRESS</h4>
          <div className="rounded-xl overflow-hidden border border-ink-300/10 h-32">
            <iframe
              title="School location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250470.67!2d104.7773!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951298b8b8b8b%3A0x0!2sPhnom+Penh!5e0!3m2!1sen!2skh!4v1700000000000"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%]"
            />
          </div>
          <div>
            <h5 className="text-sm font-semibold text-brand-700 mb-2">Contact</h5>
            <ul className="space-y-2 text-sm text-ink-700">
              {SCHOOL_INFO.phones.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-ink-500" />
                  <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-sm font-semibold text-brand-700">Stay Connected</h4>
          <p className="text-sm text-ink-500">
            Subscribe to our newsletter for the latest updates and announcements.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-3"
          >
            <input
              type="email"
              placeholder="Enter Your Email...."
              className="w-full rounded-lg border border-ink-300/30 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
              required
            />
            <button type="submit" className="btn-primary w-full !py-2.5">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-ink-300/10">
        <div className="container-page py-5 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
