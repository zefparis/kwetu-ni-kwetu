"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Operator = "orange" | "airtel" | "afrimoney";
type Currency = "CDF" | "USD";

export default function ContributeForm({
  campaignId,
  unitPrice,
  currency: campaignCurrency,
  targetQty,
  fundedQty: funded,
}: {
  campaignId: string;
  unitPrice: number;
  currency: string;
  targetQty: number;
  fundedQty: number;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [currency, setCurrency] = useState<Currency>(
    campaignCurrency === "CDF" ? "CDF" : "USD",
  );
  const [operator, setOperator] = useState<Operator>("orange");
  const [phone, setPhone] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = Math.max(0, targetQty - funded);
  const amount = Math.round(qty * unitPrice * 100) / 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          quantity: qty,
          currency,
          operator,
          phone,
          donorName: donorName || undefined,
          donorEmail: donorEmail || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'initiation du paiement");
        setLoading(false);
        return;
      }

      // Rediriger vers la page de statut de la contribution
      router.push(`/contribuer/${data.contributionId}/statut`);
    } catch {
      setError("Erreur réseau — réessayez");
      setLoading(false);
    }
  }

  return (
    <div className="summary-card">
      <div className="stat">
        <strong>{unitPrice} {campaignCurrency}</strong>
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

      <form className="contrib-form" onSubmit={handleSubmit}>
        <label htmlFor="qty">Nombre d'unités à financer</label>
        <input
          id="qty"
          type="number"
          min={1}
          max={remaining > 0 ? remaining : 1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          required
          disabled={remaining <= 0}
        />

        <label htmlFor="currency">Devise de paiement</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          disabled={remaining <= 0}
        >
          <option value="USD">USD ($)</option>
          <option value="CDF">CDF (Franc congolais)</option>
        </select>

        <label htmlFor="operator">Opérateur Mobile Money</label>
        <select
          id="operator"
          value={operator}
          onChange={(e) => setOperator(e.target.value as Operator)}
          disabled={remaining <= 0}
        >
          <option value="orange">Orange Money</option>
          <option value="airtel">Airtel Money</option>
          <option value="afrimoney">Afrimoney</option>
        </select>

        <label htmlFor="phone">Numéro Mobile Money</label>
        <input
          id="phone"
          type="tel"
          placeholder="+243XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={remaining <= 0}
        />

        <label htmlFor="name">Votre nom (optionnel)</label>
        <input
          id="name"
          type="text"
          placeholder="Anonyme"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          disabled={remaining <= 0}
        />

        <label htmlFor="email">Votre e-mail (optionnel)</label>
        <input
          id="email"
          type="email"
          placeholder="pour recevoir la preuve de livraison"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          disabled={remaining <= 0}
        />

        <div style={{ fontSize: ".95rem", color: "var(--ink)", fontWeight: 600 }}>
          Total : {amount} {currency}
        </div>

        <button
          type="submit"
          className="btn"
          style={{ justifyContent: "center" }}
          disabled={remaining <= 0 || loading}
        >
          {remaining <= 0
            ? "Objectif atteint"
            : loading
              ? "Initiation du paiement…"
              : "Contribuer"}
        </button>
      </form>

      {error && <p className="admin-error" style={{ marginTop: 8 }}>{error}</p>}

      <div className="contrib-notice" style={{ marginTop: 12 }}>
        Paiement via Mobile Money (UniPay). Vous recevrez un prompt USSD sur
        votre téléphone pour confirmer la transaction.
      </div>
    </div>
  );
}
