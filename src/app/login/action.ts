"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { connectDB } from "../../lib/db";
import Auth, { IAuth } from "../../models/Auth";
import { createSession, deleteSession } from "../../lib/session";

// schéma de validation des inputs
const loginSchema = z.object({
  email: z.string().email({ message: "Format d'email invalide" }).trim(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit faire au moins 8 caractères" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  // on vérifie d'abord que le FormData respecte bien le format établi dans le schéma
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email: emailInput, password: passwordInput } = result.data;

  try {
    await connectDB();

    // on fetch le user dans la BDD
    // ------------------------------------------------------- remplacer client par auth ici
    const authRecord = await Auth.findOne({ login: emailInput });

    // console.log("authRecord trouvé :", authRecord);
    // console.log("passwordInput :", passwordInput);
    // console.log("authRecord.pwd :", authRecord?.pwd);
    // console.log("Égalité :", passwordInput === authRecord?.pwd);
    // console.log("emailInput repr:", JSON.stringify(emailInput));
    // console.log("Collection utilisée :", Auth.collection.name);

    // comparaison entre le mdp de la BDD et le mdp dans l'input.
    // On vérifie l'existence ET le mot de passe en même temps.
    // Si l'un des deux échoue, on renvoie la même erreur générique.
    if (!authRecord || passwordInput !== authRecord.pwd) {
      return {
        errors: { email: ["Identifiants incorrects."] },
      };
    }
    // remplacer par un truc de chiffrement ici si le mdp est chiffré (avec Bcrypt)

    await createSession(authRecord.client_id); // appel de la fonction du fichier session.ts
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;
    console.error("Erreur technique lors du login:", error);
    return {
      errors: { email: ["Une erreur technique est survenue."] },
    };
  }

  // redirection (à changer en mettant la dernière page d'où le client vient , pour l'instant cest la page d'accueil)
  if (emailInput === "dupont.jean@test.com") {
    redirect("/admin");
  } else {
    const redirectTo = (formData.get("redirectTo") as string) || "/";
    redirect(redirectTo);
  }
}

// suppression de la session et redirection
export async function logout() {
  await deleteSession();
  redirect("/");
}
