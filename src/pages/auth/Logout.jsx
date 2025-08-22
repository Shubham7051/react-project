// src/pages/auth/Logout.jsx
import React from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // redirect to login after logout
  };

  return (
    <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
      Logout
    </button>
  );
};

export default Logout;
