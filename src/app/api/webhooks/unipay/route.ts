import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, type UniPayWebhookPayload } from "@/lib/unipay";

/**
 * Webhook de confirmation UniPay.
 *
 * Reçoit les notifications payment.status_update quand une transaction
 * Mobile Money est confirmée (success) ou échouée (failed/cancelled).
 *
 * Sécurité : la signature HMAC-SHA256 est vérifiée systématiquement.
 * Le body brut est lu pour la vérification (pas de parsing JSON avant).
 */
export async function POST(req: NextRequest) {
  // ── Lire le body brut pour la vérification de signature ──
  const rawBody = await req.text();

  const signature = req.headers.get("x-unipay-signature");
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[UniPay webhook] Signature invalide — rejet");
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  // ── Parser le payload maintenant que la signature est vérifiée ──
  let payload: UniPayWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("[UniPay webhook] Payload JSON invalide");
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  if (payload.event !== "payment.status_update") {
    console.warn("[UniPay webhook] Événement ignoré:", payload.event);
    return NextResponse.json({ ok: true, ignored: true });
  }

  const { transaction_id, status } = payload.data;

  // ── Trouver la contribution correspondante ──
  const contribution = await prisma.contribution.findFirst({
    where: { transactionId: transaction_id },
    include: { campaign: { include: { contributions: true } } },
  });

  if (!contribution) {
    console.warn("[UniPay webhook] Contribution introuvable pour transaction:", transaction_id);
    // Répondre 200 pour éviter les retries inutiles d'UniPay
    return NextResponse.json({ ok: true, ignored: true });
  }

  // ── Mapper le statut UniPay → statut Contribution ──
  // UniPay: pending | processing | success | failed | cancelled
  // Contribution: pending | completed | failed
  let newStatus: string;
  if (status === "success") {
    newStatus = "completed";
  } else if (status === "failed" || status === "cancelled") {
    newStatus = "failed";
  } else {
    // pending / processing — pas de changement définitif
    console.log("[UniPay webhook] Statut transitoire:", status, "pour", transaction_id);
    return NextResponse.json({ ok: true, transient: true });
  }

  // ── Mettre à jour la contribution (uniquement si pas déjà traitée) ──
  if (contribution.status === newStatus) {
    console.log("[UniPay webhook] Déjà à jour:", newStatus, "pour", transaction_id);
    return NextResponse.json({ ok: true, noop: true });
  }

  await prisma.contribution.update({
    where: { id: contribution.id },
    data: { status: newStatus },
  });

  console.log("[UniPay webhook] Contribution", contribution.id, "→", newStatus);

  // ── Si completed, vérifier si la campagne atteint son objectif ──
  if (newStatus === "completed") {
    const campaign = contribution.campaign;
    const fundedQty = campaign.contributions
      .filter((c) => c.status === "completed")
      .reduce((sum, c) => sum + c.amount, 0) / campaign.unitPrice;

    // Inclure la contribution qu'on vient de valider
    const totalFunded = fundedQty + (contribution.amount / campaign.unitPrice);

    if (totalFunded >= campaign.targetQty && campaign.status === "active") {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "completed" },
      });
      console.log("[UniPay webhook] Campagne", campaign.id, "→ completed (objectif atteint)");
    }
  }

  return NextResponse.json({ ok: true });
}
