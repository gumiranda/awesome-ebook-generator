"use client";
import React, { useState, useEffect, useCallback } from "react";

// Simulate fetching data from a remote source asynchronously
const fetchData = (): Promise<Establishment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Coffee Shop",
          address: "123 Main St",
          relatedIds: [2, 3],
        },
        {
          id: 2,
          name: "Bookstore",
          address: "456 Market Ave",
          relatedIds: [1, 3],
        },
        {
          id: 3,
          name: "Restaurant",
          address: "789 Ocean Dr",
          relatedIds: [1, 2],
        },
      ]);
    }, 1000);
  });
};

// Define styles that adapt to different screens
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center" as const,
  },
  list: {
    listStyleType: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
  },
  listItem: {
    margin: "10px 0",
    padding: "15px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    transition: "background-color 0.3s",
    width: "100%",
    maxWidth: "600px",
    boxSizing: "border-box" as const,
  },
  name: {
    margin: "0 0 5px",
  },
  address: {
    margin: 0,
    color: "#555",
  },
  input: {
    padding: "5px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  success: {
    backgroundColor: "#d4edda",
    transition: "background-color 0.3s ease-out",
  },
  error: {
    borderColor: "red",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    position: "relative",
  },
  loader: {
    width: "15px",
    height: "15px",
    border: "3px solid #f3f3f3",
    borderRadius: "50%",
    borderTop: "3px solid #3498db",
    animation: "spin 1s linear infinite",
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  notification: {
    position: "fixed" as const,
    bottom: "20px",
    right: "20px",
    backgroundColor: "#fff",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "opacity 0.3s ease",
  },
  fadeOut: {
    opacity: 0,
  },
  errorMessage: {
    color: "red",
    padding: "10px 0",
  },
};

// Append loader keyframes to the document

interface Establishment {
  id: number;
  name: string;
  address: string;
  relatedIds: number[];
}

interface UndoRedoAction {
  id: number;
  previousName: string;
  previousAddress: string;
}

const EstablishmentItem = ({
  id,
  name,
  address,
  onSave,
}: {
  id: number;
  name: string;
  address: string;
  onSave: (id: number, newName: string, newAddress: string) => void;
}) => {
  const [editableName, setEditableName] = useState(name);
  const [editableAddress, setEditableAddress] = useState(address);
  const [isNameError, setIsNameError] = useState(false);
  const [isAddressError, setIsAddressError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!editableName.trim() || !editableAddress.trim()) {
      setIsNameError(!editableName.trim());
      setIsAddressError(!editableAddress.trim());
      return;
    }
    setIsNameError(false);
    setIsAddressError(false);
    setIsLoading(true);

    setTimeout(() => {
      onSave(id, editableName, editableAddress);
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000); // Reset the saved animation after 2 seconds
    }, 1000); // Simulated loading delay
  };

  return (
    <li style={{ ...styles.listItem, ...(isSaved ? styles.success : {}) }}>
      <input
        type="text"
        value={editableName}
        style={{ ...styles.input, ...(isNameError ? styles.error : {}) }}
        onChange={(e) => setEditableName(e.target.value)}
      />
      <input
        type="text"
        value={editableAddress}
        style={{ ...styles.input, ...(isAddressError ? styles.error : {}) }}
        onChange={(e) => setEditableAddress(e.target.value)}
      />
      <button
        style={styles.button as React.CSSProperties}
        onClick={handleSave}
        disabled={isLoading}
      >
        Save
        {isLoading && <div style={styles.loader as React.CSSProperties}></div>}
      </button>
    </li>
  );
};

const Notification = ({
  onUndo,
  fadeOut,
}: {
  onUndo: () => void;
  fadeOut: boolean;
}) => {
  return (
    <div style={{ ...styles.notification, ...(fadeOut ? styles.fadeOut : {}) }}>
      <p>
        Change saved. <button onClick={onUndo}>Undo</button>
      </p>
    </div>
  );
};

const EstablishmentList = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<UndoRedoAction[]>([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const loadData = async () => {
    try {
      const data: Establishment[] = await fetchData();
      setEstablishments(data);
      setError(null);
    } catch {
      setError("Failed to load data. Please try again.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (id: number, newName: string, newAddress: string) => {
    const previous = establishments.find((est) => est.id === id);
    if (previous) {
      setUndoStack([
        ...undoStack,
        { id, previousName: previous.name, previousAddress: previous.address },
      ]);
    }
    setEstablishments(
      establishments.map((est) =>
        est.id === id ? { ...est, name: newName, address: newAddress } : est,
      ),
    );
    setNotificationVisible(true);
    setFadeOut(false);
    setTimeout(() => setFadeOut(true), 1700);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const undoAction = undoStack.pop();
      if (undoAction) {
        setEstablishments(
          establishments.map((est) =>
            est.id === undoAction.id
              ? {
                  ...est,
                  name: undoAction.previousName,
                  address: undoAction.previousAddress,
                }
              : est,
          ),
        );
        setUndoStack([...undoStack]);
      }
    }
  }, [undoStack, establishments]);

  useEffect(() => {
    if (notificationVisible) {
      const timer = setTimeout(() => setNotificationVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [notificationVisible]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>List of Establishments</h1>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <button onClick={loadData} style={styles.button as React.CSSProperties}>
        Refresh Data
      </button>
      <ul style={styles.list}>
        {establishments.map(({ id, name, address }) => (
          <EstablishmentItem
            key={id}
            id={id}
            name={name}
            address={address}
            onSave={handleSave}
          />
        ))}
      </ul>
      {notificationVisible && (
        <Notification onUndo={handleUndo} fadeOut={fadeOut} />
      )}
    </div>
  );
};

export default EstablishmentList;
