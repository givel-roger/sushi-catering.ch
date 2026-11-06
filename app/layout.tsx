import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gutschein schenken — Daniele Restaurant & Winebar, Luzern",
    template: "%s | Gutschein schenken",
  },
  description:
    "Gutschein kaufen und verschenken für das Daniele Restaurant & Winebar in Luzern. In wenigen Minuten gekauft, sofort per Mail, ohne Verfalldatum.",
  keywords: [
    "gutschein",
    "restaurant gutschein",
    "daniele luzern",
    "geschenk",
    "gutschein kaufen",
    "restaurant geschenk",
    "winebar gutschein",
  ],
  authors: [{ name: "Daniele Restaurant & Winebar" }],
  metadataBase: new URL("https://www.gutschein-schenken.ch"),
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.gutschein-schenken.ch",
    siteName: "Gutschein schenken — Daniele",
    title: "Gutschein schenken — Daniele Restaurant & Winebar, Luzern",
    description:
      "Kulinarische Genussmomente verschenken. In wenigen Minuten gekauft, sofort per Mail, ohne Verfalldatum.",
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
              "@type": "Restaurant",
              name: "Daniele Restaurant & Winebar",
              description:
                "Italienisches Restaurant & Winebar in Luzern. Gutscheine online kaufen und verschenken.",
              url: "https://www.gutschein-schenken.ch",
              telephone: "+41412102020",
              email: "info@daniele.swiss",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kauffmannweg 16",
                addressLocality: "Luzern",
                postalCode: "6003",
                addressCountry: "CH",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
