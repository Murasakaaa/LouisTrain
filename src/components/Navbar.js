"use client";
import React, { useEffect, useState } from "react";
import Button from "./commons/Button";
import "../style/components/Navbar.css";
import { useRouter } from "next/navigation";

export default function Navbar({ isWhite }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/client/current")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  const buttonConnexion = (
    <Button text="Se connecter" onClick={() => router.replace("/login")} />
  );

  const profil = user && (
    <div className="navbar-profil">
      <p>{user.prenom} {user.nom}</p>
      <p>icon</p>
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
