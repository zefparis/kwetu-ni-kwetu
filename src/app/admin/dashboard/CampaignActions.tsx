"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CampaignActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(newStatus: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="actions">
      {status !== "completed" && status !== "delivered" && (
        <button
          className="btn ghost"
          style={{ padding: "6px 14px", fontSize: ".82rem" }}
          disabled={loading}
          onClick={() => update("completed")}
        >
          Marquer financée
        </button>
      )}
      {status !== "delivered" && (
        <button
          className="btn fraternite"
          style={{ padding: "6px 14px", fontSize: ".82rem" }}
          disabled={loading}
          onClick={() => update("delivered")}
        >
          Marquer livrée
        </button>
      )}
      {status === "delivered" && (
        <button
          className="btn ghost"
          style={{ padding: "6px 14px", fontSize: ".82rem" }}
          disabled={loading}
          onClick={() => update("active")}
        >
          Rouvrir
        </button>
      )}
    </div>
  );
}
