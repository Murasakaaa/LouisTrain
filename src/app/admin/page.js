"use client";
import { useState, useEffect } from "react";

import Tableau from "../../components/Tableau";
import Form from "../../components/Form";
import "../../style/Admin.css";

export default function Admin() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch("/api/client")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

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
        <Tableau title="Liste des abonnés" data={clients} />
        <Form title="Ajout d'abonné" />
      </div>
    </div>
  );
}
