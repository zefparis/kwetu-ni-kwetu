import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllCampaigns, fundedQty } from "@/lib/data";
import CreateCampaignForm from "./CreateCampaignForm";
import CampaignActions from "./CampaignActions";

export const metadata = { title: "Administration" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const campaigns = await getAllCampaigns();

  const statusLabel: Record<string, string> = {
    active: "Active",
    completed: "Financée",
    delivered: "Livrée",
  };

  return (
    <>
      <div className="admin-bar">
        <span>
          <strong>Espace administration</strong> — Fondation Kwetu Ni Kwetu
        </span>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="btn ghost admin-action-btn">
              Déconnexion
            </button>
          </form>
      </div>

      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Gestion</p>
          <h1>Tableau de bord</h1>
          <p>
            Créez de nouvelles campagnes et suivez leur progression. Une fois une
            campagne financée et distribuée physiquement, marquez-la comme livrée
            — elle apparaîtra sur la page <Link href="/impact">Impact</Link>.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <h2 style={{ fontSize: "1.4rem" }}>Créer une campagne</h2>
          <CreateCampaignForm />
        </div>
      </section>

      <div className="wrap"><hr className="divider" /></div>

      <section className="section-tight">
        <div className="wrap">
          <h2 style={{ fontSize: "1.4rem" }}>Campagnes existantes ({campaigns.length})</h2>
          {campaigns.length === 0 ? (
            <div className="empty-state">
              <p>Aucune campagne pour le moment. Créez la première ci-dessus.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Produit</th>
                  <th>Village</th>
                  <th>Progression</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const funded = fundedQty(c, c.unitPrice);
                  const pct = c.targetQty > 0 ? Math.min(100, Math.round((funded / c.targetQty) * 100)) : 0;
                  return (
                    <tr key={c.id}>
                      <td data-label="Titre">
                        <Link href={`/campagnes/${c.id}`} style={{ fontWeight: 500 }}>
                          {c.title}
                        </Link>
                      </td>
                      <td data-label="Produit">{c.productType}</td>
                      <td data-label="Village">{c.village}</td>
                      <td data-label="Progression">{funded}/{c.targetQty} ({pct}%)</td>
                      <td data-label="Statut">
                        <span className={`pill ${c.status}`}>{statusLabel[c.status] ?? c.status}</span>
                      </td>
                      <td data-label="Actions">
                        <CampaignActions id={c.id} status={c.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
