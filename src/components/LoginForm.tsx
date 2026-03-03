"use client";

import Button from "./commons/Button.js";
import Input from "./commons/Input.js";
import { useFormStatus } from "react-dom";
import "../style/components/LoginForm.css";
import { useActionState, useState } from "react";
import { login } from "../app/login/action";

export default function LoginForm({ redirectTo = "/" }) {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form action={loginAction} className="login-form-container">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <h1 className="title">Vous possédez déjà un compte ?</h1>

      <div className="input-container">
        <div>
          <Input
            type="text"
            name="email"
            placeholder="Adresse e-mail" format={undefined} onChange={undefined}          />
          {state?.errors?.email && (
            <p className="errorMsg">{state.errors.email}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe" format={undefined} onChange={undefined}          />
          {state?.errors?.password && (
            <p className="error-message" style={{ color: "red" }}>
              {state.errors.password}
            </p>
          )}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      text="Connexion"
      onClick={undefined}
      id="login-btn"
      style={undefined}
      disabled={pending}
    />
  );
}
