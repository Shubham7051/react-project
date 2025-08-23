import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./NGODashboard.css";

const NGODashboard = () => {
  const { accessToken, user } = useContext(AuthContext);
  const [form, setForm] = useState({
    program_name: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [citizens, setCitizens] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loadingCitizens, setLoadingCitizens] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  const formatTime = (t) => (t.length === 5 ? t + ":00" : t);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        program_name: form.program_name,
        description: form.description,
        start_date: form.start_date,
        end_date: form.end_date,
        start_time: formatTime(form.start_time),
        end_time: formatTime(form.end_time),
        location: form.location,
      };

      await axios.post("http://127.0.0.1:8000/API/NGO/program", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setSuccess("Program created successfully!");
      setForm({
        program_name: "",
        description: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        location: "",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create program");
    }
  };

  const fetchCitizens = async () => {
    setLoadingCitizens(true);
    setHospitals([]);
    setLoadingHospitals(false);
    try {
      const res = await axios.get("http://127.0.0.1:8000/API/NGO/citizen", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCitizens(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoadingCitizens(false);
  };

  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    setCitizens([]);
    setLoadingCitizens(false);
    try {
      const res = await axios.get("http://127.0.0.1:8000/API/NGO/hospital", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoadingHospitals(false);
  };

  return (
    <div className="ngo-dashboard">
      <header className="dashboard-header">
        <h2>NGO Dashboard</h2>
      </header>

      {/* Action Buttons */}
      <section className="action-buttons">
        <Link to="/raise-ticket">
          <button className="btn btn-primary">Raise Virtual Consultancy Ticket</button>
        </Link>
        <Link to="/EmergencyTicket">
          <button className="btn btn-danger">Raise Emergency Ticket</button>
        </Link>
        <button
          className={`btn ${showForm ? "btn-cancel" : "btn-success"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel Program" : "Create Program"}
        </button>
      </section>

      {/* Program Form */}
      {showForm && (
        <div className="program-form">
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Program Name"
              value={form.program_name}
              onChange={(e) => setForm({ ...form, program_name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <div className="date-time-inputs">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
              />
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                required
              />
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <button type="submit" className="btn btn-submit">
              Create Program
            </button>
          </form>
        </div>
      )}

      {/* View Data Buttons */}
      <section className="view-data">
        <button onClick={fetchCitizens} className="btn btn-info">
          View Citizens
        </button>
        <button onClick={fetchHospitals} className="btn btn-info">
          View Hospitals
        </button>
        <Link to="/programs">
          <button className="btn btn-primary">View All Programs</button>
        </Link>
      </section>

      {/* Citizens List */}
      {loadingCitizens ? (
        <p>Loading citizens...</p>
      ) : citizens.length > 0 && (
        <div className="data-section">
          <h3>Citizens Data</h3>
          {citizens.map((c) => (
            <div key={c.id} className="data-card">
              <p><strong>Name:</strong> {c.full_name}</p>
              <p><strong>Address:</strong> {c.address}</p>
              <p><strong>Disease:</strong> {c.disease}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hospitals List */}
      {loadingHospitals ? (
        <p>Loading hospitals...</p>
      ) : hospitals.length > 0 && (
        <div className="data-section">
          <h3>Hospitals Data</h3>
          {hospitals.map((h) => (
            <div key={h.registration_number} className="data-card">
              <p><strong>Name:</strong> {h.name}</p>
              <p><strong>Registration No:</strong> {h.registration_number}</p>
              <p><strong>Address:</strong> {h.hos_address}</p>
              <p><strong>Phone:</strong> {h.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NGODashboard;
