import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./DoctorDashboard.css"; // reuse same CSS

const WorkerDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [profileActive, setProfileActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketStates, setTicketStates] = useState({}); // {ticketId: "initial" | "selected"}

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/API/W_profile-toggle/",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setProfileActive(res.data.profile_active);
      setTickets(res.data.tickets || []);

      const states = {};
      (res.data.tickets || []).forEach((t) => {
        states[t.id] = "initial";
      });
      setTicketStates(states);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const toggleProfile = () => fetchTickets();

  const selectTicket = async (ticketId) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/API/emergency/confirmation/",
        { ticket_id: ticketId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert(res.data.message || "Ticket selected successfully");

      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setTicketStates((prev) => ({ ...prev, [ticketId]: "selected" }));

    } catch (err) {
      console.error(err);
      alert("Failed to select ticket");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h3>Worker Dashboard</h3>
        <div className="profile-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={profileActive}
              onChange={toggleProfile}
              disabled={loading}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/raise-ticket">
          <button className="btn btn-primary">Raise Virtual Consultancy Ticket</button>
        </Link>
        <Link to="/EmergencyTicket">
          <button className="btn btn-danger">Raise Emergency Ticket</button>
        </Link>
      </div>

      <div className="tickets-list">
        {tickets.length > 0 ? (
          tickets.map((t) => (
            <div key={t.id} className="ticket-card">
              <h4 className="ticket-user">{t.user?.first_name} {t.user?.last_name}</h4>
              <p><strong>Description:</strong> {t.description}</p>
              <p><strong>Address:</strong> {t.address}</p>
              <p><strong>Phone:</strong> {t.phone_no}</p>
              <p><strong>Distance:</strong> {t.distance_km ? t.distance_km.toFixed(2) + " km" : "Unknown"}</p>

              {ticketStates[t.id] === "initial" && (
                <button
                  className="btn btn-success select-btn"
                  onClick={() => selectTicket(t.id)}
                >
                  Select Ticket
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-tickets">{profileActive ? "No emergency tickets available at the moment." : ""}</p>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
