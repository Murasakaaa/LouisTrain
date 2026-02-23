import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const client = await Client.findById(id);
  return NextResponse.json(client);
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    await Client.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Client supprimé" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la suppression", error },
      { status: 500 },
    );
  }
}
