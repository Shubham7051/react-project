import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [profileActive, setProfileActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketStates, setTicketStates] = useState({}); // {ticketId: "initial" | "selected"}

  // fetch tickets on profile toggle
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/API/profile-toggle/",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setProfileActive(res.data.profile_active);
      setTickets(res.data.tickets || []);

      // Initialize ticket states only if profile is active
      const states = {};
      (res.data.tickets || []).forEach((t) => {
        states[t.id] = "initial";
      });
      setTicketStates(states);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleProfile = () => {
    fetchTickets();
  };

  const selectTicket = async (ticketId, meetLink) => {
    if (!meetLink) {
      alert("Please enter a Meet link before selecting the ticket.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/API/selecting/",
        { ticket_id: ticketId, meet_link: meetLink },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert(res.data.message || "Ticket selected successfully");

      // Update ticket state to 'selected'
      setTicketStates((prev) => ({ ...prev, [ticketId]: "selected" }));
    } catch (err) {
      console.error(err);
      alert("Failed to select ticket");
    }
  };

  const closeTicket = async (ticketId, prescription) => {
    if (!prescription) {
      alert("Please enter the prescription before ending the ticket.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/API/closing/",
        { ticket_id: ticketId, prescription },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert(res.data.message || "Ticket closed successfully");

      // Remove ticket from list and state
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setTicketStates((prev) => {
        const newStates = { ...prev };
        delete newStates[ticketId];
        return newStates;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to close ticket");
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h3>Doctor Dashboard</h3>
        <div className="profile-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={profileActive}
              onChange={toggleProfile} // safe toggle
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
              <p><strong>Name:</strong> {t.user?.first_name} {t.user?.last_name}</p>
              <p><strong>Description:</strong> {t.description}</p>
              <p><strong>Address:</strong> {t.address}</p>
              <p><strong>Phone No:</strong> {t.phone_no}</p>
              <p><strong>Status:</strong> {t.status}</p>

              {/* Step 1: Initial - Select Ticket */}
              {ticketStates[t.id] === "initial" && (
                <>
                  <div style={{ margin: "0.5rem 0" }}>
                    <a
                      href="https://meet.google.com/landing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-info"
                    >
                      Create Google Meet
                    </a>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste Meet Link here"
                    id={`meet-link-${t.id}`}
                    className="meet-link-input"
                  />
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      selectTicket(t.id, document.getElementById(`meet-link-${t.id}`).value)
                    }
                  >
                    Select Ticket
                  </button>
                </>
              )}

              {/* Step 2: Selected - End Ticket */}
              {ticketStates[t.id] === "selected" && (
                <>
                  <textarea
                    placeholder="Enter prescription to end ticket"
                    id={`prescription-${t.id}`}
                    className="prescription-input"
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  />
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      closeTicket(t.id, document.getElementById(`prescription-${t.id}`).value)
                    }
                    style={{ marginTop: "0.5rem" }}
                  >
                    End Ticket
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>{profileActive ? "No tickets available for your specialization." : ""}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
