import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initiatePayment, type UniPayOperator, type UniPayCurrency } from "@/lib/unipay";

const VALID_OPERATORS: UniPayOperator[] = ["orange", "airtel", "afrimoney"];
const VALID_CURRENCIES: UniPayCurrency[] = ["CDF", "USD"];

// Regex numéro de téléphone Mobile Money RDC : +243 suivi de 9 chiffres
const PHONE_REGEX = /^\+243\d{9}$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    campaignId,
    quantity,
    currency,
    operator,
    phone,
    donorName,
    donorEmail,
  } = body;

  // ── Validation serveur (ne jamais faire confiance au client) ──
  if (!campaignId || typeof campaignId !== "string") {
    return NextResponse.json({ error: "Campagne manquante" }, { status: 400 });
  }

  if (!quantity || typeof quantity !== "number" || quantity < 1 || !Number.isInteger(quantity)) {
    return NextResponse.json({ error: "Quantité invalide" }, { status: 400 });
  }

  if (!currency || !VALID_CURRENCIES.includes(currency)) {
    return NextResponse.json({ error: "Devise invalide (CDF ou USD)" }, { status: 400 });
  }

  if (!operator || !VALID_OPERATORS.includes(operator)) {
    return NextResponse.json({ error: "Opérateur invalide (orange, airtel, afrimoney)" }, { status: 400 });
  }

  if (!phone || typeof phone !== "string" || !PHONE_REGEX.test(phone)) {
    return NextResponse.json({ error: "Numéro invalide — format attendu : +243XXXXXXXXX" }, { status: 400 });
  }

  // ── Récupérer la campagne côté serveur (revalider le prix) ──
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { contributions: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
  }

  if (campaign.status !== "active") {
    return NextResponse.json({ error: "Cette campagne n'est plus active" }, { status: 400 });
  }

  // Le montant est TOUJOURS calculé côté serveur à partir du prix unitaire
  // de la campagne en base — jamais depuis la valeur envoyée par le client.
  const amount = Math.round(campaign.unitPrice * quantity * 100) / 100;

  if (amount <= 0) {
    return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
  }

  // Vérifier qu'on ne dépasse pas l'objectif
  const fundedQty = campaign.contributions
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.amount, 0) / campaign.unitPrice;
  const remaining = Math.max(0, campaign.targetQty - Math.floor(fundedQty));

  if (quantity > remaining) {
    return NextResponse.json(
      { error: `Quantité demandée (${quantity}) supérieure au reste disponible (${remaining})` },
      { status: 400 },
    );
  }

  // ── Créer la contribution en base (statut pending) ──
  const reference = `KWETU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const contribution = await prisma.contribution.create({
    data: {
      campaignId: campaign.id,
      amount,
      currency,
      donorName: donorName || null,
      donorEmail: donorEmail || null,
      status: "pending",
      operator,
      phone,
    },
  });

  // ── Initier le paiement UniPay ──
  try {
    const payment = await initiatePayment({
      operator,
      phone,
      amount,
      currency,
      reference,
      metadata: {
        contribution_id: contribution.id,
        campaign_id: campaign.id,
        campaign_title: campaign.title,
      },
    });

    // Stocker l'ID de transaction UniPay sur la contribution
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { transactionId: payment.transaction_id },
    });

    return NextResponse.json({
      ok: true,
      contributionId: contribution.id,
      transactionId: payment.transaction_id,
      status: payment.status,
      sandbox: payment.sandbox ?? false,
      amount,
      currency,
    });
  } catch (err) {
    // Marquer la contribution comme failed si l'initiation échoue
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { status: "failed" },
    });

    const message = err instanceof Error ? err.message : "Erreur d'initiation du paiement";
    console.error("[UniPay] initiate failed:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
