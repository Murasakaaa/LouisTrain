import { connectDB } from "../../../../lib/db";
import Client from "../../../../models/Client";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const clients = await Client.find({
    demande_abo: true,
  });

  return NextResponse.json(clients);
}

export async function POST(request) {
  await connectDB();

  try {
    const { email, num_carte } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    const updatedClient = await Client.findOneAndUpdate(
      { email: email.trim()},
      {
        $set: {
          demande_abo: false, // Regroupé ici
          "abonnement.num_carte": num_carte,
          "abonnement.code_reduction": "FIDELITE10",
          "abonnement.montant_reduction": 10,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 },
    );
  }
}
