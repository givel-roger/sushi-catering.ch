import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teamleiter Operativer Einkauf (m/w/d) – Confiserie Bachmann, Luzern",
  description:
    "Werde Teamleiter Operativer Einkauf (m/w/d) bei der Confiserie Bachmann in Luzern. Führe ein 3-köpfiges Team, optimiere Einkaufsprozesse und gestalte die Zukunft mit. Jetzt in 60 Sekunden bewerben.",
  keywords: [
    "teamleiter einkauf",
    "operativer einkauf",
    "confiserie bachmann",
    "job luzern",
    "einkauf lebensmittel",
    "führungsposition einkauf",
  ],
  metadataBase: new URL("https://www.operativer-einkauf.ch"),
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.operativer-einkauf.ch",
    siteName: "Confiserie Bachmann Karriere",
    title: "Teamleiter Operativer Einkauf (m/w/d) – Confiserie Bachmann",
    description:
      "Führe ein 3-köpfiges Einkaufsteam bei der Confiserie Bachmann in Luzern. ERP-Einführung, Prozessoptimierung, Lieferantenmanagement. 100% Festanstellung.",
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
              "@type": "JobPosting",
              title: "Teamleiter Operativer Einkauf (m/w/d)",
              description:
                "Führe ein 3-köpfiges Einkaufsteam bei der Confiserie Bachmann in Luzern.",
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
