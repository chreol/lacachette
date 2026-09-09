import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const prisma = new PrismaClient();

async function prompt(question, hidden = false) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  if (!hidden) {
    const answer = await rl.question(question);
    rl.close();
    return answer.trim();
  }
  // Saisie masquée simple pour le mot de passe.
  return new Promise((resolve) => {
    stdout.write(question);
    const onData = (char) => {
      char = char.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.removeListener("data", onData);
        stdout.write("\n");
        rl.close();
        resolve(input.trim());
        return;
      }
      if (char === "\u0003") process.exit(1);
      input += char;
    };
    let input = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function main() {
  const email = process.env.ADMIN_EMAIL || (await prompt("Email admin : "));
  const name = process.env.ADMIN_NAME || (await prompt("Nom : "));
  const password = process.env.ADMIN_PASSWORD || (await prompt("Mot de passe (8+ caractères) : ", true));

  if (!email || !name || !password || password.length < 8) {
    console.error("Email, nom et mot de passe (8+ caractères) sont requis.");
    process.exit(1);
  }

  const existing = await prisma.staffUser.findUnique({ where: { email } });
  if (existing) {
    console.error(`Un compte existe déjà pour ${email}.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.staffUser.create({
    data: { email, name, passwordHash, role: "ADMIN" },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log(`Compte ADMIN créé : ${user.email} (${user.name})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
