import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Image Text Composer",
  description: "Create and edit text layers on images",
};

/**
 * Root layout: applies global font and mounts the app Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}`}
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={2000} />
      </body>
    </html>
  );
}
