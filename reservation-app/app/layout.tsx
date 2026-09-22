import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { CLINIC_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `${CLINIC_NAME}｜オンライン予約`,
  description: `${CLINIC_NAME}のオンライン予約・問診票です。`,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "予約カレンダー",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#445834",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-brand-50 flex flex-col">
        <header className="bg-brand-700 text-white">
          <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-wide">
              {CLINIC_NAME}
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-brand-700/70 py-6">
          &copy; {new Date().getFullYear()} {CLINIC_NAME}
        </footer>
      </body>
    </html>
  );
}
