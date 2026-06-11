"use client";

/**
 * components/ThemeProvider.tsx
 *
 * Manages the dark/light theme state for the entire app.
 *
 * ─── HOW THE THEME SYSTEM WORKS ─────────────────────────────────────────────
 *
 * Tailwind's darkMode: "class" means dark mode is toggled by adding or removing
 * the "dark" class on the root <html> element.
 *
 * When "dark" is present on <html>:
 *   • dark:bg-zinc-900 → activates
 *   • dark:text-white  → activates
 *   • All other dark: prefixed classes activate
 *
 * Our strategy (in order of priority):
 *   1. On mount, check localStorage for a saved user preference.
 *   2. If nothing saved, check the OS preference via window.matchMedia.
 *   3. Apply the resolved theme immediately to avoid a flash of wrong theme.
 *   4. When the user clicks the toggle, update state → update <html> class →
 *      save new preference to localStorage.
 *
 * Using a React Context means any component in the tree can call useTheme()
 * to read the current theme or trigger a toggle — no prop drilling needed.
 * ────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // On mount: resolve initial theme from localStorage or system preference.
  // This runs client-side only, avoiding SSR/hydration mismatches.
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;

    if (saved === "dark" || saved === "light") {
      // User has an explicit saved preference — honour it
      applyTheme(saved);
      setTheme(saved);
    } else {
      // No saved preference — use OS setting as the default
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolved: Theme = prefersDark ? "dark" : "light";
      applyTheme(resolved);
      setTheme(resolved);
    }

    setMounted(true);
  }, []);

  /** Adds or removes the "dark" class on <html> */
  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    localStorage.setItem("theme", next);
  }

  // Prevent rendering until the theme is resolved to avoid a flash of
  // incorrect theme (FOIT — flash of incorrect theme)
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook for consuming the theme context in any client component */
export function useTheme() {
  return useContext(ThemeContext);
}
