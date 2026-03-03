'use client';
import { useRouter } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import "../../style/login&register.css";


import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (
    <div className="login-page">
      <LoginForm redirectTo={redirectTo} />
      <p className="register-link">Créer un compte</p>
    </div>
  );
}
