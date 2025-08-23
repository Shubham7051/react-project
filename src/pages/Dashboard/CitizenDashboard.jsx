import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"; // use the same CSS as Dashboard

const CitizenDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [healthTips, setHealthTips] = useState("");
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (showTips) fetchHealthTips();
  }, [showTips]);

  const fetchHealthTips = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/API/citizen/tips/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHealthTips(res.data.health_tips);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Citizen Dashboard</h2>
        <p className="dashboard-sub">
          Welcome! What would you like to do today?
        </p>

        {/* Action Buttons */}
        <div className="dashboard-buttons">
          <Link to="/raise-ticket" className="btn register-btn">
            Raise Virtual Consultancy Ticket
          </Link>
          <Link to="/EmergencyTicket" className="btn login-btn">
            Raise Emergency Ticket
          </Link>
          <button
            onClick={() => setShowTips(!showTips)}
            className="btn register-btn"
          >
            {showTips ? "Hide Health Tips" : "Check Health Tips"}
          </button>
          <Link to="/programs" className="btn login-btn">
            View Active Programs
          </Link>
        </div>

        {/* Health Tips */}
        {showTips && (
          <div className="dashboard-card" style={{ marginTop: "20px" }}>
            <h3>Daily Health Tips</h3>
            <p>{healthTips || "Loading tips..."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
