// src/pages/auth/RaiseTicket.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Logout from "../auth/Logout";
import "./RaiseTicket.css"; // We'll create a separate CSS file for styling

const RaiseTicket = () => {
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
        "http://127.0.0.1:8000/API/ticket/",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Ticket raised successfully!");
      setDescription("");
      setAddress("");
      setPhoneNo("");
      console.log("Ticket Response:", res.data);
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
    <div className="raise-ticket-page">
      <div className="ticket-header">
        <h2>Raise Ticket</h2>
        <Logout /> {/* Logout button */}
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
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default RaiseTicket;
