import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { sendTelegramMessage } from "@/lib/telegram";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.staffUser.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  // Generate 6-digit OTP
  const otp = generateOtp();
  const otpHash = await hashPassword(otp);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.staffUser.update({
    where: { id: user.id },
    data: { otpCode: otpHash, otpExpiresAt },
  });

  // Send OTP by email
  const emailHtml = `
    <!DOCTYPE html><html lang="fr"><body style="margin:0;padding:40px 20px;background:#171310;font-family:sans-serif;color:#E8D8B8;">
    <div style="max-width:480px;margin:0 auto;background:#1a1614;border-top:4px solid #C59A4A;border-radius:8px;overflow:hidden;">
      <div style="padding:32px 30px;text-align:center;background:#130f0d;">
        <h1 style="margin:0;font-family:Georgia,serif;color:#C59A4A;font-size:24px;letter-spacing:3px;">LA CACHETTE</h1>
        <p style="margin:6px 0 0;color:#E8D8B8;font-size:13px;font-style:italic;">Administration</p>
      </div>
      <div style="padding:36px 30px;text-align:center;">
        <p style="margin:0 0 8px;color:#E8D8B8;font-size:16px;">Bonjour <strong>${user.name}</strong>,</p>
        <p style="margin:0 0 28px;color:#E8D8B8/70;font-size:14px;color:#b0a090;">Voici votre code de connexion à usage unique :</p>
        <div style="display:inline-block;background:#4A2C20;border:2px solid #C59A4A;border-radius:12px;padding:18px 36px;margin:0 auto;">
          <span style="font-family:monospace;font-size:36px;font-weight:bold;color:#C59A4A;letter-spacing:10px;">${otp}</span>
        </div>
        <p style="margin:24px 0 0;color:#b0a090;font-size:13px;">Ce code expire dans <strong style="color:#E8D8B8;">5 minutes</strong>.</p>
        <p style="margin:8px 0 0;color:#b0a090;font-size:12px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
      </div>
      <div style="padding:16px 30px;background:#130f0d;text-align:center;border-top:1px solid #4A2C20;">
        <p style="margin:0;color:#E8D8B8;font-size:11px;opacity:0.4;">La Cachette Resto · Ékié, Yaoundé</p>
      </div>
    </div>
    </body></html>
  `;

  await sendEmail({
    to: [{ email: user.email, name: user.name }],
    subject: `🔐 Votre code de connexion : ${otp}`,
    html: emailHtml,
  });

  // Also send via Telegram as backup
  await sendTelegramMessage(
    `🔐 <b>Code de connexion admin</b>\n\nBonjour <b>${user.name}</b>,\n\nVotre code OTP : <code>${otp}</code>\n\nExpire dans 5 minutes.`,
    "HTML"
  );

  return NextResponse.json({ step: "otp", email: user.email });
}
