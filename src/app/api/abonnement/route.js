import { connectDB } from "../../../lib/db";
import Client from "../../../models/Client";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const clients = await Client.find({
    demande_abo: false,
    "abonnement.num_carte": { $ne: null },
  });

  return NextResponse.json(clients);
}

export async function DELETE(request) {
  await connectDB();
  
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    const updatedClient = await Client.findOneAndUpdate(
      { email: email.trim() },
      {
        $set: {
          abonnement: {},
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

    return NextResponse.json({
      message: "Abonnement supprimé avec succès",
      client: updatedClient,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 },
    );
  }
}
