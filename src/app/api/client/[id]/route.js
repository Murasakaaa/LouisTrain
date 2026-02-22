import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const client = await Client.findById(id);
  return NextResponse.json(client);
}
