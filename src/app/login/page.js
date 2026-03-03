'use client';
import { useRouter } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import "../../style/login&register.css";

export default function LoginPage({ searchParams }) {
  const route = useRouter();
  return (
    <div className="login-page">
      <LoginForm redirectTo={searchParams?.redirectTo || "/"}  />
      <p className="register-link">Créer un compte</p>
    </div>
  );
}
