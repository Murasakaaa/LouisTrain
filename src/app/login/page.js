"use client";
import LoginForm from "../../components/LoginForm";
import "../../style/login&register.css";

import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (
    <div className="login-page">
      <LoginForm redirectTo={redirectTo} />
      <p className="register-link" onClick={() => router.replace("/register")}>
        Créer un compte
      </p>
    </div>
  );
}
