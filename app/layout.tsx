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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark overflow-hidden`}
    >
      <body className="h-screen w-screen bg-black text-white overflow-hidden selection:bg-[#fd1d1d]/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
