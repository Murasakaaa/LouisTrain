// fichier de connexion à mongoDB grâce à mongoose (comme le fichier connexion.inc.php).

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// affiche certaines choses que quand on utilise npm run dev
const isDev = process.env.NODE_ENV === "development";

if (!MONGODB_URI) {
  throw new Error(
    "Veuillez définir la variable MONGODB_URI dans le fichier .env.local",
  );
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    if (isDev) {
      console.log("🚀 Connecté à MongoDB (bdd LouisTrain)");
    }
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
  }
};
