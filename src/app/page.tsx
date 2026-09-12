import Link from "next/link";

export const metadata = { title: "Accueil" };

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero">
          <div>
            <p className="eyebrow">Fondation de droit congolais — Kinshasa, RDC</p>
            <h1>Le développement durable commence par la communauté.</h1>
            <p className="lede">
              La Fondation Kwetu Ni Kwetu accompagne les villages et les zones
              rurales de la République démocratique du Congo vers l'autonomie —
              par la solidarité, la dignité humaine et la valorisation des
              ressources locales.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link className="btn" href="/domaines">Nos domaines d'intervention</Link>
              <Link className="btn ghost" href="/campagnes">Soutenir une campagne</Link>
            </div>
          </div>
          <svg className="hero-art" viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="330" cy="70" r="42" fill="#C4842A" opacity="0.9" />
            <path d="M0 260C50 190 110 160 175 160C240 160 300 190 350 260" stroke="#5C6B2F" strokeWidth="3" fill="none" />
            <path d="M0 300C60 230 130 200 200 200C270 200 330 230 400 300" stroke="#A64B2E" strokeWidth="3" fill="none" />
            <path d="M120 260L120 190L165 155L210 190L210 260Z" fill="#FAF4E7" stroke="#2B2318" strokeWidth="2.5" />
            <path d="M108 195L165 148L222 195" stroke="#2B2318" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="150" y="215" width="30" height="45" fill="#2B2318" opacity="0.85" />
            <path d="M0 340C60 320 110 335 175 340C245 345 300 325 400 335L400 380L0 380Z" fill="#E7D8B8" />
          </svg>
        </div>
      </section>

      <div className="wrap"><hr className="divider" /></div>

      <section className="quote-strip section-tight">
        <div className="wrap" style={{ textAlign: "center" }}>
          <blockquote>
            « Le développement durable commence par la communauté et doit
            profiter directement à la population. »
          </blockquote>
        </div>
      </section>

      <section>
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Notre devise</p>
            <h2>Trois valeurs, une même direction.</h2>
            <p>
              Chacune guide une part de notre action sur le terrain, du soutien
              aux familles vulnérables jusqu'à l'entrepreneuriat communautaire.
            </p>
          </div>
          <div></div>
        </div>
        <div className="wrap" style={{ marginTop: 30 }}>
          <div className="valeurs-grid">
            <div className="valeur">
              <span className="tag" style={{ background: "var(--amour)" }} />
              <h3>Amour</h3>
              <p>Mettre l'être humain au centre de toute action et promouvoir la solidarité envers les personnes et les communautés vulnérables.</p>
            </div>
            <div className="valeur">
              <span className="tag" style={{ background: "var(--fraternite)" }} />
              <h3>Fraternité</h3>
              <p>Renforcer l'unité, la solidarité, la cohésion sociale et l'entraide entre les membres des communautés.</p>
            </div>
            <div className="valeur">
              <span className="tag" style={{ background: "var(--travail)" }} />
              <h3>Travail</h3>
              <p>Encourager l'effort, la responsabilité, l'entrepreneuriat et la participation active des populations à leur propre développement.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Sur le terrain</p>
          <h2 style={{ maxWidth: "20ch" }}>Une approche intégrée du village jusqu'à la commercialisation.</h2>
          <p style={{ maxWidth: "60ch" }}>
            Développement rural, agriculture et élevage, éducation, santé,
            autonomisation des femmes et des jeunes : nous répondons aux besoins
            essentiels des populations tout en posant les bases d'un
            développement durable.
          </p>
          <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link className="btn ghost" href="/domaines">Voir tous les domaines →</Link>
            <Link className="btn fraternite" href="/campagnes">Découvrir les campagnes →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
