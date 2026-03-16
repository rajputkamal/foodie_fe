import React from "react";

const Table = ({ tableHead = [], tableBody = [] }) => {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {tableHead.map((head, index) => (
              <th key={index} style={styles.th}>
                {head.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableBody.map((row, rowIndex) => (
            <tr key={rowIndex} style={styles.tr}>
              {tableHead.map((head, colIndex) => (
                <td key={colIndex} style={styles.td}>
                  {renderCell(row[head.field], head)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

/* Optional renderer for special columns */
function renderCell(value, head) {
  if (head.type === "status") {
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: 500,
          background: value ? "#dcfce7" : "#fee2e2",
          color: value ? "#166534" : "#991b1b",
        }}
      >
        {value ? "Active" : "Inactive"}
      </span>
    );
  }

  if (head.type === "date") {
    return new Date(value).toLocaleDateString();
  }

  return value;
}

const styles = {
  tableWrapper: {
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    padding: "12px 16px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#374151",
  },
  tr: {
    transition: "background 0.15s",
  },
};
