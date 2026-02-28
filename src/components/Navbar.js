"use client";
import React from "react";
import Button from "./commons/Button";
import "../style/components/Navbar.css";
import { useRouter } from "next/navigation";

export default function Navbar({ isConnected, userName, isWhite }) {
  const router = useRouter();
  const buttonConnexion = (
    <Button text="Se connecter" onClick={() => router.replace("/login")} />
  );
  const profil = (
    <div className="navbar-profil">
      <p>{userName}</p>
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
      {isConnected ? profil : buttonConnexion}
    </div>
  );
}
