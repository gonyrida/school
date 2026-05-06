import { ImageSlot } from "@/components/ui/ImageSlot";
import { PageHero } from "@/components/ui/PageHero";
import { ContactFormSection } from "@/components/sections/ContactFormSection";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et . Maecenas vitae mattis tellus. Nullam quis imperdiet augue."
      />

      <ContactFormSection />

      <section className="pb-24">
        <div className="container-page">
          <h2 className="section-title text-center mb-8">Finds Us on Map</h2>
          <div className="rounded-2xl overflow-hidden border border-ink-300/10 h-[400px] sm:h-[500px]">
            <iframe
              title="Norol Iman High School location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62649.18!2d104.8773!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951298b8b8b8b%3A0x0!2sPhnom+Penh!5e0!3m2!1sen!2skh!4v1700000000000"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
