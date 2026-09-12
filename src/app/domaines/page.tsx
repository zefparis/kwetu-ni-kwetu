import Link from "next/link";

export const metadata = { title: "Domaines d'intervention" };

export default function DomainesPage() {
  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Sur le terrain</p>
          <h1 style={{ maxWidth: "20ch" }}>Quatre domaines, une même approche intégrée.</h1>
          <p className="lede">
            La Fondation Kwetu Ni Kwetu développe ses activités dans les secteurs
            qui touchent directement la vie quotidienne des villages : le foncier
            communautaire, la production agricole, l'accès au savoir et la santé
            des familles.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="domaine-list">
            <div className="domaine">
              <svg className="icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 38L6 20L22 8L38 20L38 38Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M18 38V26H26V38" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <div>
                <h3>Développement rural</h3>
                <p style={{ margin: 0 }}>Un accompagnement direct des villages, de l'infrastructure de base à l'organisation communautaire.</p>
                <ul>
                  <li>Projets de développement communautaire</li>
                  <li>Infrastructures villageoises</li>
                  <li>Accompagnement des initiatives locales</li>
                </ul>
              </div>
            </div>

            <div className="domaine">
              <svg className="icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 38V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 22C22 22 14 20 12 12C20 12 22 22 22 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M22 28C22 28 30 26 32 18C24 18 22 28 22 28Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M8 38H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <h3>Agriculture et élevage</h3>
                <p style={{ margin: 0 }}>Le socle économique des familles rurales, de la production à la vente.</p>
                <ul>
                  <li>Agriculture familiale et communautaire</li>
                  <li>Élevage</li>
                  <li>Transformation et commercialisation des produits agricoles</li>
                  <li>Création d'activités génératrices de revenus</li>
                </ul>
              </div>
            </div>

            <div className="domaine">
              <svg className="icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 14L22 8L38 14L22 20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M13 17V27C13 27 17 31 22 31C27 31 31 27 31 27V17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M38 14V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <h3>Éducation et formation</h3>
                <p style={{ margin: 0 }}>Le savoir comme premier levier d'autonomie, pour les enfants comme pour les adultes.</p>
                <ul>
                  <li>Appui à l'éducation des enfants</li>
                  <li>Formation professionnelle</li>
                  <li>Alphabétisation</li>
                  <li>Formation entrepreneuriale des jeunes et des femmes</li>
                </ul>
              </div>
            </div>

            <div className="domaine">
              <svg className="icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 37C22 37 6 27 6 16C6 10.5 10.5 7 15 7C18 7 20.5 8.5 22 11C23.5 8.5 26 7 29 7C33.5 7 38 10.5 38 16C38 27 22 37 22 37Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 20H19L21 15L24 25L26 20H31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3>Santé et protection sociale</h3>
                <p style={{ margin: 0 }}>La prévention et l'hygiène comme premières lignes de défense des familles.</p>
                <ul>
                  <li>Sensibilisation sanitaire</li>
                  <li>Hygiène et assainissement</li>
                  <li>Campagnes de prévention et de protection sociale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-strip">
        <div className="wrap" style={{ textAlign: "center" }}>
          <blockquote>
            « Répondre aux besoins essentiels des populations tout en créant les
            conditions d'un développement durable. »
          </blockquote>
          <div style={{ marginTop: 24, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn" href="/campagnes">Soutenir une campagne</Link>
            <Link className="btn ghost" href="/contact">Nous contacter</Link>
          </div>
        </div>
      </section>
    </>
  );
}
