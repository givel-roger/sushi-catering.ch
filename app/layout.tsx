import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sushi Catering Schweiz — Frisch gerollt, direkt zu Ihnen",
    template: "%s | Sushi Catering Schweiz",
  },
  description:
    "Premium Sushi Catering für Events, Firmenanlässe und private Feiern in der ganzen Schweiz. Mit oder ohne Koch. Frisch zubereitet von Kaiten Sushi.",
  keywords: [
    "sushi catering",
    "sushi catering schweiz",
    "sushi event",
    "sushi party",
    "sushi koch mieten",
    "sushi platte bestellen",
    "catering luzern",
    "sushi workshop",
    "firmen catering schweiz",
  ],
  authors: [{ name: "Kaiten by Yorokobi" }],
  metadataBase: new URL("https://www.sushi-catering.ch"),
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.sushi-catering.ch",
    siteName: "Sushi Catering Schweiz",
    title: "Sushi Catering Schweiz — Frisch gerollt, direkt zu Ihnen",
    description:
      "Premium Sushi Catering für Events, Firmenanlässe und private Feiern. Live-Koch, Sushi Platten oder Workshop. Ab 8 Personen.",
    images: [
      {
        url: "/images/hero-sushi.jpg",
        width: 1200,
        height: 630,
        alt: "Sushi Catering Platte von Kaiten",
      },
    ],
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodService",
              name: "Sushi Catering Schweiz by Kaiten",
              description:
                "Premium Sushi Catering für Events, Firmenanlässe und private Feiern in der ganzen Schweiz.",
              url: "https://www.sushi-catering.ch",
              telephone: "+41412409999",
              email: "info@sushi-catering.ch",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Luzern",
                addressCountry: "CH",
              },
              areaServed: {
                "@type": "Country",
                name: "Schweiz",
              },
              priceRange: "CHF 45-95 pro Person",
              sameAs: ["https://www.kaiten.ch"],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
