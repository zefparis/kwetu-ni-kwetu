import Link from "next/link";
import { getDeliveredCampaigns, fundedQty } from "@/lib/data";

export const metadata = { title: "Impact" };
export const dynamic = "force-dynamic";

export default async function ImpactPage() {
  const delivered = await getDeliveredCampaigns();

  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Sur le terrain</p>
          <h1 style={{ maxWidth: "20ch" }}>Des livraisons documentées, une confiance méritée.</h1>
          <p className="lede">
            Chaque campagne arrivée à son terme donne lieu à une distribution
            physique dans le village ciblé. Voici les campagnes déjà livrées,
            avec preuve à l'appui lorsque disponible.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          {delivered.length === 0 ? (
            <div className="empty-state">
              <p>Aucune campagne livrée n'a encore été documentée.</p>
              <Link className="btn ghost" href="/campagnes" style={{ marginTop: 12 }}>
                Voir les campagnes en cours
              </Link>
            </div>
          ) : (
            <div className="impact-grid">
              {delivered.map((c) => {
                const funded = fundedQty(c, c.unitPrice);
                return (
                  <div key={c.id} className="impact-card">
                    <span className="delivered-badge">
                      ✓ Livrée
                    </span>
                    <h3>{c.title}</h3>
                    <p style={{ fontSize: ".92rem" }}>{c.description}</p>
                    <div className="progress-meta" style={{ marginTop: 12 }}>
                      <span>{funded} / {c.targetQty} unités financées</span>
                      <span>{c.village}</span>
                    </div>
                    {c.proofPhoto ? (
                      <img
                        src={c.proofPhoto}
                        alt={`Preuve de livraison — ${c.title}`}
                        style={{ width: "100%", borderRadius: 4, marginTop: 14 }}
                      />
                    ) : (
                      <div className="proof-placeholder">
                        Photo de preuve de livraison à venir
                      </div>
                    )}
                    <p style={{ fontSize: ".82rem", color: "var(--ink-soft)", marginTop: 12 }}>
                      Livrée le {new Date(c.updatedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
