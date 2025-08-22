import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    activateProfile();
  }, []);

  const activateProfile = async () => {
    try {
      const res = await axios.post(
        "https://your-api-url.com/API/activate/",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTickets(res.data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const selectTicket = async (ticketId, meetLink) => {
    try {
      await axios.post(
        "https://your-api-url.com/API/selecting/",
        { ticket_id: ticketId, meet_link: meetLink },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Ticket selected and link sent to citizen.");
      activateProfile(); // refresh tickets
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Doctor Dashboard -  Pending Tickets</h3>
      {tickets.map((t) => (
        <div key={t.id} style={{ border: "1px solid #ccc", margin: "0.5rem", padding: "0.5rem" }}>
          <p><strong>Description:</strong> {t.description}</p>
          <p><strong>Citizen:</strong> {t.user.user}</p>
          <input type="text" placeholder="Meet Link" id={`link-${t.id}`} />
          <button onClick={() => selectTicket(t.id, document.getElementById(`link-${t.id}`).value)}>
            Select Ticket
          </button>
        </div>
      ))}
    </div>
  );
};

export default DoctorDashboard;
