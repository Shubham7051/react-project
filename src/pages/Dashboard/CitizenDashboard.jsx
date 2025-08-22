import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom"; 
import axios from "axios";

const CitizenDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [healthTips, setHealthTips] = useState("");
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (showTips) {
      fetchHealthTips();
    }
  }, [showTips]);

  const fetchHealthTips = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/API/citizen/tips/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setHealthTips(res.data.health_tips);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Citizen Dashboard</h2>
      <p>Welcome! What would you like to do today?</p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/raise-ticket">
          <button className="btn btn-primary">
            Raise Virtual Consultancy Ticket
          </button>
        </Link>

        <Link to="/EmergencyTicket">
          <button className="btn btn-danger">
            Raise Emergency Ticket
          </button>
        </Link>

        <button
          onClick={() => setShowTips(!showTips)}
          className="btn btn-success"
        >
          {showTips ? "Hide Health Tips" : "Check Health Tips"}
        </button>

        {/* Button to redirect to ProgramDashboard */}
        <Link to="/programs">
          <button className="btn btn-info">
            View Active Programs
          </button>
        </Link>
      </div>

      {showTips && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h4>Health Tips</h4>
          <p>{healthTips || "Loading tips..."}</p>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
