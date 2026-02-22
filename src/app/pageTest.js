"use client";
import { useState, useEffect } from "react";

export default function TestPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // 1. Charger la liste au démarrage
  useEffect(() => {
    fetch("/api/client") // le fetch va appeler le fichier route.js qui est dans le dossier /api/client
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  // 2. Fonction pour charger UN client précis au clic
  const voirDetails = (id) => {
    fetch(`/api/client/${id}`) // le fetch va appeler le fichier route.js qui est dans le dossier /api/client/[id]. on met ${id} pour que le route.js récup l'id
      .then((res) => res.json())
      .then((data) => setSelectedClient(data));
  };

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Maquette Louis Train - Test MongoDB</h1>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* COLONNE GAUCHE : LISTE */}
        <section>
          <h2>Liste des clients</h2>
          <ul>
            {clients.map((c) => (
              <li key={c._id} style={{ marginBottom: "10px" }}>
                {c.nom} {c.prenom} 
                <button 
                  onClick={() => voirDetails(c._id)}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                >
                  Voir détails
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* COLONNE DROITE : DÉTAILS */}
        <section style={{ borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
          <h2>Détails du client</h2>
          {selectedClient ? (
            <div style={{ background: "#f4f4f4", padding: "15px", borderRadius: "8px" }}>
              <p><strong>Nom :</strong> {selectedClient.nom}</p>
              <p><strong>Prénom :</strong> {selectedClient.prenom}</p>
              <p><strong>Civilité :</strong> {selectedClient.civilite}</p>
              <p><strong>ID :</strong> {selectedClient._id}</p>
            </div>
          ) : (
            <p>Cliquez sur un client pour voir ses infos.</p>
          )}
        </section>
      </div>
    </main>
  );
}