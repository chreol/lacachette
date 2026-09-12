<div align="center">

# 🍽️ LA CACHETTE
### Restaurant-Bar · Lounge Vintage Africain · Ékié, Yaoundé 🇨🇲

*« L'ambiance se cache ici. »*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://lacachette-nu.vercel.app)

[🌐 Site en ligne](https://lacachette-nu.vercel.app) · [🔧 Admin](https://lacachette-nu.vercel.app/admin) · [📋 Supabase](https://supabase.com/dashboard/project/knbbyasiowpsmcxhiyls)

</div>

---

## ✨ Fonctionnalités

### Site public
| Fonctionnalité | Description |
|---|---|
| 🏠 **Page d'accueil** | Hero animé, ambiance lounge, slogan |
| 📖 **Menu** | Cartes par catégorie (entrées, plats, boissons…) |
| 🖼️ **Galerie** | Photos ambiance, VIP Lounge, événements |
| 📅 **Réservation en ligne** | Formulaire avec sélection de créneaux en temps réel |
| 🗓️ **Disponibilité dynamique** | Créneaux colorés selon capacité restante par espace |
| ✅ **Page de confirmation** | `/reservation/[id]` — statut + QR code partageable |
| 📱 **WhatsApp flottant** | Bouton de contact direct |

### Espaces & capacités
| Espace | Capacité | Horaires |
|---|---|---|
| 🌿 Terrasse | 15 personnes | 11h00 – 23h00 |
| 🍽️ Salle Principale | 20 personnes | 11h00 – 23h00 |
| 💎 VIP Lounge | 4 personnes | 18h00 – 00h00 |
| 🔒 Privatisation VIP | 2 personnes | 18h00 – 00h00 |

### Administration (`/admin`)
| Fonctionnalité | Description |
|---|---|
| 🔐 **Login sécurisé** | Email + mot de passe + **2FA OTP** (email + Telegram) |
| 📋 **Gestion des réservations** | Liste, recherche, filtres par statut |
| 🔄 **Actions rapides** | Confirmer / Annuler / Reporter / Dupliquer / **Supprimer** |
| 💬 **WhatsApp en 1 clic** | Lien pré-rempli à chaque changement de statut |
| 👥 **Gestion du personnel** | Créer des comptes Staff / Admin |
| 🔔 **Rappels automatiques** | Telegram J-1 pour toutes les réservations confirmées |

### Notifications
| Canal | Déclencheur |
|---|---|
| 📧 Email (Brevo) | Nouvelle réservation → admin + client |
| 📱 Telegram | Nouvelle réservation + rappel J-1 automatique |
| 🔐 Email + Telegram | Code OTP 2FA lors du login admin |
| 📲 WhatsApp | Lien manuel après chaque action admin |

---

## 🛠️ Stack technique

```
Next.js 15 (App Router)    →  Framework React full-stack
TypeScript 5               →  Typage statique
Tailwind CSS v4            →  Styles utilitaires
Prisma 6 + Supabase        →  ORM + base de données PostgreSQL
Brevo (ex-Sendinblue)      →  Envoi d'emails transactionnels
Telegram Bot API           →  Alertes & OTP backup
jose + bcryptjs            →  JWT sessions + hash mots de passe
Framer Motion              →  Animations UI
Vercel                     →  Hébergement + Cron Jobs
```

---

## 🚀 Installation locale

### Prérequis
- Node.js 18+
- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Brevo](https://app.brevo.com) (gratuit)
- Bot Telegram via [@BotFather](https://t.me/BotFather)

### 1. Cloner et installer
```bash
git clone https://github.com/chreol/lacachette.git
cd lacachette
npm install
```

### 2. Variables d'environnement
Crée un fichier `.env.local` à la racine :

```env
# Base de données Supabase
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"

# Sessions admin (générer : openssl rand -base64 32)
SESSION_SECRET="votre-secret-aleatoire-32-caracteres-minimum"

# Email (Brevo)
BREVO_API_KEY="xkeysib-..."
EMAIL_FROM_ADDRESS="contact@votre-domaine.com"
EMAIL_FROM_NAME="La Cachette RESTO"
RESERVATION_NOTIFICATION_EMAIL="admin@votre-domaine.com"

# Telegram Bot
TELEGRAM_BOT_TOKEN="123456789:AAE-..."
TELEGRAM_CHAT_ID="votre_chat_id"

# Compte admin initial (pour le script seed)
ADMIN_EMAIL="admin@votre-domaine.com"
ADMIN_NAME="Admin"
ADMIN_PASSWORD="VotreMotDePasse!"
ADMIN_URL="http://localhost:3000/admin"

# Cron rappels J-1 (générer : openssl rand -base64 32)
CRON_SECRET="votre-cron-secret"

# URL publique du site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Base de données
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations (connexion directe port 5432)
npx prisma migrate deploy

# Créer le premier compte admin
npm run seed:admin
```

> **Supabase uniquement** — Si la migration échoue, exécuter ce SQL dans le [SQL Editor Supabase](https://supabase.com/dashboard/sql) :
> ```sql
> -- Tables créées par Prisma migrate
> -- OTP 2FA (si non appliqué via migrate)
> ALTER TABLE "StaffUser" ADD COLUMN IF NOT EXISTS "otpCode" TEXT;
> ALTER TABLE "StaffUser" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMPTZ;
> ```

### 4. Lancer en développement
```bash
npm run dev
```
→ [http://localhost:3000](http://localhost:3000)

---

## 🌐 Déploiement Vercel

### Variables d'environnement à configurer
Dans **Vercel → Project Settings → Environment Variables**, ajouter toutes les variables du `.env.local` avec les valeurs de production.

> ⚠️ **Important** : `DATABASE_URL` doit utiliser le **port 5432** (connexion directe) sur Vercel — le port 6543 (pgbouncer) est bloqué depuis AWS us-east-1.

### Cron Job (rappels J-1)
Le fichier `vercel.json` configure un cron quotidien à **10h00 Yaoundé (7h UTC)** :
```json
{
  "crons": [{ "path": "/api/cron/reminders", "schedule": "0 7 * * *" }]
}
```
La route est protégée par le header `Authorization: Bearer CRON_SECRET`.

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx                      # Page d'accueil publique
│   ├── reservation/[id]/page.tsx     # Page confirmation réservation
│   ├── admin/                        # Interface d'administration
│   │   ├── login/page.tsx            # Login 2FA (email + OTP)
│   │   ├── page.tsx                  # Dashboard admin
│   │   └── users/page.tsx            # Gestion du personnel
│   └── api/
│       ├── auth/login/               # Authentification step 1
│       ├── auth/otp/                 # Vérification OTP step 2
│       ├── reservations/             # CRUD réservations
│       ├── availability/             # Créneaux disponibles temps réel
│       └── cron/reminders/           # Rappels Telegram J-1
├── components/
│   ├── ReservationSection.tsx        # Formulaire de réservation public
│   ├── admin/
│   │   ├── AdminNav.tsx              # Navigation admin
│   │   ├── ReservationsAdmin.tsx     # Liste + gestion des réservations
│   │   └── StaffUsersAdmin.tsx       # Gestion du personnel
│   └── WhatsAppButton.tsx            # Bouton flottant WhatsApp
├── lib/
│   ├── availability.ts               # Logique créneaux + ZONE_CONFIG
│   ├── auth.ts                       # JWT + bcrypt
│   ├── email.ts + email-templates.ts # Emails transactionnels
│   ├── telegram.ts                   # Bot Telegram
│   ├── prisma.ts                     # Client Prisma singleton
│   ├── session.ts                    # Gestion cookie session
│   └── validation.ts                 # Schémas Zod
prisma/
└── schema.prisma                     # Modèles BDD (Reservation, StaffUser)
```

---

## 🔐 Sécurité

- **2FA obligatoire** pour l'accès admin (OTP valable 5 min, usage unique)
- **JWT sessions** signées (7 jours, cookie `httpOnly`)
- **Hash bcrypt** pour mots de passe et codes OTP
- **Validation Zod** sur toutes les entrées API
- **RLS Supabase** configurable par table
- **Cron protégé** par `CRON_SECRET` en header `Authorization`
- Messages d'erreur génériques (pas de fuite d'info sur l'existence des emails)

---

## 📞 Contacts

| | |
|---|---|
| 📧 Email | restolacachatte@chreolempire.com |
| 📧 Email alt | lacachette@resto.chreolempire.com |
| 📱 WhatsApp | +237 693 547 268 |
| 🤖 Telegram Bot | @LacachetteResto_Bot |
| 🌐 Site | [resto.chreolempire.com](https://resto.chreolempire.com) |

---

<div align="center">

**La Cachette** · Ékié, Yaoundé · Cameroun 🇨🇲

*Développé avec ❤️ par [Chreol Empire](https://chreolempire.com)*

</div>
