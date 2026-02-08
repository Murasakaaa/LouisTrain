import React from "react";
import Button from "./commons/Button";
import "../style/components/Navbar.css";

export default function Navbar({
  isConnected,
  userName,
  isWhite
}: {
  isConnected: boolean;
  userName: string;
  isWhite: boolean;
}) {
  const buttonConnexion = (
    <Button text="Se connecter" onClick={() => console.log("Se connecter")} />
  );
  const profil = (
    <div className="navbar-profil">
      <p>{userName}</p>
      <p>icon</p>
    </div>
  );

  return (
    <div className="navbar">
      <h1 className="logo" style={{ color: isWhite ? "var(--white)" : "var(--black)" }}>
        Louis<span>Train</span>
      </h1>
      {isConnected ? profil : buttonConnexion}
    </div>
  );
}
