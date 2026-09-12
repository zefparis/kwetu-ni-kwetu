"use client";

export default function RefreshButton() {
  return (
    <button className="btn" onClick={() => window.location.reload()}>
      Actualiser le statut
    </button>
  );
}
