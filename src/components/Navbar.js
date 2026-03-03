"use client";
import { useEffect, useState } from "react";
import Button from "./commons/Button";
import "../style/components/Navbar.css";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "../app/login/action";
import { useActionState } from "react";

export default function Navbar({ isWhite }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [state, logoutAction] = useActionState(logout, undefined);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/client/current")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const buttonConnexion = (
    <Button text="Se connecter" onClick={() => router.replace("/login")} />
  );

  const profil = user && (
    <div className="navbar-profil">
      <p>
        {user.prenom} {user.nom}
      </p>
      <form action={logoutAction} style={{ display: "inline" }}>
        <button type="submit" className="logout">
          <LogOut />
        </button>
      </form>
    </div>
  );

  const handleBackHome = () => {
    router.replace("/");
  };

  return (
    <div className="navbar">
      <h1
        className="logo"
        style={{ color: isWhite ? "var(--white)" : "var(--black)" }}
        onClick={handleBackHome}
      >
        Louis<span>Train</span>
      </h1>
      {user ? profil : buttonConnexion}
    </div>
  );
}
