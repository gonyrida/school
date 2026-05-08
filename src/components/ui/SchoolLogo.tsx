interface SchoolLogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * SchoolLogo — renders the school crest from /public/nics-logo.png.
 *
 * To swap the image, replace `public/nics-logo.png` (Vite serves anything
 * in `public/` at the site root). No code changes needed.
 */
export function SchoolLogo({
  size = 40,
  className = '',
  alt = 'Norol Iman Chroy Metrey School',
}: SchoolLogoProps) {
  return (
    <img
      src="/nics-logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}