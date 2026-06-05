import { motion } from "framer-motion";
import { Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import type { Leader } from "@/types/leader";

interface LeaderCardProps {
  leader: Leader;
  isMainLeader?: boolean;
  index: number;
}

function LeaderCard({ leader, isMainLeader = false, index }: LeaderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: isMainLeader ? 32 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className={`relative flex flex-col ${isMainLeader ? "-mt-6 sm:-mt-10" : ""}`}
    >
      <div
        className={`group flex flex-col items-center text-center rounded-3xl p-6 transition-all duration-300 ${
          isMainLeader
            ? "bg-brand-700 text-white shadow-glow scale-[1.04] z-10"
            : "bg-white border border-ink-300/10 shadow-soft hover:shadow-glow hover:-translate-y-1"
        }`}
      >
        {/* Image */}
        <div
          className={`relative mb-5 ${isMainLeader ? "w-28 h-28 sm:w-32 sm:h-32" : "w-20 h-20 sm:w-24 sm:h-24"}`}
        >
          {leader.image_url ? (
            <img
              src={leader.image_url}
              alt={leader.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-2xl font-bold ${
                isMainLeader
                  ? "bg-white/20 text-white"
                  : "bg-brand-50 text-brand-700"
              }`}
            >
              {leader.full_name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
          {isMainLeader && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent-gold flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Name & Position */}
        <h3
          className={`font-display font-bold mb-1 leading-tight ${
            isMainLeader ? "text-xl text-white" : "text-base text-ink-900"
          }`}
        >
          {leader.full_name}
        </h3>
        <p
          className={`text-sm font-medium mb-3 ${
            isMainLeader ? "text-white/75" : "text-brand-700"
          }`}
        >
          {leader.position}
        </p>
        <p
          className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
            isMainLeader ? "text-white/70" : "text-ink-500"
          }`}
        >
          {leader.bio}
        </p>

        {/* Contact */}
        {(leader.email || leader.phone) && (
          <div className={`flex flex-wrap gap-2 justify-center mb-3 ${isMainLeader ? "" : ""}`}>
            {leader.email && (
              <a
                href={`mailto:${leader.email}`}
                className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-colors ${
                  isMainLeader
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-surface-muted text-ink-500 hover:bg-brand-50 hover:text-brand-700"
                }`}
                aria-label={`Email ${leader.full_name}`}
              >
                <Mail className="h-3 w-3" />
                Email
              </a>
            )}
            {leader.phone && (
              <a
                href={`tel:${leader.phone}`}
                className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-colors ${
                  isMainLeader
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-surface-muted text-ink-500 hover:bg-brand-50 hover:text-brand-700"
                }`}
                aria-label={`Call ${leader.full_name}`}
              >
                <Phone className="h-3 w-3" />
                Call
              </a>
            )}
          </div>
        )}

        {/* Social links */}
        {(leader.social_facebook || leader.social_instagram || leader.social_linkedin) && (
          <div className="flex gap-2 justify-center">
            {leader.social_facebook && (
              <a
                href={leader.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isMainLeader
                    ? "bg-white/15 text-white hover:bg-white/30"
                    : "bg-surface-muted text-ink-400 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            )}
            {leader.social_instagram && (
              <a
                href={leader.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isMainLeader
                    ? "bg-white/15 text-white hover:bg-white/30"
                    : "bg-surface-muted text-ink-400 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            )}
            {leader.social_linkedin && (
              <a
                href={leader.social_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isMainLeader
                    ? "bg-white/15 text-white hover:bg-white/30"
                    : "bg-surface-muted text-ink-400 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface Props {
  leaders: Leader[];
  hideHeader?: boolean;
}

export function LeadershipSection({ leaders, hideHeader = false }: Props) {
  if (!leaders.length) return null;

  // First row: first 3 leaders, center is the main (index 1 if >=3, else index 0)
  const firstRowCount = Math.min(3, leaders.length);
  const firstRow = leaders.slice(0, firstRowCount);
  const remainingLeaders = leaders.slice(firstRowCount);

  // Chunk remaining into rows of 3
  const additionalRows: Leader[][] = [];
  for (let i = 0; i < remainingLeaders.length; i += 3) {
    additionalRows.push(remainingLeaders.slice(i, i + 3));
  }

  // Main leader is center of first row
  const mainLeaderIndex = firstRow.length >= 3 ? 1 : 0;

  return (
    <section className="py-16 sm:py-24 bg-surface-muted">
      <div className="container-page">
        {/* Section header */}
        {!hideHeader && (
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Our People</p>
            <h2 className="section-title mb-4">Leadership Team</h2>
            <p className="text-sm text-ink-500 max-w-xl mx-auto leading-relaxed">
              Our dedicated leaders bring together decades of experience in education,
              administration, and community service to guide our school forward.
            </p>
          </div>
        )}

        {/* First Row — elevated center */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto items-end mb-8">
          {firstRow.map((leader, i) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              isMainLeader={i === mainLeaderIndex}
              index={i}
            />
          ))}
        </div>

        {/* Additional rows — standard equal grid */}
        {additionalRows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6"
          >
            {row.map((leader, i) => (
              <LeaderCard
                key={leader.id}
                leader={leader}
                isMainLeader={false}
                index={firstRowCount + rowIdx * 3 + i}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
