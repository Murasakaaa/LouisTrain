"use client";
import { useEffect, useState } from "react";
import Button from "./commons/Button";
import "../style/components/Navbar.css";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "../app/login/action";
import { useActionState } from "react";

export default function Navbar({ isWhite, user }) {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [state, logoutAction] = useActionState(logout, undefined);

  useEffect(() => {
    fetch("/api/client/current")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUserData(data.user);
        else setUserData(null);
      })
      .catch(() => setUserData(null));
  }, [user]);

  const buttonConnexion = (
    <Button text="Se connecter" onClick={() => router.replace("/login")} />
  );

  const profil = userData && (
    
    <div className="navbar-profil">
      <a onClick={() => router.push("../historique")} style={{ cursor: "pointer" }}>
        Mon historique
      </a>
      <form action={logoutAction} style={{ display: "inline" }}>
        <button type="submit" className="logout">
          <LogOut />
        </button>
      </form>
    </div>
  );

  const handleBackHome = () => {
    if (user && user.userId != "client_001") {
      router.replace("/");
    }
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
      {userData ? profil : buttonConnexion}
    </div>
  );
}
