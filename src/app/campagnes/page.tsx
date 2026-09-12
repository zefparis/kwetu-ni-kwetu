import Link from "next/link";
import { getActiveCampaigns, getFilterOptions, fundedQty, progressPercent } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";

export const metadata = { title: "Campagnes" };

export default async function CampagnesPage({
  searchParams,
}: {
  searchParams: Promise<{ village?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [allActive, options] = await Promise.all([getActiveCampaigns(), getFilterOptions()]);

  const filtered = allActive.filter((c) => {
    if (params.village && c.village !== params.village) return false;
    if (params.type && c.productType !== params.type) return false;
    return true;
  });

  const totalFunded = allActive.reduce(
    (sum, c) => sum + fundedQty(c, c.unitPrice),
    0,
  );
  const totalTarget = allActive.reduce((sum, c) => sum + c.targetQty, 0);

  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Soutenir le terrain</p>
          <h1 style={{ maxWidth: "20ch" }}>Financez un produit, changez un village.</h1>
          <p className="lede">
            Chaque campagne correspond à un lot de produits de première nécessité
            destiné à un village. Vous financez tout ou partie d'un lot — la
            Fondation assure la distribution physique et documente la livraison.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="filters">
            <form method="get" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div className="field">
                <label htmlFor="village">Village</label>
                <select name="village" id="village" defaultValue={params.village ?? ""}>
                  <option value="">Tous les villages</option>
                  {options.villages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="type">Type de produit</label>
                <select name="type" id="type" defaultValue={params.type ?? ""}>
                  <option value="">Tous les produits</option>
                  {options.productTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn ghost" style={{ padding: "10px 20px" }}>
                Filtrer
              </button>
              {(params.village || params.type) && (
                <Link href="/campagnes" className="btn ghost" style={{ padding: "10px 20px" }}>
                  Réinitialiser
                </Link>
              )}
            </form>
          </div>

          <p style={{ marginTop: 20, fontSize: ".9rem", color: "var(--ink-soft)" }}>
            {filtered.length} campagne{filtered.length > 1 ? "s" : ""} active{filtered.length > 1 ? "s" : ""}
            {totalTarget > 0 && (
              <> — {totalFunded} / {totalTarget} unités financées au total</>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>Aucune campagne ne correspond à ces filtres pour le moment.</p>
              <Link className="btn ghost" href="/campagnes" style={{ marginTop: 12 }}>
                Voir toutes les campagnes
              </Link>
            </div>
          ) : (
            <div className="campaign-grid">
              {filtered.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
