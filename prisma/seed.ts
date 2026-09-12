import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Nettoyage
  await prisma.contribution.deleteMany();
  await prisma.campaign.deleteMany();

  const now = new Date();

  // --- Campagne 1 : Lampes solaires (active, partiellement financée) ---
  const c1 = await prisma.campaign.create({
    data: {
      title: "Lampes solaires pour Mbankana",
      description:
        "200 lampes solaires pour éclairer les foyers du village de Mbankana, sans accès au réseau électrique. Chaque lampe permet à une famille de s'éclairer le soir, aux enfants d'étudier et aux artisans de travailler après la tombée de la nuit.",
      productType: "Lampe solaire",
      unitPrice: 15,
      currency: "USD",
      targetQty: 200,
      village: "Mbankana",
      status: "active",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12),
    },
  });
  // 60 lampes déjà financées (60 × 15 = 900 USD)
  await prisma.contribution.createMany({
    data: [
      { campaignId: c1.id, amount: 300, currency: "USD", donorName: "Diaspora — Bruxelles", donorEmail: null, status: "completed", createdAt: new Date(now.getTime() - 86400000 * 10) },
      { campaignId: c1.id, amount: 150, currency: "USD", donorName: "Anonyme", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 7) },
      { campaignId: c1.id, amount: 450, currency: "USD", donorName: "Famille Kabasele", donorEmail: "kabasele@example.org", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 3) },
    ],
  });

  // --- Campagne 2 : Bassines (active, peu financée) ---
  const c2 = await prisma.campaign.create({
    data: {
      title: "Bassines pour le stockage d'eau à Kimwenza",
      description:
        "50 bassines de grande capacité pour le stockage et le transport de l'eau potable à Kimwenza. Ces bassines réduisent le nombre de trajets quotidiens vers le point d'eau et améliorent l'hygiène des familles.",
      productType: "Bassine",
      unitPrice: 8,
      currency: "USD",
      targetQty: 50,
      village: "Kimwenza",
      status: "active",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
    },
  });
  // 10 bassines financées (10 × 8 = 80 USD)
  await prisma.contribution.createMany({
    data: [
      { campaignId: c2.id, amount: 40, currency: "USD", donorName: "Anonyme", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 4) },
      { campaignId: c2.id, amount: 40, currency: "USD", donorName: "Collectif des femmes de Kimwenza", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 1) },
    ],
  });

  // --- Campagne 3 : Moustiquaires (active, bientôt financée) ---
  const c3 = await prisma.campaign.create({
    data: {
      title: "Moustiquaires imprégnées pour Maluku",
      description:
        "300 moustiquaires imprégnées pour protéger les familles de Maluku contre le paludisme, première cause de mortalité infantile dans la zone. Chaque moustiquaire protège un lit familial pendant plusieurs années.",
      productType: "Moustiquaire",
      unitPrice: 5,
      currency: "USD",
      targetQty: 300,
      village: "Maluku",
      status: "active",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20),
    },
  });
  // 270 moustiquaires financées (270 × 5 = 1350 USD)
  await prisma.contribution.createMany({
    data: [
      { campaignId: c3.id, amount: 750, currency: "USD", donorName: "Diaspora — Toronto", donorEmail: "toronto@example.org", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 18) },
      { campaignId: c3.id, amount: 600, currency: "USD", donorName: "Anonyme", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 5) },
    ],
  });

  // --- Campagne 4 : Livrée (preuve de livraison) ---
  const c4 = await prisma.campaign.create({
    data: {
      title: "Bassines pour le stockage d'eau à Kimwenza",
      description:
        "50 bassines de grande capacité pour le stockage et le transport de l'eau potable à Kimwenza. Ces bassines réduisent le nombre de trajets quotidiens vers le point d'eau et améliorent l'hygiène des familles.",
      productType: "Bassine",
      unitPrice: 8,
      currency: "USD",
      targetQty: 50,
      village: "Kimwenza",
      status: "delivered",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
    },
  });
  // 50 bassines financées (50 × 8 = 400 USD)
  await prisma.contribution.createMany({
    data: [
      { campaignId: c4.id, amount: 200, currency: "USD", donorName: "Diaspora — Paris", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 58) },
      { campaignId: c4.id, amount: 200, currency: "USD", donorName: "Anonyme", status: "completed", createdAt: new Date(now.getTime() - 86400000 * 55) },
    ],
  });

  console.log("Seed terminé : 4 campagnes (3 actives + 1 livrée) avec contributions.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
