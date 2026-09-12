"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Mot de passe incorrect");
    }
  }

  return (
    <div className="admin-login">
      <p className="eyebrow">Espace gestion</p>
      <h1>Administration</h1>
      <p style={{ fontSize: ".9rem" }}>
        Accès réservé à la Fondation pour créer et gérer les campagnes.
      </p>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
        <button type="submit" className="btn" style={{ justifyContent: "center" }} disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        {error && <p className="admin-error">{error}</p>}
      </form>
    </div>
  );
}
