import { connectDB } from "@/lib/db";
import Depart from "@/models/Depart";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();

  try {
    const searchParams = request.nextUrl.searchParams;

    const depart = searchParams.get("depart");
    const arrivee = searchParams.get("arrivee");
    const dateDepart = searchParams.get("date_depart");
    const dateRetour = searchParams.get("date_retour");

    const buildDateFilter = (dateString) => {
      if (!dateString) return null;

      const start = new Date(dateString);
      const end = new Date(dateString);
      end.setHours(23, 59, 59, 999);

      return { $gte: start, $lte: end };
    };

    const allerFilters = {};

    if (depart) allerFilters.gare_depart = depart;
    if (arrivee) allerFilters.gare_arrivee = arrivee;
    if (dateDepart) allerFilters.date = buildDateFilter(dateDepart);

    let retourFilters = null;

    if (dateRetour && depart && arrivee) {
      retourFilters = {
        gare_depart: arrivee,
        gare_arrivee: depart,
        date: buildDateFilter(dateRetour),
      };
    }

    const [aller, retour] = await Promise.all([
      Depart.find(allerFilters),
      retourFilters ? Depart.find(retourFilters) : Promise.resolve([]),
    ]);

    return NextResponse.json({ aller, retour });
  } catch (error) {
    console.error("Erreur API :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
