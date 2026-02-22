import { connectDB } from "@/lib/db";
import Depart from "@/models/Depart";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const departs = await Depart.find({});
  return NextResponse.json(departs);
}
