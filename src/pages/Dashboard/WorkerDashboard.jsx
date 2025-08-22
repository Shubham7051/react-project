import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const WorkerDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    activateProfile();
  }, []);

  const activateProfile = async () => {
    try {
      const res = await axios.post(
        "https://your-api-url.com/API/emergency/activate/",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTickets(res.data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmTicket = async (ticketId) => {
    try {
      await axios.post(
        "https://your-api-url.com/API/emergency/confirmation/",
        { ticket_id: ticketId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Emergency ticket confirmed!");
      activateProfile(); // refresh tickets
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Emergency Tickets</h3>
      {tickets.map((t) => (
        <div key={t.id} style={{ border: "1px solid #ccc", margin: "0.5rem", padding: "0.5rem" }}>
          <p><strong>Description:</strong> {t.description}</p>
          <p><strong>Distance:</strong> {t.distance_km ? t.distance_km.toFixed(2) + " km" : "Unknown"}</p>
          <button onClick={() => confirmTicket(t.id)}>Confirm Ticket</button>
        </div>
      ))}
    </div>
  );
};

export default WorkerDashboard;
