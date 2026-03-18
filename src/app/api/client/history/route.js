import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await decrypt(sessionCookie);
    if (!payload?.userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();
    const client = await Client.findById(payload.userId).lean();

    if (!client) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        abonnement: client.abonnement ?? null,
        reservations: client.reservations ?? [],
      },
    });

  } catch (error) {
    console.error("Erreur GET /api/client/current :", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}