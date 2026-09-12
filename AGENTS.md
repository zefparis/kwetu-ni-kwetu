# Fondation Kwetu Ni Kwetu — Plateforme campagnes

Site vitrine + système de campagnes de financement de produits de première
nécessité pour les villages de RDC. Next.js 16 (App Router) + Prisma + Supabase Postgres.

## Stack

- **Next.js 16** (App Router, Turbopack), React 19, TypeScript
- **Prisma 6** + **Supabase Postgres** (connection pooling PgBouncer)
- Styling : CSS global unique (`src/app/globals.css`) — charte terre d'origine
  conservée (ocre/olivier/terracotta, Fraunces + Karla via next/font)
- Pas de Tailwind, pas de framework UI

## Build & Test Commands

- **Dev** : `npm run dev` (http://localhost:3000)
- **Build** : `npm run build` (lance `prisma generate` puis `next build`)
- **Typecheck** : `npx tsc --noEmit`
- **Setup DB** : `npm run db:setup` (migrate + seed)
- **Seed seul** : `npm run prisma:seed`
- **Regénérer client Prisma** : `npm run prisma:generate`

## Démarrage rapide

```bash
npm install
npm run db:setup   # crée les tables sur Supabase + 4 campagnes d'exemple
npm run dev
```

## Variables d'environnement (.env — non commité)

- `DATABASE_URL` — URL Postgres **pooled** (PgBouncer, port 6543,
  `?pgbouncer=true`) — utilisée par le runtime Prisma Client
- `DIRECT_URL` — URL Postgres **directe** (port 5432) — utilisée par
  `prisma migrate dev` (PgBouncer incompatible avec les migrations)
- `ADMIN_PASSWORD` — mot de passe d'accès admin (régénéré pour la prod)

## Structure

- `src/app/` — pages : `/` (accueil), `/mission`, `/domaines`, `/contact`,
  `/campagnes` (liste filtrable), `/campagnes/[id]` (détail + formulaire mock),
  `/impact` (campagnes livrées), `/admin` (login), `/admin/dashboard` (CRUD)
- `src/app/api/admin/` — routes API : login, logout, campaigns (create),
  campaigns/[id] (update status)
- `src/components/` — SiteHeader, SiteFooter, CampaignCard, ProgressBar,
  ContributeForm, CreateCampaignForm, CampaignActions
- `src/lib/` — `prisma.ts` (singleton), `auth.ts` (session HMAC cookie),
  `data.ts` (helpers requêtes + calcul progression)
- `prisma/` — `schema.prisma` (Campaign + Contribution), `seed.ts`
- `legacy-html/` — sauvegarde des 4 pages HTML + style.css d'origine

## Modèle de données

- **Campaign** : id, title, description, productType, unitPrice, currency,
  targetQty, village, status (active|completed|delivered), illustration,
  proofPhoto, createdAt, updatedAt
- **Contribution** : id, campaignId, amount, currency, donorName, donorEmail,
  status (pending|completed|failed), createdAt
- La quantité financée est **calculée** depuis les contributions `completed`
  (somme des montants ÷ prix unitaire), jamais stockée.

## Admin

- Accès : `/admin` — mot de passe dans `.env` (`ADMIN_PASSWORD`).
- Auth : cookie httpOnly signé HMAC (pas de table de sessions).
- Le dashboard permet de créer une campagne et de changer son statut
  (active → completed → delivered). Les campagnes `delivered` apparaissent
  sur `/impact`.

## Paiement UniPay — Mobile Money (branché)

Le formulaire "Contribuer" initie un vrai paiement Mobile Money via l'API
UniPay (unipaycongo.com). Le flow :

1. L'utilisateur remplit le formulaire (quantité, devise CDF/USD, opérateur
   orange/airtel/afrimoney, numéro téléphone, nom/email optionnels)
2. `POST /api/contributions` valide côté serveur, crée une Contribution
   `pending`, appelle `POST /v1/payment/initiate` chez UniPay (direction:
   collect), stocke le `transactionId`
3. L'utilisateur reçoit un prompt USSD sur son téléphone pour confirmer
4. UniPay envoie un webhook `payment.status_update` à
   `/api/webhooks/unipay` (signature HMAC-SHA256 vérifiée)
5. La contribution passe à `completed` ou `failed`. Si `completed` et la
   campagne atteint son objectif → `campaign.status = "completed"`
6. L'utilisateur est redirigé vers `/contribuer/[id]/statut` pour suivre
   le statut de sa contribution

### Sécurité

- Le montant est **toujours recalculé côté serveur** (quantity × prix unitaire
  de la campagne en base), jamais depuis la valeur envoyée par le client
- Le webhook vérifie la signature HMAC-SHA256 (`X-UniPay-Signature: sha256=<hex>`)
  avec `crypto.timingSafeEqual` — un webhook non signé est rejeté (401)
- Les numéros de téléphone sont validés (format +243 + 9 chiffres)

### Mode sandbox

`UNIPAY_MODE=sandbox` ajoute le header `x-unipay-mode: sandbox` aux requêtes
API. En sandbox, UniPay retourne immédiatement `status: "success"` sans
prompt USSD réel. Passer à `UNIPAY_MODE=live` pour la production.

### Variables d'environnement UniPay (.env — non commité)

- `UNIPAY_API_URL` — URL de base de l'API (https://api.unipaycongo.com)
- `UNIPAY_API_KEY` — clé API marchand (header X-API-Key)
- `UNIPAY_WEBHOOK_SECRET` — secret HMAC pour vérifier les webhooks
- `UNIPAY_MODE` — "sandbox" ou "live"

### Fichiers UniPay

- `src/lib/unipay.ts` — client API (initiatePayment, verifyWebhookSignature,
  getTransactionStatus)
- `src/app/api/contributions/route.ts` — création contribution + init paiement
- `src/app/api/webhooks/unipay/route.ts` — webhook de confirmation
- `src/components/ContributeForm.tsx` — formulaire (devise, opérateur, téléphone)
- `src/app/contribuer/[id]/statut/page.tsx` — page de statut post-paiement

## Coordonnées provisoires

`contact@kwetunikwetu.org` et `+243 00 000 0000` sont des placeholders
marqués "(à confirmer)" — à valider avec l'utilisateur avant publication.

## Notes Prisma

- **Prisma 7+** exige des driver adapters (config différente). Ce projet utilise
  **Prisma 6.19** (dernière version avec le workflow classique `url` dans le
  schema + `migrate dev`). Ne pas upgrader vers Prisma 7/8 sans migrer la config.
- **Pattern Supabase** : `DATABASE_URL` (pooled, port 6543, PgBouncer) pour le
  runtime + `DIRECT_URL` (directe, port 5432) pour les migrations. Le bloc
  `datasource` du schema déclare `directUrl = env("DIRECT_URL")`.
