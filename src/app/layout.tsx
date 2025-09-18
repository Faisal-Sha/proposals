import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Upwork Proposal Builder",
  description:
    "Compose Upwork proposals with perfect formatting, instant previews, and one-click copy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Toaster richColors position="top-right" />
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-sm font-semibold uppercase tracking-wide">
                Proposal Lab
              </Link>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Editor
                </Link>
                <Link href="/how-to" className="hover:text-foreground">
                  How to paste
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
