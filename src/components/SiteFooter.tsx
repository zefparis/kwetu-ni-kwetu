import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site">
      <div className="footer-grid">
        <div>
          <h4>Fondation Kwetu Ni Kwetu</h4>
          <p>
            Fondation de droit congolais créée le 15 mai 2021, reconnue par
            l'arrêté ministériel n° 276/CAB/ME/MIN/J&GS/2025 du 10 mars 2025.
          </p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/mission">Mission & Vision</Link></li>
            <li><Link href="/domaines">Domaines d'intervention</Link></li>
            <li><Link href="/campagnes">Campagnes</Link></li>
            <li><Link href="/impact">Impact</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Siège social</h4>
          <p>
            Avenue Maman Sese n° 6A, Binza Pigeon,<br />
            Commune de Ngaliema, Kinshasa — RDC
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © {year} Fondation Kwetu Ni Kwetu — Amour, Fraternité, Travail
      </div>
    </footer>
  );
}
