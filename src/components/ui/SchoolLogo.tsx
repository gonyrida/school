type Props = { className?: string; size?: number };

export function SchoolLogo({ className = "", size = 40 }: Props) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7a1f2a" />
            <stop offset="100%" stopColor="#4a131a" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="white" stroke="url(#logoGrad)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#logoGrad)" strokeWidth="0.8" />
        {/* Star left */}
        <path d="M14 50 l3 0 1 -3 1 3 3 0 -2.5 2 1 3 -2.5 -2 -2.5 2 1 -3 z" fill="#f59e0b" />
        {/* Star right */}
        <path d="M78 50 l3 0 1 -3 1 3 3 0 -2.5 2 1 3 -2.5 -2 -2.5 2 1 -3 z" fill="#f59e0b" />
        {/* Open book */}
        <g transform="translate(50 52)">
          <path d="M-16 0 Q -8 -6 0 -4 Q 8 -6 16 0 L 16 8 Q 8 6 0 8 Q -8 6 -16 8 Z" fill="#1f2f7d" />
          <path d="M0 -4 L 0 8" stroke="white" strokeWidth="0.6" />
        </g>
        <text
          x="50"
          y="78"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="6"
          fontWeight="700"
          fill="#7a1f2a"
        >
          NOROL IMAN
        </text>
      </svg>
    </div>
  );
}
