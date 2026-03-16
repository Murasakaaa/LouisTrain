"use client";
import { useState } from "react";
import "../style/components/Tableau.css";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

export default function Tableau({
  style,
  title,
  data,
  headers,
  handleAction,
  buttonAction,
  details,
}) {
  return (
    <div className="table-container" style={style}>
      <div className="top">
        <h3>{title}</h3>
        <p>Total : {data.length}</p>
      </div>
      <table className="table">
        {/* Table header */}
        <thead className="table-header">
          <tr>
            {headers.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>

        {/* Table body */}
        {data.length !== 0 && (
          <tbody className="table-body">
            {data.map((row) => (
              <TableRow
                key={row._id}
                client={row}
                columns={headers}
                handleAction={handleAction}
                buttonAction={buttonAction}
                details={details}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

const TableRow = ({ client, columns, handleAction, buttonAction, details }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const getValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <>
      <tr className="table-row">
        {columns.map((col, index) => (
          <td key={index}>
            {typeof col.accessor === "function"
              ? col.accessor(client)
              : getValue(client, col.accessor)}
          </td>
        ))}

        <td>
          <button onClick={() => handleAction(client)}>{buttonAction}</button>{" "}
          {details && (
            <button onClick={() => setShowPopUp(true)}>
              <Info size={"15px"} color="#383838" />
            </button>
          )}
        </td>
      </tr>

      {showPopUp &&
        createPortal(
          <PopUpRowDetails
            userData={client}
            onClick={() => setShowPopUp(false)}
          />,
          document.body,
        )}
    </>
  );
};

const PopUpRowDetails = ({ onClick, userData }) => {
  const headers = [
    { header: "N° Réservation", accessor: (row) => row._id },
    {
      header: "Date réservation",
      accessor: (row) =>
        new Date(row.date_reservation).toLocaleDateString("fr-FR"),
    },
    {
      header: "Trajet",
      accessor: (row) =>
        row.voyage?.[0]?.gare_depart + " → " + row.voyage?.[0]?.gare_arrivee,
    },
    { header: "Sens", accessor: (row) => row.voyage?.[0]?.sens },
    {
      header: "Date voyage",
      accessor: (row) =>
        new Date(row.voyage?.[0]?.date).toLocaleDateString("fr-FR"),
    },
    { header: "Départ", accessor: (row) => row.voyage?.[0]?.heure_depart },
    { header: "Arrivée", accessor: (row) => row.voyage?.[0]?.heure_arrivee },
    { header: "Statut", accessor: (row) => row.statut },
    { header: "Prix TTC", accessor: (row) => `${row.prix_total} €` },
  ];

  const getValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };
  return (
    <div className="bg-filter">
      <div className="popup">
        <div className="top">
          <h2>Historique de voyage</h2>
          <button onClick={onClick}>
            <X />
          </button>
        </div>
        <div className="bottom">
          <p>Client: {userData.nom + " " + userData.prenom}</p>

          <div className="table-wrapper">
            <table className="table-popup">
              <thead className="table-header">
                <tr>
                  {headers.map((col) => (
                    <th key={col.header}>{col.header}</th>
                  ))}
                </tr>
              </thead>

              {userData.reservations.length !== 0 && (
                <tbody className="table-body">
                  {userData.reservations.flatMap((row) =>
                    row.voyage.map((trip, tripIndex) => (
                      <tr key={`${row._id}-${tripIndex}`} className="table-row">
                        {/* N° résa uniquement sur la 1ère ligne du groupe */}
                        <td>{tripIndex === 0 ? row._id : ""}</td>
                        <td>
                          {tripIndex === 0
                            ? new Date(row.date_reservation).toLocaleDateString(
                                "fr-FR",
                              )
                            : ""}
                        </td>

                        {/* Infos voyage */}
                        <td>
                          {trip.gare_depart} → {trip.gare_arrivee}
                        </td>
                        <td>
                          <span className={`badge badge-${trip.sens}`}>
                            {trip.sens}
                          </span>
                        </td>
                        <td>
                          {new Date(trip.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td>{trip.heure_depart}</td>
                        <td>{trip.heure_arrivee}</td>

                        {/* Statut & prix uniquement sur la 1ère ligne */}
                        <td>
                          {tripIndex === 0 && (
                            <span className={`badge badge-${row.statut}`}>
                              {row.statut}
                            </span>
                          )}
                        </td>
                        <td>{tripIndex === 0 ? `${row.prix_total} €` : ""}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
