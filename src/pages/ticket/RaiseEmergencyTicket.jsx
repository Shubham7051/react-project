import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

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
        "http://127.0.0.1:8000/API/EmergencyTicket/", // Use normal ticket endpoint
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
    <div className="form-container">
      <h2>Raise Emergency Ticket</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit Emergency Ticket</button>
      </form>
    </div>
  );
};

export default RaiseEmergencyTicket;
