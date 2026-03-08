"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../style/confirmation.css";

export default function Confirmation() {
  const router = useRouter();
  const [idResa, setIdResa] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");

  useEffect(() => {
    setIdResa(localStorage.getItem("id_resa") || "");
    setName(localStorage.getItem("name") || "");
    setMail(localStorage.getItem("mail") || "");
  }, []);

  return (
    <div className="confirmation-container">
      <div className="confirmation-title">
        <h1>Confirmation de votre commande</h1>
        {idResa && <span className="confirmation-ref">Réf : {idResa}</span>}
      </div>

      <div className="confirmation-card">

        <div>
          <p className="confirmation-merci">Merci {name},</p>
          <p className="confirmation-sub">Votre commande a bien été enregistrée</p>
        </div>

        <p className="confirmation-mail-info">
          Téléchargez vos billets et votre facture ici,<br />
          Ou récupérez les sur votre adresse mail à{" "}
          <a href={`mailto:${mail}`}>{mail}</a>
        </p>

        <div className="confirmation-btns">
          <button className="confirmation-btn">Télécharger ma facture</button>
          <button className="confirmation-btn">Télécharger mes billets</button>
        </div>

        <p className="confirmation-footer">Bon voyage et à bientôt !</p>

        <button className="confirmation-home" onClick={() => router.push("/")}>
          Retour à l'accueil
        </button>

      </div>
    </div>
  );
}