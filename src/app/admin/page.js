"use client";
import { useState, useEffect } from "react";

import { Trash2, UserPlus } from "lucide-react";
import Tableau from "../../components/Tableau";
import Form from "../../components/Form";
import "../../style/Admin.css";

export default function Admin() {
  const [clients, setClients] = useState([]);
  const [demandes, setDemandes] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    num_card: "",
  });

  const generateRandomNumCard = () =>
    Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join("");

  const fetchData = async () => {
    const clientsRes = await fetch("/api/abonnement");
    const clientsData = await clientsRes.json();
    setClients(clientsData);

    const demandesRes = await fetch("/api/abonnement/demande_abo");
    const demandesData = await demandesRes.json();
    setDemandes(demandesData);
  };

  const handleRemoveAbo = async (client) => {
    const confirmDelete = window.confirm(
      `Voulez-vous vraiment supprimer l'abonnement de ${client.email} ?`,
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/abonnement/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: client.email,
        }),
      });

      if (!res.ok) throw new Error("Erreur API");

      alert("Abonnement supprimé avec succès");

      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    fetchData();
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
        <Tableau
          style={{ width: "70%", maxHeight: "550px", minHeight: "550px" }}
          title="Liste des abonnés"
          data={clients}
          headers={[
            {
              header: "Nom du client",
              accessor: (client) => `${client.nom} ${client.prenom}`,
            },
            {
              header: "Civilite",
              accessor: "civilite",
            },
            {
              header: "Téléphone/Mail",
              accessor: (client) => client.telephone ?? client.email,
            },
            {
              header: "N°Carte d’abonnement",
              accessor: "abonnement.num_carte",
            },
          ]}
          handleAction={(client) => handleRemoveAbo(client)}
          buttonAction={<Trash2 size={"15px"} color="#383838" />}
          details={true}
        />
        <div className="admin-right">
          <Form
            title="Ajout d'abonné"
            formData={formData}
            setFormData={setFormData}
            fetchData={fetchData}
          />
          <Tableau
            style={{ width: "100%", height: "100%" }}
            title="Demandes d'abonnement"
            data={demandes}
            headers={[{ header: "Email", accessor: (client) => client.email }]}
            handleAction={(client) =>
              setFormData({
                email: client.email,
                num_card: generateRandomNumCard(),
              })
            }
            buttonAction={<UserPlus size={"15px"} color="#383838" />}
            details={false}
          />
        </div>
      </div>
    </div>
  );
}
