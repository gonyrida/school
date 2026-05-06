import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ImageSlot } from "@/components/ui/ImageSlot";

export function GalleryPreview() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <h2 className="section-title text-center mb-10">More than Class</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ImageSlot className="aspect-[3/4] w-full" rounded="rounded-2xl" />
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-ink-500 leading-relaxed max-w-3xl mx-auto mt-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
          Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Ut et massa mi.
        </p>
        <div className="text-center mt-8">
          <Link to="/about/school" className="btn-primary">
            Explore Student Life
          </Link>
        </div>
      </div>
    </section>
  );
}
