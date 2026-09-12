import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    title,
    description,
    productType,
    unitPrice,
    currency,
    targetQty,
    village,
    illustration,
  } = body;

  if (
    !title || !description || !productType || !village ||
    typeof unitPrice !== "number" || unitPrice <= 0 ||
    typeof targetQty !== "number" || targetQty <= 0
  ) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants ou invalides" },
      { status: 400 },
    );
  }

  const campaign = await prisma.campaign.create({
    data: {
      title: String(title),
      description: String(description),
      productType: String(productType),
      unitPrice: Number(unitPrice),
      currency: currency ? String(currency) : "USD",
      targetQty: Number(targetQty),
      village: String(village),
      illustration: illustration ? String(illustration) : null,
      status: "active",
    },
  });

  return NextResponse.json({ ok: true, id: campaign.id }, { status: 201 });
}
