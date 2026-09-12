import Link from "next/link";
import type { CampaignWithContributions } from "@/lib/data";
import { fundedQty, progressPercent } from "@/lib/data";
import ProgressBar from "./ProgressBar";

export default function CampaignCard({ campaign }: { campaign: CampaignWithContributions }) {
  const funded = fundedQty(campaign, campaign.unitPrice);
  const pct = progressPercent(campaign, campaign.unitPrice, campaign.targetQty);

  return (
    <Link href={`/campagnes/${campaign.id}`} className="campaign-card">
      <div className="meta">
        <span className="tag-pill">{campaign.productType}</span>
        <span className="tag-pill">{campaign.village}</span>
      </div>
      <h3>{campaign.title}</h3>
      <p className="desc">{campaign.description}</p>
      <ProgressBar funded={funded} target={campaign.targetQty} unit="unités" />
      <div className="progress-meta" style={{ marginTop: 10 }}>
        <span>{campaign.unitPrice} {campaign.currency} / unité</span>
        <span>{pct}% financé</span>
      </div>
    </Link>
  );
}
