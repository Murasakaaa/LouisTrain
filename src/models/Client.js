import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
});

const billetSchema = new mongoose.Schema({
  num_billet: String,
  sens: { type: String, enum: ["aller", "retour"] },
  depart_id: String,
  gare_depart: String,
  gare_arrivee: String,
  date: Date,
  heure_depart: String,
  heure_arrivee: String,
  options_choisies: [optionSchema],
  prix_billet: Number,
  prix_options: Number,
  prix_ttc: Number,
});

const paiementSchema = new mongoose.Schema({
  titulaire_cb: String,
  num_cb_masque: String,
  num_autorisation: String,
  date_expiration: String,
});

const reservationSchema = new mongoose.Schema({
  _id: String,
  date_reservation: { type: Date, default: Date.now },
  statut: String,
  reduction_appliquee: Number,
  prix_total: Number,
  voyage: [billetSchema],
  paiement: paiementSchema,
});

const clientSchema = new mongoose.Schema({
  _id: String,
  civilite: String,
  nom: String,
  prenom: String,
  telephone: String,
  email: { type: String, required: true },
  date_creation: { type: String, default: "2023-01-01" },
  abonnement: {
    num_carte: String,
    code_reduction: String,
    montant_reduction: Number,
  },
  reservations: [reservationSchema],
  demande_abo: {
    type: Boolean,
    default: "false",
  },
});

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
export default Client;
