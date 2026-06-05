import { Image } from "lucide-react";

type Props = {
  className?: string;
  rounded?: string;
  showIcon?: boolean;
  src?: string;
  alt?: string;
};

/**
 * Drop-in replacement for the empty image slots in the mockups.
 * Pass `src` later (from Supabase Storage) and it renders the real image.
 */
export function ImageSlot({
  className = "",
  rounded = "rounded-2xl",
  showIcon = false,
  src,
  alt = "",
}: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${rounded} object-cover`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`${className} ${rounded} checker-bg flex items-center justify-center`}
      role="img"
      aria-label={alt || "Image placeholder"}
    >
      {showIcon && (
        <Image className="h-8 w-8 text-ink-300" strokeWidth={1.25} />
      )}
    </div>
  );
}
