// src/pages/auth/RaiseEmergencyTicket.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Logout from "../auth/Logout";
import "./RaiseEmergencyTicket.css";

const RaiseEmergencyTicket = () => {
  const { accessToken } = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = { description, address, phone_no: phoneNo };

      const res = await axios.post(
        "http://127.0.0.1:8000/API/EmergencyTicket/",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Emergency ticket raised successfully!");
      setDescription("");
      setAddress("");
      setPhoneNo("");
      console.log("Emergency Ticket Response:", res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to raise ticket"
      );
    }
  };

  return (
    <div className="emergency-ticket-page">
      <div className="ticket-header">
        <h2>Raise Emergency Ticket</h2>
        <Logout />
      </div>

      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}

      <form className="ticket-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">
          Submit Emergency Ticket
        </button>
      </form>
    </div>
  );
};

export default RaiseEmergencyTicket;
