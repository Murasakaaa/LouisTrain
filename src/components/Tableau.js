"use client";
import "../style/components/Tableau.css";

export default function Tableau({
  style,
  title,
  data,
  headers,
  handleAction,
  buttonAction,
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
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

const TableRow = ({ client, columns, handleAction, buttonAction }) => {
  const getValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <tr className="table-row">
      {columns.map((col, index) => (
        <td key={index}>
          {typeof col.accessor === "function"
            ? col.accessor(client)
            : getValue(client, col.accessor)}
        </td>
      ))}

      <td>
        <button onClick={() => handleAction(client)}>{buttonAction}</button>
      </td>
    </tr>
  );
};
