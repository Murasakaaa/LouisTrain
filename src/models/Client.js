import mongoose from "mongoose";

// 1. Schéma pour les options d'un billet
const optionSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
});

// 2. Schéma pour un billet (Aller ou Retour)
const billetSchema = new mongoose.Schema({
  num_billet: String,
  sens: { type: String, enum: ["aller", "retour"] },
  depart_id: String, // Référence vers l'ID du trajet dans la collection Trains
  gare_depart: String,
  gare_arrivee: String,
  date: String, // Ou Date si tu préfères manipuler des objets Date
  heure_depart: String,
  heure_arrivee: String,
  options_choisies: [optionSchema],
  prix_billet: Number,
  prix_options: Number,
  prix_ttc: Number,
});

// 3. Schéma pour le paiement
const paiementSchema = new mongoose.Schema({
  titulaire_cb: String,
  num_cb_masque: String,
  num_autorisation: String,
  date_expiration: String,
});

// 4. Schéma pour une réservation
const reservationSchema = new mongoose.Schema({
  _id: String, // Si tu veux forcer ton propre ID (ex: R123456)
  date_reservation: { type: Date, default: Date.now },
  statut: String,
  reduction_appliquee: Number,
  prix_total: Number,
  voyage: [billetSchema], // Tableau de billets (Aller/Retour)
  paiement: paiementSchema,
});

// 5. Schéma principal : Le Client
const clientSchema = new mongoose.Schema({
  _id: String, // ex: "client_001"
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
  reservations: [reservationSchema], // Tableau de toutes les réservations du client
  demande_abo: {
    type: Boolean,
    default: "false",
  },
});

// Création du modèle
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
export default Client;
