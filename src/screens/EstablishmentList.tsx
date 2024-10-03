import React, { CSSProperties } from "react";

export const EstablishmentList = () => {
  // Sample data for establishments
  const establishments = [
    { id: 1, name: "Coffee Shop", address: "123 Main St" },
    { id: 2, name: "Bookstore", address: "456 Market Ave" },
    { id: 3, name: "Restaurant", address: "789 Ocean Dr" },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>List of Establishments</h1>
      <ul style={styles.list}>
        {establishments.map((establishment) => (
          <li key={establishment.id} style={styles.listItem}>
            <h3 style={styles.name}>{establishment.name}</h3>
            <p style={styles.address}>{establishment.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    margin: "10px 0",
    padding: "15px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
  },
  name: {
    margin: "0 0 5px",
  },
  address: {
    margin: 0,
    color: "#555",
  },
};
