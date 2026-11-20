const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@gutschein-schenken.ch";
const FROM_NAME = process.env.FROM_NAME || "gutschein-schenken.ch";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!BREVO_API_KEY) {
    console.error("[Email] BREVO_API_KEY nicht gesetzt — E-Mail nicht gesendet.");
    return false;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Email] Brevo-Fehler:", res.status, err);
    return false;
  }

  return true;
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Passwort zurücksetzen — gutschein-schenken.ch",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Passwort zurücksetzen</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
          Klicken Sie auf den Button, um ein neues Passwort zu setzen. Der Link ist 1 Stunde gültig.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 28px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Neues Passwort setzen
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px; line-height: 1.5;">
          Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail einfach.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
        <p style="color: #bbb; font-size: 11px;">gutschein-schenken.ch · Ein Angebot der Marktindex AG, Luzern</p>
      </div>
    `,
  };
}
