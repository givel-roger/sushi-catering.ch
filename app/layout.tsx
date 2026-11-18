import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Produktionsmitarbeiter/in Frühschicht (m/w/d) – Confiserie Bachmann, Luzern",
  description:
    "Werde Produktionsmitarbeiter/in in der Frühschicht bei der Confiserie Bachmann in Luzern. Handwerkliche Spezialitäten produzieren, ab 3:30 Uhr starten, ab 13 Uhr frei. Jetzt in 60 Sekunden bewerben.",
  keywords: [
    "produktionsmitarbeiter",
    "produktion frühschicht",
    "confiserie bachmann",
    "job luzern",
    "lebensmittelproduktion",
    "bäckerei produktion",
    "frühschicht job",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.produktionsmitarbeiter.ch",
    siteName: "Confiserie Bachmann Karriere",
    title: "Produktionsmitarbeiter/in Frühschicht (m/w/d) – Confiserie Bachmann",
    description:
      "Handwerkliche Spezialitäten produzieren bei der Confiserie Bachmann in Luzern. Frühschicht ab 3:30, Feierabend ab 13 Uhr. Festanstellung 100%.",
  },
  twitter: {
    card: "summary",
    title: "Produktionsmitarbeiter/in Frühschicht (m/w/d) – Confiserie Bachmann",
    description:
      "Handwerkliche Spezialitäten produzieren bei der Confiserie Bachmann in Luzern. Frühschicht ab 3:30, Feierabend ab 13 Uhr.",
  },
  metadataBase: new URL("https://www.produktionsmitarbeiter.ch"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
    ],
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
              "@type": "JobPosting",
              title: "Produktionsmitarbeiter/in Frühschicht (m/w/d)",
              description:
                "Produziere handwerkliche Spezialitäten bei der Confiserie Bachmann in Luzern. Frühschicht Mo–Fr ab 3:30 bis ca. 13:00 Uhr.",
              datePosted: "2026-11-18",
              hiringOrganization: {
                "@type": "Organization",
                name: "Confiserie Bachmann",
                sameAs: "https://www.confiserie.ch",
              },
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Werkhofstrasse 20",
                  addressLocality: "Luzern",
                  postalCode: "6005",
                  addressCountry: "CH",
                },
              },
              employmentType: "FULL_TIME",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
