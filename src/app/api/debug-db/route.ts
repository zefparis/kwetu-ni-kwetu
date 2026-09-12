import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Route de debug temporaire — capture l'erreur Prisma exacte en prod.
// Sera supprimée après diagnostic.
export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  const directUrl = process.env.DIRECT_URL ?? "";

  // Afficher les variables (sans le mot de passe)
  const safeDbUrl = dbUrl.replace(/:[^:@]+@/, ":***@");
  const safeDirectUrl = directUrl.replace(/:[^:@]+@/, ":***@");

  const info: Record<string, unknown> = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_present: !!dbUrl,
    DATABASE_URL_safe: safeDbUrl,
    DATABASE_URL_port: (() => {
      try { return new URL(dbUrl.replace("?pgbouncer=true", "")).port; } catch { return "parse_error"; }
    })(),
    DIRECT_URL_present: !!directUrl,
    DIRECT_URL_safe: safeDirectUrl,
    DIRECT_URL_port: (() => {
      try { return new URL(directUrl).port; } catch { return "parse_error"; }
    })(),
  };

  // Tenter une vraie requête Prisma
  try {
    const prisma = new PrismaClient();
    const count = await prisma.campaign.count();
    await prisma.$disconnect();
    return NextResponse.json({ ...info, db_ok: true, campaign_count: count });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ...info,
        db_ok: false,
        error: message,
        error_name: err instanceof Error ? err.constructor.name : typeof err,
      },
      { status: 500 },
    );
  }
}
