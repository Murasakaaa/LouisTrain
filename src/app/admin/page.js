import React from "react";
import Tableau from "../../components/Tableau";
import Form from "../../components/Form";
import "../../style/Admin.css";

export default function Admin() {
  const data = [
    {
      "Nom du client": "Louis Tran",
      Civilite: "Monsieur",
      "Téléphone/Mail": "louis.tran@gmail.com",
      "N°Carte d’abonnement": "01569",
    },
    {
      "Nom du client": "Louis Tran",
      Civilite: "Monsieur",
      "Téléphone/Mail": "louis.tran@gmail.com",
      "N°Carte d’abonnement": "01569",
    },
    {
      "Nom du client": "Louis Tran",
      Civilite: "Monsieur",
      "Téléphone/Mail": "louis.tran@gmail.com",
      "N°Carte d’abonnement": "01569",
    },
    {
      "Nom du client": "Louis Tran",
      Civilite: "Monsieur",
      "Téléphone/Mail": "louis.tran@gmail.com",
      "N°Carte d’abonnement": "01569",
    },
    {
      "Nom du client": "Louis Tran",
      Civilite: "Monsieur",
      "Téléphone/Mail": "louis.tran@gmail.com",
      "N°Carte d’abonnement": "01569",
    },
  ]; // A remplacer par la requête mongoDb

  return (
    <div className="admin-container">
      <div
        style={{
          display: "flex",
          height: "80%",
          width: "80%",
          gap: "1rem",
        }}
      >
        <Tableau title="Liste des clients" data={data} />
        <Form title="Ajout de client" />
      </div>
    </div>
  );
}
