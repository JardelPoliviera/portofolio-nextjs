import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ThemeToggle from "@/components/ui/ThemeToggle"; // 1. Import tombolnya
// @ts-ignore Next.js handles global stylesheet imports at build time.
import "./globals.css";
import { SpotifyFooter } from "@/components/ui/spotify-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jardel Poliviera | Portofolio",
  description: "Portofolio Mahasiswa Informatika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        {children}
        <SpotifyFooter />
        {/* 2. Letakkan komponen tombol di sini */}
        <ThemeToggle />

        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
