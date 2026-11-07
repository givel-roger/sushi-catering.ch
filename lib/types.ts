import type { TenantBranding, TenantMotif } from "./schema";

export type TenantConfig = {
  id: string;
  slug: string;
  name: string;
  codePrefix: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressZip: string | null;
  branding: TenantBranding;
  motifs: MotifDisplay[];
  amountPresets: number[];
  minAmount: number;
  maxAmount: number;
};

export type MotifDisplay = {
  id: string;
  label: string;
  sub: string;
  bg: string;
  accent: string;
  icon?: string;
  imageUrl?: string;
};

export const DEFAULT_MOTIFS: MotifDisplay[] = [
  { id: "elegant", label: "Edel & neutral", sub: "Immer passend", bg: "linear-gradient(135deg, #1a1a1a 0%, #2a2520 50%, #1a1a1a 100%)", accent: "#c8962e", icon: "✦", imageUrl: "/images/motifs/elegant.jpg" },
  { id: "geburtstag", label: "Geburtstag", sub: "Herzlich", bg: "linear-gradient(135deg, #3b1054 0%, #5b2d8e 50%, #2d1b4e 100%)", accent: "#f0b8d8", icon: "🎂", imageUrl: "/images/motifs/geburtstag.jpg" },
  { id: "weihnachten", label: "Weihnachten", sub: "Festlich", bg: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 30%, #8b1a1a 70%, #1a2e1a 100%)", accent: "#e8c84a", icon: "🎄", imageUrl: "/images/motifs/weihnachten.jpg" },
  { id: "danke", label: "Danke", sub: "Von Herzen", bg: "linear-gradient(135deg, #1a3d2a 0%, #2d5a3d 50%, #1a3d2a 100%)", accent: "#7dd3a0", icon: "💚", imageUrl: "/images/motifs/danke.jpg" },
  { id: "valentinstag", label: "Valentinstag", sub: "Amore", bg: "linear-gradient(135deg, #4a1028 0%, #8b2252 50%, #4a1028 100%)", accent: "#ff6b8a", icon: "💕", imageUrl: "/images/motifs/valentinstag.jpg" },
  { id: "genuss", label: "Genussmoment", sub: "Für Geniesser", bg: "linear-gradient(135deg, #2a1a0a 0%, #5a3a1a 50%, #2a1a0a 100%)", accent: "#d4a04a", icon: "🍷", imageUrl: "/images/motifs/genuss.jpg" },
  { id: "gratulation", label: "Gratulation", sub: "Für grosse Momente", bg: "linear-gradient(135deg, #0a1a3d 0%, #1a2d6a 50%, #0a1a3d 100%)", accent: "#8ab4f8", icon: "🎉", imageUrl: "/images/motifs/gratulation.jpg" },
];

export const DEFAULT_AMOUNTS = [50, 100, 125, 150, 200, 250, 300];

export const DEFAULT_BRANDING: TenantBranding = {
  primaryColor: "#c8962e",
  primaryHoverColor: "#b0831f",
  backgroundColor: "#ffffff",
  foregroundColor: "#1a1a1a",
  surfaceColor: "#f9f7f3",
  borderColor: "#e8e3d8",
  displayFont: "Playfair Display",
  heroTitle: "Gutschein verschenken.",
  heroSubtitle: "In wenigen Minuten gekauft, sofort per Mail, ohne Verfalldatum.",
  featureList: [
    "Sofort per Mail zugestellt",
    "Ohne Verfalldatum",
    "Für alle Angebote einlösbar",
    "Auch als Geschenk versendbar",
  ],
};
