"use client";

import Button from "./commons/Button.js";
import Input from "./commons/Input.js";
import { useFormStatus } from "react-dom";
import "../style/components/RegisterForm.css";
import { useActionState } from "react";
import { register } from "../app/register/action";

export default function RegisterForm() {
  const [state, registerAction] = useActionState(register, undefined);

  return (
    <form action={registerAction} className="register-form-container">
      <h1 className="title">Créer un compte</h1>

      <div className="input-container">
        {/* Civilité */}
        <div>
          <div className="civilite-container">
            <label>
              <input type="radio" name="civilite" value="M." defaultChecked />
              M.
            </label>
            <label>
              <input type="radio" name="civilite" value="Mme" />
              Mme
            </label>
          </div>
          {state?.errors?.civilite && (
            <p className="errorMsg">{state.errors.civilite}</p>
          )}
        </div>

        <div className="name-container">
          {/* Prénom */}
          <div>
            <Input
              type="text"
              name="prenom"
              placeholder="Prénom"
              format={undefined}
              onChange={undefined}
            />
            {state?.errors?.prenom && (
              <p className="errorMsg">{state.errors.prenom}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <Input
              type="text"
              name="nom"
              placeholder="Nom"
              format={undefined}
              onChange={undefined}
            />
            {state?.errors?.nom && (
              <p className="errorMsg">{state.errors.nom}</p>
            )}
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <Input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            format={undefined}
            onChange={undefined}
          />
          {state?.errors?.telephone && (
            <p className="errorMsg">{state.errors.telephone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input
            type="text"
            name="email"
            placeholder="Adresse e-mail"
            format={undefined}
            onChange={undefined}
          />
          {state?.errors?.email && (
            <p className="errorMsg">{state.errors.email}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            format={undefined}
            onChange={undefined}
          />
          {state?.errors?.password && (
            <p className="errorMsg">{state.errors.password}</p>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            format={undefined}
            onChange={undefined}
          />
          {state?.errors?.confirmPassword && (
            <p className="errorMsg">{state.errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Demande d'abonnement */}
      <div className="abo-container">
        <label className="abo-label">
          <input type="checkbox" name="demande_abo" value="true" />
          Je souhaite souscrire à un abonnement
        </label>
      </div>

      {/* Erreur générale (ex: email déjà utilisé) */}
      {state?.errors?.general && (
        <p className="errorMsg">{state.errors.general}</p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      text="S'inscrire"
      onClick={undefined}
      id="register-btn"
      style={undefined}
      disabled={pending}
    />
  );
}
