"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Nous écrire</p>
          <h1 style={{ maxWidth: "16ch" }}>Parlons de votre village.</h1>
          <p className="lede">
            Une question, un partenariat, une communauté à accompagner : notre
            équipe vous répond.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap contact-grid">
          <div>
            <div className="info-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 21C12 21 19 14.5 19 9.5C19 5.4 15.6 2 11.5 2S4 5.4 4 9.5C4 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="11.5" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <div>
                <strong>Siège social</strong>
                <span>Avenue Maman Sese n° 6A, Binza Pigeon,<br />Commune de Ngaliema, Kinshasa — RDC</span>
              </div>
            </div>
            <div className="info-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 6L12 13L20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <div>
                <strong>Adresse e-mail</strong>
                <span>contact@kwetunikwetu.org <em style={{ opacity: 0.7 }}>(à confirmer)</em></span>
              </div>
            </div>
            <div className="info-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.6 10.8C8 13.6 10.4 16 13.2 17.4L15.4 15.2C15.7 14.9 16.1 14.8 16.5 14.9C17.7 15.3 19 15.5 20.3 15.5C20.9 15.5 21.3 16 21.3 16.5V20.3C21.3 20.9 20.9 21.3 20.3 21.3C10.7 21.3 3 13.6 3 4C3 3.5 3.5 3 4 3H7.8C8.4 3 8.8 3.5 8.8 4C8.8 5.3 9 6.6 9.4 7.8C9.5 8.2 9.4 8.6 9.1 8.9L6.6 10.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>Téléphone</strong>
                <span>+243 00 000 0000 <em style={{ opacity: 0.7 }}>(à confirmer)</em></span>
              </div>
            </div>
            <div className="map-note" style={{ marginTop: 24 }}>
              Un plan d'accès ou une carte du siège social pourra être intégré ici
              une fois les coordonnées confirmées.
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.target as HTMLFormElement).reset();
              setSent(true);
            }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="nom" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>Nom complet</label>
              <input id="nom" name="nom" type="text" required style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 3, background: "var(--panel)", fontFamily: "var(--sans)", fontSize: "1rem" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="email" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>Adresse e-mail</label>
              <input id="email" name="email" type="email" required style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 3, background: "var(--panel)", fontFamily: "var(--sans)", fontSize: "1rem" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="message" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>Message</label>
              <textarea id="message" name="message" rows={5} required style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 3, background: "var(--panel)", fontFamily: "var(--sans)", fontSize: "1rem", resize: "vertical" }} />
            </div>
            <button type="submit" className="btn" style={{ justifyContent: "center", border: "1px solid var(--amour)", cursor: "pointer" }}>
              Envoyer le message
            </button>
            {sent && (
              <p style={{ color: "var(--fraternite)", margin: 0, fontSize: ".9rem" }}>
                Merci, votre message a bien été noté.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
