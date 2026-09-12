import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente de confirmation", color: "var(--travail)" },
  completed: { label: "Paiement confirmé — merci !", color: "var(--fraternite)" },
  failed: { label: "Paiement échoué", color: "var(--amour)" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contribution = await prisma.contribution.findUnique({
    where: { id },
    select: { id: true, amount: true, currency: true, status: true, campaignId: true },
  });
  if (!contribution) return { title: "Contribution introuvable" };
  return { title: "Statut de votre contribution" };
}

export default async function ContributionStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contribution = await prisma.contribution.findUnique({
    where: { id },
    include: { campaign: true },
  });

  if (!contribution) {
    return (
      <section className="section-tight">
        <div className="wrap">
          <div className="empty-state">
            <h1>Contribution introuvable</h1>
            <p>Cette contribution n'existe pas ou a été supprimée.</p>
            <Link className="btn ghost" href="/campagnes" style={{ marginTop: 12 }}>
              ← Voir les campagnes
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const statusInfo = STATUS_LABELS[contribution.status] ?? {
    label: contribution.status,
    color: "var(--ink-soft)",
  };

  const isPending = contribution.status === "pending";
  const isCompleted = contribution.status === "completed";

  return (
    <>
      <section className="section-tight">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <p className="eyebrow">Confirmation</p>
          <h1>{statusInfo.label}</h1>

          <div className="summary-card" style={{ marginTop: 24 }}>
            <div className="stat">
              <strong>{contribution.amount} {contribution.currency}</strong>
              <span>montant de votre contribution</span>
            </div>
            <div className="stat">
              <strong>{contribution.campaign.title}</strong>
              <span>campagne soutenue</span>
            </div>
            <div className="stat">
              <strong style={{ color: statusInfo.color }}>{statusInfo.label}</strong>
              <span>statut actuel</span>
            </div>
            {contribution.operator && (
              <div className="stat">
                <strong style={{ textTransform: "capitalize" }}>{contribution.operator}</strong>
                <span>opérateur Mobile Money</span>
              </div>
            )}
          </div>

          {isPending && (
            <div className="contrib-notice" style={{ marginTop: 20 }}>
              <strong>Confirmez le paiement sur votre téléphone.</strong> Vous
              devriez recevoir un prompt USSD sur le numéro{" "}
              <strong>{contribution.phone}</strong>. Suivez les instructions
              pour valider la transaction. Cette page se mettra à jour
              automatiquement une fois le paiement confirmé.
            </div>
          )}

          {isCompleted && (
            <div className="contrib-notice" style={{ marginTop: 20, borderColor: "var(--fraternite)" }}>
              <strong>Merci pour votre soutien !</strong> Votre contribution de{" "}
              {contribution.amount} {contribution.currency} a été confirmée et
              aide la fondation à atteindre son objectif pour le village de{" "}
              {contribution.campaign.village}.
            </div>
          )}

          {contribution.status === "failed" && (
            <div className="contrib-notice" style={{ marginTop: 20, borderColor: "var(--amour)" }}>
              <strong>Le paiement n'a pas abouti.</strong> Aucun montant n'a été
              débité. Vous pouvez réessayer en retournant sur la campagne.
            </div>
          )}

          <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link
              className="btn ghost"
              href={`/campagnes/${contribution.campaignId}`}
            >
              ← Retour à la campagne
            </Link>
            {isPending && (
              <button
                className="btn"
                onClick={() => window.location.reload()}
              >
                Actualiser le statut
              </button>
            )}
            {contribution.status === "failed" && (
              <Link className="btn" href={`/campagnes/${contribution.campaignId}`}>
                Réessayer
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
