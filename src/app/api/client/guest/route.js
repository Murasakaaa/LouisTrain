import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nom, prenom, email, reservation } = await req.json();

    await connectDB();

    await Client.create({
      _id: `GUEST-${reservation._id}`,
      nom,
      prenom,
      email,
      reservations: [reservation],
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Erreur POST /api/client/guest :", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}