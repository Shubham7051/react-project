import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./DoctorDashboard.css"; // Reuse same CSS

const DoctorDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [profileActive, setProfileActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketStates, setTicketStates] = useState({}); // {ticketId: "initial" | "selected"}

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

      const states = {};
      (res.data.tickets || []).forEach((t) => (states[t.id] = "initial"));
      setTicketStates(states);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle profile");
    } finally {
      setLoading(false);
    }
  };

  const selectTicket = async (ticketId, meetLink) => {
    if (!meetLink) return alert("Please enter a Meet link.");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/API/selecting/",
        { ticket_id: ticketId, meet_link: meetLink },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert(res.data.message || "Ticket selected successfully");
      setTicketStates((prev) => ({ ...prev, [ticketId]: "selected" }));
    } catch {
      alert("Failed to select ticket");
    }
  };

  const closeTicket = async (ticketId, prescription) => {
    if (!prescription) return alert("Please enter the prescription.");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/API/closing/",
        { ticket_id: ticketId, prescription },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert(res.data.message || "Ticket closed successfully");
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setTicketStates((prev) => {
        const newStates = { ...prev };
        delete newStates[ticketId];
        return newStates;
      });
    } catch {
      alert("Failed to close ticket");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Doctor Dashboard</h2>
        <p className="dashboard-sub">Manage your tickets and profile easily.</p>

        <div className="dashboard-buttons">
          <button
            className="btn register-btn"
            onClick={fetchTickets}
            disabled={loading}
          >
            {profileActive ? "Refresh Tickets" : "Activate Profile"}
          </button>
          <Link to="/raise-ticket" className="btn login-btn">
            Raise Virtual Consultancy Ticket
          </Link>
          <Link to="/EmergencyTicket" className="btn login-btn">
            Raise Emergency Ticket
          </Link>
        </div>

        {/* Tickets List */}
        <div style={{ marginTop: "20px" }}>
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <div key={t.id} className="dashboard-card" style={{ marginTop: "12px" }}>
                <p><strong>Name:</strong> {t.user?.first_name} {t.user?.last_name}</p>
                <p><strong>Description:</strong> {t.description}</p>
                <p><strong>Address:</strong> {t.address}</p>
                <p><strong>Phone No:</strong> {t.phone_no}</p>
                <p><strong>Status:</strong> {t.status}</p>

                {ticketStates[t.id] === "initial" && (
                  <>
                    <input
                      type="text"
                      placeholder="Paste Meet Link here"
                      id={`meet-link-${t.id}`}
                      className="meet-link-input"
                    />
                    <button
                      className="btn register-btn"
                      onClick={() =>
                        selectTicket(
                          t.id,
                          document.getElementById(`meet-link-${t.id}`).value
                        )
                      }
                      style={{ marginTop: "6px" }}
                    >
                      Select Ticket
                    </button>
                  </>
                )}

                {ticketStates[t.id] === "selected" && (
                  <>
                    <textarea
                      placeholder="Enter prescription"
                      id={`prescription-${t.id}`}
                      style={{ width: "100%", marginTop: "6px" }}
                    />
                    <button
                      className="btn login-btn"
                      onClick={() =>
                        closeTicket(
                          t.id,
                          document.getElementById(`prescription-${t.id}`).value
                        )
                      }
                      style={{ marginTop: "6px" }}
                    >
                      End Ticket
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>{profileActive ? "No tickets available." : ""}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
