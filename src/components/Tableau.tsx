import React from "react";
import "../style/Tableau.css";
import { Trash2 } from "lucide-react";

type DataRow = Record<string, string | number>;

interface TableauProps {
  data: DataRow[];
}

export default function Tableau({
  title,
  data,
}: {
  title: string;
  data: TableauProps;
}) {
  if (data.length === 0) return <p>Aucune donnée</p>;
  const headers = Object.keys(data[0]);

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
            <th>Action</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody className="table-body">
          {data.map((row, index) => (
            <TableRow key={index} headers={headers} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TableRow = ({ headers, row }: { headers: string[]; row: DataRow }) => {
  const handleDeleteRow = () => {
    console.log("Delete row");
  };
  return (
    <tr className="table-row">
      {headers.map((header) => (
        <td key={header}>{row[header]}</td>
      ))}
      <td>
        <button onClick={handleDeleteRow}>
          <Trash2 size={"15px"} color="#383838" />
        </button>
      </td>
    </tr>
  );
};
