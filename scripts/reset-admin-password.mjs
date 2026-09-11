/**
 * Script de réinitialisation du mot de passe d'un compte admin.
 *
 * Usage :
 *   node scripts/reset-admin-password.mjs
 *
 * Ou avec les variables d'environnement :
 *   ADMIN_EMAIL="email@example.com" ADMIN_PASSWORD="nouveauMotDePasse" node scripts/reset-admin-password.mjs
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const prisma = new PrismaClient();

async function ask(question) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

async function main() {
  console.log("\n🔐 Réinitialisation du mot de passe admin — La Cachette\n");

  const email =
    process.env.ADMIN_EMAIL || (await ask("Email du compte à modifier : "));

  const existing = await prisma.staffUser.findUnique({ where: { email } });
  if (!existing) {
    console.error(`❌ Aucun compte trouvé pour : ${email}`);
    process.exit(1);
  }

  console.log(`✅ Compte trouvé : ${existing.name} (${existing.role})`);

  const newPassword =
    process.env.ADMIN_PASSWORD ||
    (await ask("Nouveau mot de passe (8+ caractères) : "));

  if (!newPassword || newPassword.length < 8) {
    console.error("❌ Mot de passe trop court (8 caractères minimum).");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.staffUser.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`\n✅ Mot de passe mis à jour pour : ${email}`);
  console.log(`   Vous pouvez maintenant vous connecter sur /admin/login\n`);
}

main()
  .catch((err) => {
    console.error("Erreur :", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
