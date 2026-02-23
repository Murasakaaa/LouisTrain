import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const clients = await Client.find({});
  return NextResponse.json(clients);
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await req.json();
    const newClient = await Client.create(body);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création", error },
      { status: 500 },
    );
  }
}
