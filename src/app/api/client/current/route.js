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
      },
    });
  } catch (error) {
    console.error("Erreur GET /api/client/current :", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const payload = await decrypt(sessionCookie);
    if (!payload?.userId) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { reservations } = await req.json();
    console.log("Reservations reçues :", JSON.stringify(reservations, null, 2));

    if (!reservations || !Array.isArray(reservations)) {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    await connectDB();

    await Client.findByIdAndUpdate(payload.userId, {
      $push: {
        reservations: { $each: reservations },
      },
    });

    return NextResponse.json({ message: "Réservations ajoutées" }, { status: 200 });

  } catch (error) {
    console.error("Erreur PATCH /api/client/current :", error.message);
    console.error("Détail validation :", JSON.stringify(error.errors, null, 2));
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}