import React from "react";
import { useAuth } from "../../context/useAuth";
import DoctorDashboard from "./DoctorDashboard";
import WorkerDashboard from "./WorkerDashboard";
import NGODashboard from "./NGODashboard";
import CitizenDashboard from "./CitizenDashboard";
import Logout from "../auth/Logout";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Landing page when no user is logged in
  if (!user) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-card">
          <h1>Welcome to HealthConnect</h1>
          <p>
            Connecting Citizens, Doctors, NGOs, and Workers in one platform.
          </p>
          <div className="dashboard-buttons">
            <button
              className="btn register-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="btn login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard when logged in
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome {user.first_name}</h2>
        <Logout />
      </header>

      <main className="dashboard-main">
        {user.user_type === "citizen" && <CitizenDashboard />}
        {user.user_type === "doctor" && <DoctorDashboard />}
        {user.user_type === "worker" && <WorkerDashboard />}
        {user.user_type === "ngo" && <NGODashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
