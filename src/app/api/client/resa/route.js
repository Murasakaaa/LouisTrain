import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { mail, numResa } = await req.json();

    if (!mail || !numResa) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await connectDB();

    const client = await Client.findOne({
      email: mail,
      "reservations._id": numResa,
    }).lean();

    if (client) {
      const reservation = client.reservations.find(r => r._id === numResa);

      return NextResponse.json({
        ok: true,
        found: true,
        reservation,
        client: { nom: client.nom, prenom: client.prenom },
      });
    }

    return NextResponse.json({ ok: true, found: false });

  } catch (error) {
    console.error("Erreur POST /api/client/resa :", error);
    return NextResponse.json({ ok: true, found: false });
  }
}