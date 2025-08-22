import React from "react";
import { useAuth } from "../../context/useAuth";
import DoctorDashboard from "./DoctorDashboard";
import WorkerDashboard from "./WorkerDashboard";
import NGODashboard from "./NGODashboard";
import CitizenDashboard from "./CitizenDashboard";
import Logout from "../auth/Logout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Landing page when no user is logged in
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h1>Welcome to HealthConnect</h1>
        <p style={{ marginBottom: "2rem" }}>
          Connecting Citizens, Doctors, NGOs, and Workers in one platform.
        </p>
        <div>
          <button
            style={{
              margin: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
            style={{
              margin: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Dashboard when logged in
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          background: "#eee",
        }}
      >
        <h2>Welcome {user.first_name}</h2>
        <Logout />
      </header>

      <main>
        {user.user_type === "citizen" && <CitizenDashboard />}
        {user.user_type === "doctor" && <DoctorDashboard />}
        {user.user_type === "worker" && <WorkerDashboard />}
        {user.user_type === "ngo" && <NGODashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
