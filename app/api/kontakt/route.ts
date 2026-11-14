import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Neu bei jedem Serverstart; offene Rechenaufgaben werden dann ungültig und das Formular holt eine neue.
const CAPTCHA_GEHEIMNIS = randomBytes(32);
const CAPTCHA_GUELTIG_MS = 30 * 60 * 1000;
const benutzteCaptchas = new Map<string, number>();

function captchaSignatur(ablauf: number, antwort: number): Buffer {
  return createHmac("sha256", CAPTCHA_GEHEIMNIS).update(`${ablauf}:${antwort}`).digest();
}

function captchaPruefen(token: unknown, antwort: unknown): boolean {
  if (typeof token !== "string") return false;
  const [ablaufText, sigText] = token.split(".");
  const ablauf = Number(ablaufText);
  const zahl = Number(String(antwort ?? "").trim());
  const jetzt = Date.now();
  if (!Number.isInteger(ablauf) || ablauf < jetzt || !Number.isInteger(zahl) || !sigText) return false;
  if (benutzteCaptchas.has(token)) return false;
  benutzteCaptchas.set(token, ablauf);
  for (const [t, a] of benutzteCaptchas) if (a < jetzt) benutzteCaptchas.delete(t);
  const erwartet = captchaSignatur(ablauf, zahl);
  const erhalten = Buffer.from(sigText, "base64url");
  return erhalten.length === erwartet.length && timingSafeEqual(erhalten, erwartet);
}

export async function GET() {
  const a = randomInt(1, 10);
  const b = randomInt(1, 10);
  const ablauf = Date.now() + CAPTCHA_GUELTIG_MS;
  const token = `${ablauf}.${captchaSignatur(ablauf, a + b).toString("base64url")}`;
  return NextResponse.json({ frage: `Wie viel ist ${a} + ${b}?`, token }, { headers: { "cache-control": "no-store" } });
}

const MIN_AUSFUELLZEIT_MS = 3_000;
const MAX_FORMULARALTER_MS = 24 * 60 * 60 * 1000;
const LIMIT_PRO_IP = 3;
const LIMIT_FENSTER_MS = 10 * 60 * 1000;
const MAX_LINKS = 2;

const anfragenProIp = new Map<string, number[]>();

function limitErreicht(ip: string): boolean {
  const jetzt = Date.now();
  const frisch = (anfragenProIp.get(ip) ?? []).filter((t) => jetzt - t < LIMIT_FENSTER_MS);
  if (frisch.length >= LIMIT_PRO_IP) {
    anfragenProIp.set(ip, frisch);
    return true;
  }
  frisch.push(jetzt);
  anfragenProIp.set(ip, frisch);
  if (anfragenProIp.size > 5_000) {
    for (const [k, v] of anfragenProIp) {
      if (v.every((t) => jetzt - t >= LIMIT_FENSTER_MS)) anfragenProIp.delete(k);
    }
  }
  return false;
}

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// Spam bekommt dieselbe Erfolgsantwort wie echte Anfragen, damit Bots nicht lernen, was sie verrät.
function stillVerwerfen(grund: string) {
  console.warn("[kontakt] Spam verworfen:", grund);
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (text(data.website, 200)) return stillVerwerfen("Fangfeld ausgefüllt");
    const gestartet = Number(data.t);
    const dauer = Date.now() - gestartet;
    if (!Number.isFinite(gestartet) || dauer < MIN_AUSFUELLZEIT_MS || dauer > MAX_FORMULARALTER_MS) {
      return stillVerwerfen(`Ausfüllzeit ${dauer} ms`);
    }

    if (!captchaPruefen(data.captchaToken, data.captchaAntwort)) {
      return NextResponse.json(
        { error: "Die Antwort auf die Sicherheitsfrage stimmt nicht. Bitte beantworten Sie die neue Frage.", captcha: true },
        { status: 400 },
      );
    }

    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unbekannt";
    if (limitErreicht(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut." },
        { status: 429 },
      );
    }

    const firma = text(data.firma, 150);
    const nameVorname = text(data.nameVorname, 150).replace(/[\r\n]+/g, " ");
    const adresse = text(data.adresse, 200);
    const plzOrt = text(data.plzOrt, 100);
    const email = text(data.email, 200);
    const telefon = text(data.telefon, 50);
    const bemerkungen = text(data.bemerkungen, 5_000);

    if (!nameVorname || !email) {
      return NextResponse.json({ error: "Name und E-Mail sind Pflichtfelder." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." }, { status: 400 });
    }

    const alles = [firma, nameVorname, adresse, plzOrt, telefon, bemerkungen].join(" ");
    const links = (alles.match(/https?:\/\/|www\./gi) ?? []).length;
    if (links > MAX_LINKS || /https?:\/\/|www\./i.test(nameVorname)) {
      return stillVerwerfen(`${links} Links`);
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn("[kontakt] BREVO_API_KEY fehlt");
      return NextResponse.json({ error: "E-Mail-Versand nicht konfiguriert." }, { status: 500 });
    }

    const rows = [
      firma ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Firma</td><td style="padding:4px 0;font-weight:600">${esc(firma)}</td></tr>` : "",
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td style="padding:4px 0;font-weight:600">${esc(nameVorname)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Adresse</td><td style="padding:4px 0;font-weight:600">${esc(adresse)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">PLZ / Ort</td><td style="padding:4px 0;font-weight:600">${esc(plzOrt)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">E-Mail</td><td style="padding:4px 0;font-weight:600">${esc(email)}</td></tr>`,
      telefon ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Telefon</td><td style="padding:4px 0;font-weight:600">${esc(telefon)}</td></tr>` : "",
      bemerkungen ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Bemerkungen</td><td style="padding:4px 0;font-weight:600">${esc(bemerkungen)}</td></tr>` : "",
    ].filter(Boolean).join("");

    const html = `
      <h2 style="font-family:sans-serif">Kontaktanfrage Wiehnachtsmärt</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>
      <p style="font-family:sans-serif;color:#94a3b8;font-size:12px">Gesendet von weihnachtsmarkt-luzern.com</p>`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Wiehnachtsmärt Kontakt", email: "givel@marktindex.ch" },
        to: [{ email: "sekretariat@weihnachtsmarktluzern.com" }, { email: "givel@marktindex.ch" }],
        replyTo: { email },
        subject: `Kontaktanfrage: ${nameVorname}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[kontakt] Brevo Fehler", res.status, body);
      return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
