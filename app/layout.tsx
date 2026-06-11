import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "InternBot — Internee.pk AI Assistant",
  description:
    "AI-powered chatbot to help Internee.pk interns find answers about tasks, policies, and program guidelines.",
  keywords: ["internee.pk", "internship", "AI chatbot", "RAG", "Next.js"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * We don't set a default "dark" class here — ThemeProvider handles that
     * on the client after reading localStorage / system preference.
     *
     * suppressHydrationWarning is required because the ThemeProvider adds
     * "dark" to <html> on the client, which differs from the server render.
     * Without this, React logs a hydration mismatch warning.
     */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * Inline script to apply the theme BEFORE React hydrates.
         * This prevents the "flash of light theme" even in dark mode.
         * It reads localStorage and applies the class synchronously.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
