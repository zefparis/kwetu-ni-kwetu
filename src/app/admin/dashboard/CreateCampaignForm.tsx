"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCampaignForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      productType: fd.get("productType"),
      unitPrice: Number(fd.get("unitPrice")),
      currency: fd.get("currency") || "USD",
      targetQty: Number(fd.get("targetQty")),
      village: fd.get("village"),
      illustration: fd.get("illustration") || null,
    };
    setLoading(true);
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      form.reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erreur lors de la création");
    }
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Titre de la campagne</label>
        <input id="title" name="title" type="text" required placeholder="Lampes solaires pour Mbankana" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} required placeholder="Décrivez le produit et le bénéfice pour le village…" />
      </div>
      <div className="row">
        <div>
          <label htmlFor="productType">Type de produit</label>
          <input id="productType" name="productType" type="text" required placeholder="Lampe solaire" />
        </div>
        <div>
          <label htmlFor="village">Village cible</label>
          <input id="village" name="village" type="text" required placeholder="Mbankana" />
        </div>
      </div>
      <div className="row">
        <div>
          <label htmlFor="unitPrice">Prix unitaire</label>
          <input id="unitPrice" name="unitPrice" type="number" min="0" step="0.01" required placeholder="15" />
        </div>
        <div>
          <label htmlFor="currency">Devise</label>
          <select id="currency" name="currency" defaultValue="USD">
            <option value="USD">USD</option>
            <option value="CDF">CDF</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="targetQty">Quantité cible</label>
        <input id="targetQty" name="targetQty" type="number" min="1" required placeholder="200" />
      </div>
      <div>
        <label htmlFor="illustration">Illustration (URL, optionnel)</label>
        <input id="illustration" name="illustration" type="text" placeholder="https://…" />
      </div>
      <button type="submit" className="btn" style={{ justifyContent: "center" }} disabled={loading}>
        {loading ? "Création…" : "Créer la campagne"}
      </button>
      {error && <p className="admin-error">{error}</p>}
    </form>
  );
}
