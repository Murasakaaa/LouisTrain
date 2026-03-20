"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../../lib/db";
import Auth from "@/models/Auth";
import Client from "@/models/Client";

type RegisterState =
  | {
      errors?: {
        civilite?: string;
        prenom?: string;
        nom?: string;
        email?: string;
        telephone?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
      };
    }
  | undefined;

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const civilite = formData.get("civilite") as string;
  const prenom = formData.get("prenom") as string;
  const nom = formData.get("nom") as string;
  const email = formData.get("email") as string;
  const telephone = formData.get("telephone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Checkbox non cochée = absente du FormData → false
  const demande_abo = formData.get("demande_abo") === "true";

  // --- Validation ---
  const errors: RegisterState["errors"] = {};

  if (!prenom || prenom.trim() === "") {
    errors.prenom = "Le prénom est requis.";
  }

  if (!nom || nom.trim() === "") {
    errors.nom = "Le nom est requis.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Adresse e-mail invalide.";
  }

  if (!telephone || !/^(\+?\d[\d\s\-().]{7,})$/.test(telephone)) {
    errors.telephone = "Numéro de téléphone invalide.";
  }

  if (!password || password.length < 8) {
    errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // --- Insertion en BDD ---
  try {
    await connectDB();

    // Vérifie si le login (email) est déjà utilisé
    const existingAuth = await Auth.findOne({ login: email });
    if (existingAuth) {
      return { errors: { email: "Cette adresse e-mail est déjà utilisée." } };
    }

    const clientId = uuidv4();
    const authId = uuidv4();

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du document Client
    await Client.create({
      _id: clientId,
      civilite,
      nom: nom.trim(),
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      email: email.toLowerCase().trim(),
      date_creation: new Date().toISOString().split("T")[0],
      demande_abo,
      abonnement: {
        num_carte: null,
        code_reduction: null,
        montant_reduction: null,
      },
    });

    // Création du document Auth
    await Auth.create({
      _id: authId,
      client_id: clientId,
      login: email.toLowerCase().trim(),
      pwd: hashedPassword,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return { errors: { email: "Cette adresse e-mail est déjà utilisée." } };
    }
    console.error("Erreur lors de l'inscription :", error);
    return {
      errors: {
        general: "Une erreur est survenue. Veuillez réessayer.",
      },
    };
  }

  // Redirige vers la page de connexion après inscription réussie
  redirect("/login");
}
