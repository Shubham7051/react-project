// src/pages/Dashboard/ProgramDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ProgramDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  // Fetch active programs from API
  const fetchPrograms = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/API/NGO/ListProgram", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPrograms(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch programs.");
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Active Programs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {programs.length === 0 ? (
        <p>No active programs at the moment.</p>
      ) : (
        programs.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              margin: "0.5rem 0",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          >
            <p><strong>{p.program_name}</strong></p>
            <p>{p.description}</p>
            <p>
              {p.start_date} {p.start_time} - {p.end_date} {p.end_time}
            </p>
            <p>{p.location || "Location not specified"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProgramDashboard;
