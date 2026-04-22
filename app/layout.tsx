import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThePixFlow - Video Agency SaaS",
  description: "Manage your video editing projects seamlessly.",
  verification: {
    google: "google9fd351aad1206a09",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} min-h-full antialiased dark`}
    >
      <body className="min-h-screen w-full bg-black text-white selection:bg-[#fd1d1d]/30 overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
