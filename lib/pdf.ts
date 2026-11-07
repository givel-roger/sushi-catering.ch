import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQRBuffer, getGutscheinUrl } from "./qr";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return rgb(
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255
  );
}

type GutscheinPdfData = {
  code: string;
  amount: number;
  motifLabel: string;
  widmungFuer: string;
  widmungVon: string;
  widmungNachricht: string;
  tenantSlug: string;
  tenantName: string;
  tenantAddress: string;
  tenantPhone: string;
  tenantWebsite: string;
  accentColor: string;
  foregroundColor: string;
};

export async function generateGutscheinPdf(data: GutscheinPdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 420]); // A5 landscape
  const { width, height } = page.getSize();

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const accent = hexToRgb(data.accentColor);
  const dark = hexToRgb(data.foregroundColor);
  const white = rgb(1, 1, 1);
  const gray = rgb(0.5, 0.5, 0.5);
  const lightGray = rgb(0.95, 0.94, 0.92);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: white });

  // Top accent bar
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: dark });

  // Tenant name in header
  page.drawText(data.tenantName.toUpperCase(), {
    x: 40, y: height - 35,
    size: 10, font: helvetica, color: rgb(1, 1, 1),
  });

  page.drawText("GUTSCHEIN", {
    x: 40, y: height - 55,
    size: 9, font: helvetica, color: rgb(1, 1, 1),
  });

  // Code in header right
  page.drawText(data.code, {
    x: width - 40 - helveticaBold.widthOfTextAtSize(data.code, 12),
    y: height - 45,
    size: 12, font: helveticaBold, color: accent,
  });

  // Amount — large centered
  const amountText = `CHF ${data.amount.toFixed(2)}`;
  const amountWidth = helveticaBold.widthOfTextAtSize(amountText, 48);
  page.drawText(amountText, {
    x: (width - amountWidth) / 2, y: height - 150,
    size: 48, font: helveticaBold, color: accent,
  });

  // Motif label
  const motifWidth = helvetica.widthOfTextAtSize(data.motifLabel, 11);
  page.drawText(data.motifLabel, {
    x: (width - motifWidth) / 2, y: height - 170,
    size: 11, font: helvetica, color: gray,
  });

  // Widmung section
  let yPos = height - 210;

  if (data.widmungFuer) {
    const fuerText = `Für: ${data.widmungFuer}`;
    const fuerWidth = helveticaBold.widthOfTextAtSize(fuerText, 12);
    page.drawText(fuerText, {
      x: (width - fuerWidth) / 2, y: yPos,
      size: 12, font: helveticaBold, color: dark,
    });
    yPos -= 20;
  }

  if (data.widmungVon) {
    const vonText = `Von: ${data.widmungVon}`;
    const vonWidth = helvetica.widthOfTextAtSize(vonText, 10);
    page.drawText(vonText, {
      x: (width - vonWidth) / 2, y: yPos,
      size: 10, font: helvetica, color: gray,
    });
    yPos -= 18;
  }

  if (data.widmungNachricht) {
    const maxChars = 60;
    const lines: string[] = [];
    let remaining = data.widmungNachricht;
    while (remaining.length > 0) {
      if (remaining.length <= maxChars) {
        lines.push(remaining);
        break;
      }
      const cut = remaining.lastIndexOf(" ", maxChars);
      const breakAt = cut > 0 ? cut : maxChars;
      lines.push(remaining.substring(0, breakAt));
      remaining = remaining.substring(breakAt).trimStart();
    }

    yPos -= 5;
    page.drawText("«", { x: 120, y: yPos + 2, size: 16, font: helvetica, color: accent });
    for (const line of lines.slice(0, 3)) {
      const lw = helvetica.widthOfTextAtSize(line, 9);
      page.drawText(line, {
        x: (width - lw) / 2, y: yPos,
        size: 9, font: helvetica, color: dark,
      });
      yPos -= 14;
    }
    page.drawText("»", {
      x: width - 130, y: yPos + 12,
      size: 16, font: helvetica, color: accent,
    });
  }

  // Bottom section: QR + info
  const bottomY = 85;

  // Light background for bottom
  page.drawRectangle({ x: 0, y: 0, width, height: bottomY + 15, color: lightGray });

  // QR Code
  const qrUrl = getGutscheinUrl(data.tenantSlug, data.code);
  const qrPng = await generateQRBuffer(qrUrl);
  const qrImage = await doc.embedPng(qrPng);
  page.drawImage(qrImage, { x: 40, y: 15, width: 75, height: 75 });

  // Info text next to QR
  const infoX = 130;
  page.drawText("Einlösen: QR-Code scannen oder Code eingeben", {
    x: infoX, y: bottomY - 5,
    size: 8, font: helveticaBold, color: dark,
  });
  page.drawText(data.code, {
    x: infoX, y: bottomY - 20,
    size: 10, font: helveticaBold, color: accent,
  });
  page.drawText("Ohne Verfalldatum · Teilbeträge möglich", {
    x: infoX, y: bottomY - 35,
    size: 7, font: helvetica, color: gray,
  });

  // Tenant info bottom right
  const rightX = width - 180;
  page.drawText(data.tenantName, {
    x: rightX, y: bottomY - 5,
    size: 8, font: helveticaBold, color: dark,
  });
  if (data.tenantAddress) {
    page.drawText(data.tenantAddress, {
      x: rightX, y: bottomY - 18,
      size: 7, font: helvetica, color: gray,
    });
  }
  if (data.tenantPhone) {
    page.drawText(data.tenantPhone, {
      x: rightX, y: bottomY - 30,
      size: 7, font: helvetica, color: gray,
    });
  }
  if (data.tenantWebsite) {
    page.drawText(data.tenantWebsite.replace(/^https?:\/\//, ""), {
      x: rightX, y: bottomY - 42,
      size: 7, font: helvetica, color: gray,
    });
  }

  // Powered by
  page.drawText("gutschein-schenken.ch", {
    x: width - 40 - helvetica.widthOfTextAtSize("gutschein-schenken.ch", 6),
    y: 5,
    size: 6, font: helvetica, color: rgb(0.75, 0.75, 0.75),
  });

  return doc.save();
}
