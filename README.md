lacachette
LA CACHETTE — Bar • Restaurant • Lounge Vintage Africain à Ékié, Yaoundé 🇨🇲. Site web moderne développé avec Next.js, TypeScript et Tailwind CSS, présentant l’expérience, le menu, la galerie, les événements et les réservations.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Backend — Réservations & Administration

Le formulaire de réservation, les notifications et la page `/admin` nécessitent une base de données et un service d'email. Configuration :

1. **Copier `.env.example` en `.env`** et remplir les valeurs.
2. **Base de données (Supabase)** : créer un projet sur [supabase.com](https://supabase.com), récupérer les chaînes de connexion (`DATABASE_URL` en pooling port 6543, `DIRECT_URL` en direct port 5432) depuis *Project Settings → Database*.
3. **Email (Brevo)** : générer une clé API sur [app.brevo.com](https://app.brevo.com) (*SMTP & API → API Keys*) et vérifier le domaine d'envoi (`chreolempire.com`) dans *Senders & IP*. Renseigner `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`, `RESERVATION_NOTIFICATION_EMAIL`.
4. **Session admin** : générer une valeur aléatoire pour `SESSION_SECRET` (32+ caractères), ex. `openssl rand -base64 32`.
5. **Alertes Telegram (optionnel)** : créer un bot via [@BotFather](https://t.me/BotFather) sur Telegram, récupérer le token, puis récupérer l'ID du chat destinataire. Renseigner `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID`.
6. **Créer les tables** :
   ```bash
   npm run db:migrate -- --name init
   ```
7. **Créer le premier compte admin** (renseigner `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` dans `.env`, ou répondre aux invites) :
   ```bash
   npm run seed:admin
   ```
8. Se connecter sur `/admin/login`. Un admin peut ensuite créer d'autres comptes staff depuis `/admin/users`.

**Notifications WhatsApp** : pas d'automatisation officielle (nécessiterait un compte Meta Business vérifié et payant). La page admin génère un lien `wa.me` pré-rempli à chaque changement de statut, à envoyer manuellement en un clic.

En production (Vercel), renseigner les mêmes variables d'environnement dans *Project Settings → Environment Variables*.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
