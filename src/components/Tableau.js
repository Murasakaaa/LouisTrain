"use client";
import "../style/components/Tableau.css";
import { Trash2 } from "lucide-react";

export default function Tableau({ title, data }) {
  const headers = [
    "Nom du client",
    "Civilite",
    "Téléphone/Mail",
    "N°Carte d’abonnement",
    "Action",
  ];

  return (
    <div className="table-container">
      <div className="top">
        <h3>{title}</h3>
        <p>Total : {data.length}</p>
      </div>
      <table className="table">
        {/* Table header */}
        <thead className="table-header">
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>

        {/* Table body */}
        {data.length !== 0 && (
          <tbody className="table-body">
            {data.map((row, index) => (
              <TableRow key={index} client={row} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

const TableRow = ({ client }) => {
  const handleDeleteRow = () => {
    console.log("Delete row");
  };
  return (
    <tr className="table-row">
      <td>{client.nom + " " + client.prenom}</td>
      <td>{client.civilite}</td>
      <td>{client.telephone ?? client.email}</td>
      <td>{client.abonnement.num_carte}</td>

      <td>
        <button onClick={handleDeleteRow}>
          <Trash2 size={"15px"} color="#383838" />
        </button>
      </td>
    </tr>
  );
};
