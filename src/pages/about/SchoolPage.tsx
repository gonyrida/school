import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";

export default function SchoolPage() {
  return (
    <>
      <PageHero
        title="Title Of The School"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus."
        align="left"
      />

      {/* TITLE intro with image */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ImageSlot className="aspect-square w-full" />
          </motion.div>
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900 mb-4">TITLE</h2>
            <p className="text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.
              Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at
              sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat.
            </p>
          </div>
        </div>
      </section>

      {/* Dormitory cards */}
      <section className="py-12">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">Title Of The School</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ImageSlot className="aspect-[4/3] w-full mb-5" />
                <h3 className="font-display font-bold text-lg text-ink-900 mb-2">Title</h3>
                <p className="text-sm text-ink-500">
                  Lorem ipsum dolor sit amet, dolor sit amet, dolor sit amet, consectetur adipiscing elit.
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/about/dormitory" className="btn-primary">Explore Our Dormitory</Link>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 sm:py-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900 mb-4">History Of School</h2>
            <p className="text-ink-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.
              Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at
              sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat.
            </p>
          </div>
          <ImageSlot className="aspect-[4/3] w-full" />
        </div>
      </section>

      {/* Vision/Mission/Values */}
      <section className="bg-surface-muted py-16 sm:py-24">
        <div className="container-page">
          <h2 className="section-title text-center mb-12">Vision, Mission, and Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Vision", "Mission", "Values"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-full checker-bg mb-4" />
                <h3 className="font-display font-bold text-lg text-ink-900 mb-2">{t}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
                  Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More than Class gallery */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <h2 className="section-title text-center mb-10">More than Class</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ImageSlot key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
          <p className="text-center text-sm text-ink-500 leading-relaxed max-w-3xl mx-auto mt-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
            Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
          </p>
          <div className="text-center mt-8">
            <Link to="#" className="btn-primary">Explore Student Life</Link>
          </div>
        </div>
      </section>
    </>
  );
}
