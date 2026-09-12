import { NextResponse } from "next/server";

// Route de debug temporaire — à supprimer après diagnostic.
// Vérifie quelles variables d'environnement sont disponibles au runtime.
export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  return NextResponse.json({
    DATABASE_URL_set: !!dbUrl,
    DATABASE_URL_prefix: dbUrl ? dbUrl.substring(0, 50) + "..." : null,
    DATABASE_URL_port: dbUrl ? new URL(dbUrl.replace("?pgbouncer=true", "")).port : null,
    DATABASE_URL_has_pgbouncer: dbUrl ? dbUrl.includes("pgbouncer=true") : false,
    DIRECT_URL_set: !!directUrl,
    DIRECT_URL_port: directUrl ? new URL(directUrl).port : null,
    NODE_ENV: process.env.NODE_ENV,
    UNIPAY_API_URL_set: !!process.env.UNIPAY_API_URL,
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
  });
}
