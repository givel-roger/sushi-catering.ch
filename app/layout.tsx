import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sushi Catering Schweiz — Frisch gerollt, direkt zu Ihnen",
  description:
    "Premium Sushi Catering für Events, Firmenanlässe und private Feiern in der ganzen Schweiz. Mit oder ohne Koch. Frisch zubereitet von Kaiten Sushi.",
  keywords: "sushi catering, sushi catering schweiz, sushi event, sushi party, sushi koch mieten",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
