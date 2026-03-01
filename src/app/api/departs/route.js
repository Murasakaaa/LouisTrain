import { connectDB } from "../../../lib/db";
import Depart from "../../../models/Depart";
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

    // --- FILTRES ALLER ---
    const allerFilters = {};

    // Utilisation de $regex pour le "LIKE %...%"
    if (depart) {
      allerFilters.gare_depart = { $regex: depart, $options: "i" };
    }
    if (arrivee) {
      allerFilters.gare_arrivee = { $regex: arrivee, $options: "i" };
    }
    if (dateDepart) {
      allerFilters.date = buildDateFilter(dateDepart);
    }

    // --- FILTRES RETOUR ---
    let retourFilters = null;
    if (dateRetour && depart && arrivee) {
      retourFilters = {
        // Inversion des gares avec regex également
        gare_depart: { $regex: arrivee, $options: "i" },
        gare_arrivee: { $regex: depart, $options: "i" },
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