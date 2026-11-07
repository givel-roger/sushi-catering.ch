import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gutschein schenken",
    template: "%s | Gutschein schenken",
  },
  description: "Gutscheine online kaufen und verschenken. Sofort per Mail, ohne Verfalldatum.",
  metadataBase: new URL("https://www.gutschein-schenken.ch"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <head />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
