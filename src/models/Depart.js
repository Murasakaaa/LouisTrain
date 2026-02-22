import mongoose from "mongoose";

// 1. Sous-schéma pour les options (plus propre)
const OptionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: mongoose.Schema.Types.Decimal128, required: true },
});

// 2. Schéma principal du Trajet
const DepartSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Tu utilises un ID personnalisé (DEP-2021...)
  train: {
    modele_train: { type: String, required: true },
    nb_places: { type: Number, required: true },
    nb_places_restantes: { type: Number, required: true },
  },
  gare_depart: { type: String, required: true },
  gare_arrivee: { type: String, required: true },
  date: { type: Date, required: true },
  heure_depart: { type: String, required: true },
  heure_arrivee: { type: String, required: true },
  prix: { type: mongoose.Schema.Types.Decimal128, required: true },
  options_disponibles: [OptionSchema], // Array de sous-documents
});

const Depart =
  mongoose.models.Depart || mongoose.model("Depart", DepartSchema, "departs");

export default Depart;
