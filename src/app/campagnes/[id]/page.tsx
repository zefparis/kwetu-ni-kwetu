import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignById, fundedQty, progressPercent } from "@/lib/data";
import ProgressBar from "@/components/ProgressBar";
import ContributeForm from "@/components/ContributeForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) return { title: "Campagne introuvable" };
  return { title: campaign.title };
}

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  const funded = fundedQty(campaign, campaign.unitPrice);
  const pct = progressPercent(campaign, campaign.unitPrice, campaign.targetQty);
  const completedContributions = campaign.contributions
    .filter((c) => c.status === "completed")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p style={{ marginBottom: 12 }}>
            <Link href="/campagnes" style={{ fontSize: ".9rem", color: "var(--ink-soft)" }}>
              ← Toutes les campagnes
            </Link>
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <span className="tag-pill" style={{ background: "var(--bg-deep)", border: "1px solid var(--line)", borderRadius: 99, padding: "3px 12px", fontSize: ".78rem" }}>
              {campaign.productType}
            </span>
            <span className="tag-pill" style={{ background: "var(--bg-deep)", border: "1px solid var(--line)", borderRadius: 99, padding: "3px 12px", fontSize: ".78rem" }}>
              {campaign.village}
            </span>
          </div>
          <h1>{campaign.title}</h1>
          <p className="lede">{campaign.description}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap campaign-detail">
          <div>
            <ProgressBar funded={funded} target={campaign.targetQty} unit="unités" />
            <p style={{ marginTop: 16, fontSize: ".9rem", color: "var(--ink-soft)" }}>
              {pct}% de l'objectif financé — {campaign.targetQty - funded} unités restantes.
            </p>

            {completedContributions.length > 0 && (
              <div className="contrib-list">
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>
                  Contributions ({completedContributions.length})
                </h3>
                {completedContributions.map((c) => (
                  <div key={c.id} className="contrib-item">
                    <span className="who">{c.donorName ?? "Anonyme"}</span>
                    <span className="amt">
                      {c.amount} {c.currency}
                      <span style={{ color: "var(--ink-soft)", fontWeight: 400, marginLeft: 8, fontSize: ".82rem" }}>
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ContributeForm
            campaignId={campaign.id}
            unitPrice={campaign.unitPrice}
            currency={campaign.currency}
            targetQty={campaign.targetQty}
            fundedQty={funded}
          />
        </div>
      </section>
    </>
  );
}
