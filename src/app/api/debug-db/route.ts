import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Route de debug temporaire — tente une vraie requête Prisma en prod.
export async function GET() {
  try {
    const prisma = new PrismaClient();
    const count = await prisma.campaign.count();
    await prisma.$disconnect();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        name: err instanceof Error ? err.constructor.name : typeof err,
        DATABASE_URL_set: !!process.env.DATABASE_URL,
        DATABASE_URL_port: (() => {
          try {
            const u = new URL((process.env.DATABASE_URL ?? "").replace("?pgbouncer=true", ""));
            return u.port;
          } catch { return "parse_error"; }
        })(),
      },
      { status: 500 },
    );
  }
}
