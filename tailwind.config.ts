import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // ─── Theme System ───────────────────────────────────────────────────────────
  // Using "class" strategy means dark mode is controlled by the presence of the
  // "dark" class on the <html> element — not the OS preference alone.
  //
  // This gives us full programmatic control:
  //   • We read system preference on first load as the default
  //   • The user can override it via the toggle button
  //   • We persist their choice to localStorage so it survives page refreshes
  //
  // When the "dark" class is present on <html>, any Tailwind class prefixed with
  // "dark:" automatically activates (e.g. dark:bg-zinc-900, dark:text-white).
  // ────────────────────────────────────────────────────────────────────────────
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        // Brand palette — violet/indigo accent on neutral surfaces
        brand: {
          50: "#f0f0ff",
          100: "#e0e0ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.3" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;