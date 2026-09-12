export default function ProgressBar({
  funded,
  target,
  unit = "unités",
}: {
  funded: number;
  target: number;
  unit?: string;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((funded / target) * 100)) : 0;
  const complete = pct >= 100;

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>
          {funded} / {target} {unit}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${complete ? "complete" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
