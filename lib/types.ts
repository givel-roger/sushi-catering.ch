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
};

export const DEFAULT_MOTIFS: MotifDisplay[] = [
  { id: "elegant", label: "Edel & neutral", sub: "Immer passend", bg: "#1a1a1a", accent: "#c8962e" },
  { id: "geburtstag", label: "Geburtstag", sub: "Herzlich", bg: "#2d1b4e", accent: "#e8a0bf" },
  { id: "weihnachten", label: "Weihnachten", sub: "Festlich", bg: "#1a2e1a", accent: "#c41e2a" },
  { id: "danke", label: "Danke", sub: "Von Herzen", bg: "#3d2b1a", accent: "#c8962e" },
  { id: "valentinstag", label: "Valentinstag", sub: "Amore", bg: "#3d1a1a", accent: "#e84060" },
  { id: "genuss", label: "Genussmoment", sub: "Für Geniesser", bg: "#1a2a3d", accent: "#c8962e" },
  { id: "gratulation", label: "Gratulation", sub: "Für grosse Momente", bg: "#1a1a2e", accent: "#c8962e" },
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
