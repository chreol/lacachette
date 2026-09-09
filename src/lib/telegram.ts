const TELEGRAM_API = "https://api.telegram.org";

/** Best-effort : n'importe quelle erreur est loggée mais ne doit jamais casser le flux de réservation. */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[telegram] TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant — message non envoyé.");
    return;
  }

  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[telegram] Échec envoi (${res.status}): ${body}`);
  }
}
