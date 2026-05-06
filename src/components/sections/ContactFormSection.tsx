import { motion } from "framer-motion";
import { Asterisk, Mail, Send } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SCHOOL_INFO } from "@/data/content";

type Props = { showMap?: boolean };

export function ContactFormSection({ showMap = true }: Props) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-700 mb-2">
              Let's keep in touch
            </h2>
            <p className="text-sm text-ink-500 leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Your Full Name</label>
              <input type="text" className="input-field" placeholder="Rida Gony" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Your Email</label>
              <input type="email" className="input-field" placeholder="example@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Your Message</label>
              <textarea
                rows={4}
                className="input-field resize-none"
                placeholder="Type something that you want....."
              />
            </div>
            <button type="submit" className="btn-primary w-full !py-3.5">
              Send Message <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
            <div className="flex items-start gap-3">
              <Asterisk className="h-4 w-4 text-ink-700 mt-1" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Link Tree</p>
                <p className="text-xs text-ink-500">{SCHOOL_INFO.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-ink-700 mt-1" />
              <div>
                <p className="text-sm font-semibold text-ink-900">E-Mail</p>
                <a href={`mailto:${SCHOOL_INFO.email}`} className="text-xs text-ink-500 hover:text-brand-700">
                  {SCHOOL_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full checker-bg" />
            ))}
          </div>
        </motion.div>

        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ImageSlot className="w-full h-full min-h-[500px]" rounded="rounded-2xl" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
