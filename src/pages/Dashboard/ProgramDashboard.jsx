import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./ProgramDashboard.css";

const ProgramDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

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
    <div className="program-dashboard">
      <header>
        <h2>Active Programs</h2>
        {error && <p className="error-msg">{error}</p>}
      </header>

      {programs.length === 0 ? (
        <p className="no-data">No active programs at the moment.</p>
      ) : (
        <div className="program-list">
          {programs.map((p) => (
            <div key={p.id} className="program-card">
              <h3 className="program-name">{p.program_name}</h3>
              <p className="program-desc">{p.description}</p>
              <p className="program-datetime">
                {p.start_date} {p.start_time} - {p.end_date} {p.end_time}
              </p>
              <p className="program-location">
                {p.location || "Location not specified"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramDashboard;
