import { connectDB } from "../../../lib/db";
import Depart from "../../../models/Depart";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();

  try {
    const searchParams = request.nextUrl.searchParams;

    const depart     = searchParams.get("depart");
    const arrivee    = searchParams.get("arrivee");
    const dateDepart = searchParams.get("date_depart");
    const dateRetour = searchParams.get("date_retour");

    const buildDateFilter = (dateString) => {
      if (!dateString) return null;
      const start = new Date(dateString);
      const end   = new Date(dateString);
      end.setHours(23, 59, 59, 999);
      return { $gte: start, $lte: end };
    };

    const allerFilters = {};
    if (depart)     allerFilters.gare_depart  = { $regex: depart,  $options: "i" };
    if (arrivee)    allerFilters.gare_arrivee = { $regex: arrivee, $options: "i" };
    if (dateDepart) allerFilters.date         = buildDateFilter(dateDepart);

    let retourFilters = null;
    if (dateRetour && depart && arrivee) {
      retourFilters = {
        gare_depart:  { $regex: arrivee, $options: "i" },
        gare_arrivee: { $regex: depart,  $options: "i" },
        date:         buildDateFilter(dateRetour),
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

export async function PATCH(req) {
  try {
    await connectDB();
    const { departIds } = await req.json();

    if (!departIds?.length) {
      return NextResponse.json({ error: "departIds requis" }, { status: 400 });
    }

    for (const id of departIds) {
      const depart = await Depart.findById(id);
      if (!depart) continue;
      if (depart.train.nb_places_restantes <= 0) {
        return NextResponse.json(
          { error: `Plus de places disponibles pour le trajet ${id}` },
          { status: 409 }
        );
      }
      depart.train.nb_places_restantes -= 1;
      await depart.save();
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}