"use client";
import { useEffect, useState } from "react";
import Button from "./commons/Button";
import "../style/components/Navbar.css";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ShoppingCart, TicketCheck } from "lucide-react";
import { logout } from "../app/login/action";
import { useActionState } from "react";

export default function Navbar({ isWhite, user }) {
  const router = useRouter();
  const pathname = usePathname();

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
      <a onClick={() => router.push("/historique")}>
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
    router.replace("/");
  };



  return (
    <div className="navbar">
      <h1
        className="logo"
        style={{ color: isWhite ? "var(--white)" : "var(--black)", userSelect: "none" }}
        onClick={handleBackHome}
      >
        Louis<span>Train</span>
      </h1>
      <div className="right_nav">
        {!userData && pathname !== "/recupResa" && (
          <div className="resaBtn" onClick={() => router.push("/recupResa")}>
            <TicketCheck />
          </div>
        )}
        {pathname !== "/panier" && (
          <div className="cartBtn" onClick={() => router.push("/panier")}>
            <ShoppingCart />
          </div>
        )}
        {userData ? profil : buttonConnexion}
      </div>

    </div>
  );
}
