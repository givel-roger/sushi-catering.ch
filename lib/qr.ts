import QRCode from "qrcode";

export function getGutscheinUrl(tenantSlug: string, code: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gutschein-schenken.ch";
  return `${base}/r/${tenantSlug}/einloesen?code=${encodeURIComponent(code)}`;
}

export async function generateQRDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 1,
    color: { dark: "#1a1a1a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}

export async function generateQRBuffer(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    width: 200,
    margin: 1,
    color: { dark: "#1a1a1a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}
