import React from "react";
import Button from "./commons/Button";
import "../style/Navbar.css";

export default function Navbar({
  isConnected,
  userName,
}: {
  isConnected: boolean;
  userName: string;
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
      <h1 className="logo">
        Louis<span>Train</span>
      </h1>
      {isConnected ? profil : buttonConnexion}
    </div>
  );
}
