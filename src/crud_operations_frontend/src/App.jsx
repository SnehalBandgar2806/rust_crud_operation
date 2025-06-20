import React, { useEffect, useState } from "react";
import { crud_operations_backend } from "../../declarations/crud_operations_backend";

console.log(crud_operations_backend);
function App() {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [variables, setVariables] = useState([]);

  // Load all variables from the backend
  const loadVariables = async () => {
    try {
      const vars = await crud_operations_backend.get_all_variables();
      setVariables(vars);
    } catch (error) {
      console.error("Error loading variables:", error);
    }
  };

  // Create a new variable
  const createVar = async () => {
    if (name.trim() && value.trim()) {
      try {
        console.log("Creating:", name, value);
        await crud_operations_backend.create_variable(name, value);
        setName("");
        setValue("");
        loadVariables();
      } catch (error) {
        console.error("Create failed:", error);
      }
    } else {
      alert("Please enter both name and value.");
    }
  };

  // Update variable
  const updateVar = async (id) => {
    const newVal = prompt("Enter new value:");
    if (newVal) {
      try {
        await crud_operations_backend.update_variable(id, newVal);
        loadVariables();
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

  // Delete variable
  const deleteVar = async (id) => {
    try {
      await crud_operations_backend.delete_variable(id);
      loadVariables();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    loadVariables();
  }, []);

  // Categorize variables
  const immutableVars = variables.filter((v) => !v.value.startsWith("mut:"));
  const mutableVars = variables.filter((v) => v.value.startsWith("mut:"));

  return (
    <div style={{ fontFamily: "Segoe UI", padding: "2rem", backgroundColor: "#f0f2f5" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
        🦀 Rust + ⚛️ React CRUD using <code>let</code> / <code>let mut</code>
      </h1>

      {/* Input section */}
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <input
          placeholder="Variable Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem", width: "200px" }}
        />
        <input
          placeholder="Variable Value (use mut:val for mutable)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem", width: "300px" }}
        />
        <button
          onClick={createVar}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2c7be5",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ➕ Create
        </button>
      </div>

      {/* Display section */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem" }}>
        {/* Immutable */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#2c3e50" }}>🔒 Immutable (<code>let</code>)</h2>
          {immutableVars.length === 0 ? (
            <p>No immutable variables yet.</p>
          ) : (
            <ul>
              {immutableVars.map((v) => (
                <li key={v.id} style={{ marginBottom: "0.5rem" }}>
                  <strong>{v.name}</strong>: {v.value}
                  <button
                    onClick={() => deleteVar(v.id)}
                    style={{
                      marginLeft: "1rem",
                      color: "white",
                      backgroundColor: "#e74c3c",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mutable */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#27ae60" }}>🔓 Mutable (<code>let mut</code>)</h2>
          {mutableVars.length === 0 ? (
            <p>No mutable variables yet.</p>
          ) : (
            <ul>
              {mutableVars.map((v) => (
                <li key={v.id} style={{ marginBottom: "0.5rem" }}>
                  <strong>{v.name}</strong>: {v.value.replace("mut:", "")}
                  <button
                    onClick={() => updateVar(v.id)}
                    style={{
                      marginLeft: "1rem",
                      color: "white",
                      backgroundColor: "#f39c12",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteVar(v.id)}
                    style={{
                      marginLeft: "0.5rem",
                      color: "white",
                      backgroundColor: "#e74c3c",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
