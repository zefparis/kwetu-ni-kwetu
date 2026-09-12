import { prisma } from "./prisma";
import type { Campaign, Contribution } from "@prisma/client";

export type CampaignWithContributions = Campaign & {
  contributions: Contribution[];
};

/**
 * Calcule la quantité financée d'une campagne à partir des contributions
 * dont le paiement est confirmé.
 */
export function fundedQty(campaign: { contributions: { amount: number; status: string }[] }, unitPrice: number): number {
  if (!unitPrice || unitPrice <= 0) return 0;
  const total = campaign.contributions
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.amount, 0);
  return Math.floor(total / unitPrice);
}

export function progressPercent(campaign: { contributions: { amount: number; status: string }[] }, unitPrice: number, targetQty: number): number {
  if (targetQty <= 0) return 0;
  return Math.min(100, Math.round((fundedQty(campaign, unitPrice) / targetQty) * 100));
}

export async function getActiveCampaigns(): Promise<CampaignWithContributions[]> {
  return prisma.campaign.findMany({
    where: { status: "active" },
    include: { contributions: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDeliveredCampaigns(): Promise<CampaignWithContributions[]> {
  return prisma.campaign.findMany({
    where: { status: "delivered" },
    include: { contributions: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCampaignById(id: string): Promise<CampaignWithContributions | null> {
  return prisma.campaign.findUnique({
    where: { id },
    include: { contributions: true },
  });
}

export async function getAllCampaigns(): Promise<CampaignWithContributions[]> {
  return prisma.campaign.findMany({
    include: { contributions: true },
    orderBy: { createdAt: "desc" },
  });
}

/** Liste distincte des villages et types de produits (pour les filtres). */
export async function getFilterOptions() {
  const [villages, productTypes] = await Promise.all([
    prisma.campaign.findMany({ where: { status: "active" }, select: { village: true }, distinct: ["village"] }),
    prisma.campaign.findMany({ where: { status: "active" }, select: { productType: true }, distinct: ["productType"] }),
  ]);
  return {
    villages: villages.map((v) => v.village),
    productTypes: productTypes.map((p) => p.productType),
  };
}
