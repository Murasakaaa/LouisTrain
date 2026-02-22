import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const clients = await Client.find({});
  return NextResponse.json(clients);
}
