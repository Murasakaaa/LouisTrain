"use client";
import RegisterForm from "../../components/RegisterForm";
import "../../style/login&register.css";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    return (
        <div className="login-page">
            <RegisterForm />
            <p className="register-link" onClick={() => router.replace("/login")}>
                Se connecter
            </p>
        </div>
    );
}
