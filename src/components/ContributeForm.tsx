"use client";

import { useState } from "react";

export default function ContributeForm({
  unitPrice,
  currency,
  targetQty,
  fundedQty: funded,
}: {
  unitPrice: number;
  currency: string;
  targetQty: number;
  fundedQty: number;
}) {
  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const remaining = Math.max(0, targetQty - funded);
  const amount = qty * unitPrice;

  return (
    <div className="summary-card">
      <div className="stat">
        <strong>{unitPrice} {currency}</strong>
        <span>prix unitaire</span>
      </div>
      <div className="stat">
        <strong>{funded} / {targetQty}</strong>
        <span>unités financées</span>
      </div>
      <div className="stat">
        <strong>{remaining}</strong>
        <span>unités restantes</span>
      </div>

      <form
        className="contrib-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <label htmlFor="qty">Nombre d'unités à financer</label>
        <input
          id="qty"
          type="number"
          min={1}
          max={remaining > 0 ? remaining : 1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        />
        <label htmlFor="name">Votre nom (optionnel)</label>
        <input id="name" type="text" placeholder="Anonyme" />
        <label htmlFor="email">Votre e-mail (optionnel)</label>
        <input id="email" type="email" placeholder="pour recevoir la preuve de livraison" />
        <div style={{ fontSize: ".95rem", color: "var(--ink)", fontWeight: 600 }}>
          Total : {amount} {currency}
        </div>
        <button type="submit" className="btn" style={{ justifyContent: "center" }} disabled={remaining <= 0}>
          {remaining <= 0 ? "Objectif atteint" : "Contribuer"}
        </button>
      </form>

      {submitted && (
        <div className="contrib-notice">
          Merci ! Le paiement en ligne via UniPay sera disponible prochainement.
          Votre contribution de {amount} {currency} sera enregistrée dès que le
          système de paiement sera branché. Aucun paiement n'a été effectué.
        </div>
      )}

      <div className="contrib-notice" style={{ marginTop: 12 }}>
        Le système de paiement est en cours d'intégration. Ce formulaire est un
        aperçu — aucune transaction n'est réellement déclenchée.
      </div>
    </div>
  );
}
