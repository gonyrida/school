/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef0fb",
          100: "#d8def4",
          200: "#b1bce9",
          300: "#8a9ade",
          400: "#6377d3",
          500: "#3c54c7",
          600: "#2a3fa6",
          700: "#1f2f7d",
          800: "#162256",
          900: "#0d1538",
          DEFAULT: "#1f2f7d",
        },
        accent: {
          green: "#22c55e",
          gold: "#f59e0b",
        },
        ink: {
          900: "#0a0a0a",
          700: "#1f1f1f",
          500: "#525252",
          300: "#a3a3a3",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f5f5f7",
          soft: "#eef0fb",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        khmer: ["'Noto Sans Khmer'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
        glow: "0 10px 40px -10px rgba(31, 47, 125, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "checker":
          "linear-gradient(45deg, #ececec 25%, transparent 25%), linear-gradient(-45deg, #ececec 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ececec 75%), linear-gradient(-45deg, transparent 75%, #ececec 75%)",
      },
      backgroundSize: {
        "checker-lg": "40px 40px",
      },
      backgroundPosition: {
        "checker-lg": "0 0, 0 20px, 20px -20px, -20px 0px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
