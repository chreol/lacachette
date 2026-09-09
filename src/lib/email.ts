const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export interface SendEmailInput {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  replyTo?: string;
}

/** Escape des valeurs utilisateur avant insertion dans un email HTML (anti-injection). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM_ADDRESS;
  const fromName = process.env.EMAIL_FROM_NAME ?? "La Cachette";

  if (!apiKey || !fromEmail) {
    console.error("[email] BREVO_API_KEY ou EMAIL_FROM_ADDRESS manquant — email non envoyé.");
    return;
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: input.to,
      subject: input.subject,
      htmlContent: input.html,
      ...(input.replyTo ? { replyTo: { email: input.replyTo } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[email] Échec envoi Brevo (${res.status}): ${body}`);
  }
}
