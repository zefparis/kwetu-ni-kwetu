export const metadata = { title: "Mission & Vision" };

export default function MissionPage() {
  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Qui nous sommes</p>
          <h1 style={{ maxWidth: "18ch" }}>
            Contribuer au développement harmonieux et durable des communautés.
          </h1>
          <p className="lede">
            La Fondation Kwetu Ni Kwetu est une organisation à vocation sociale
            et de développement, créée en République démocratique du Congo le 15
            mai 2021, dont la mission est de contribuer au développement
            harmonieux et durable des communautés, particulièrement dans les
            villages et les zones rurales. Elle œuvre dans une approche fondée
            sur la solidarité, la dignité humaine, la participation communautaire
            et la valorisation des ressources locales.
          </p>
        </div>
      </section>

      <div className="wrap"><hr className="divider" /></div>

      <section className="section-tight two-col-wrap">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Base légale</p>
            <h2 style={{ fontSize: "1.5rem" }}>Reconnue par l'État congolais</h2>
          </div>
          <div>
            <p>
              La Fondation Kwetu Ni Kwetu exerce ses activités conformément à la
              législation en vigueur en République démocratique du Congo. Elle
              est reconnue par l'arrêté ministériel n° 276/CAB/ME/MIN/J&GS/2025
              du 10 mars 2025, qui lui accorde la personnalité juridique.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap"><hr className="divider" /></div>

      <section className="section-tight">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Notre objet</p>
            <h2 style={{ fontSize: "1.5rem" }}>Le développement intégral des villages</h2>
          </div>
          <div>
            <p>
              La Fondation a pour objet principal de contribuer au développement
              intégral des villages, à travers des initiatives sociales,
              économiques, éducatives, sanitaires, environnementales et
              communautaires. Elle privilégie une approche intégrée permettant
              de répondre aux besoins essentiels des populations tout en créant
              les conditions d'un développement durable.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap"><hr className="divider" /></div>

      <section>
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Notre mission</p>
            <h2 style={{ fontSize: "1.5rem" }}>Dix engagements envers les communautés</h2>
          </div>
          <div>
            <p style={{ maxWidth: "60ch" }}>
              Contribuer à l'amélioration des conditions de vie des populations
              rurales ; soutenir le développement économique et social des
              communautés ; promouvoir l'éducation et la formation
              professionnelle ; favoriser l'accès aux soins de santé et à
              l'hygiène ; soutenir l'agriculture et les activités génératrices
              de revenus ; promouvoir l'autonomisation des femmes et des jeunes ;
              contribuer à l'assainissement et à la protection de l'environnement
              ; encourager l'entrepreneuriat communautaire ; développer des
              infrastructures sociales de base ; favoriser la solidarité et la
              cohésion au sein des communautés.
            </p>
          </div>
        </div>
      </section>

      <section className="quote-strip">
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Notre vision</p>
          <blockquote>
            L'émergence de villages autonomes, prospères, solidaires et durables,
            dans lesquels chaque personne peut vivre dans la dignité et participer
            pleinement au développement de sa communauté.
          </blockquote>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Notre devise</p>
          <h2 style={{ maxWidth: "20ch" }}>Amour, Fraternité, Travail</h2>
        </div>
        <div className="wrap" style={{ marginTop: 20 }}>
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
    </>
  );
}
