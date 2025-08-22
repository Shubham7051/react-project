import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const NGODashboard = () => {
  const { accessToken } = useContext(AuthContext);
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
      console.error(err.response?.data);
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
    <div style={{ padding: "1rem" }}>
      <h2>NGO Dashboard</h2>

      {/* Raise Ticket Buttons */}
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <Link to="/raise-ticket">
          <button className="btn btn-primary">Raise Virtual Consultancy Ticket</button>
        </Link>
        <Link to="/EmergencyTicket">
          <button className="btn btn-danger">Raise Emergency Ticket</button>
        </Link>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Program"}
        </button>

        {showForm && (
          <div style={{ marginTop: "1rem" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Program Name"
                value={form.program_name}
                onChange={(e) => setForm({ ...form, program_name: e.target.value })}
                required
              />
              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="Start Date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="End Date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
              />
              <input
                type="time"
                placeholder="Start Time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                required
              />
              <input
                type="time"
                placeholder="End Time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                required
              />
              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <button type="submit" style={{ marginTop: "0.5rem" }}>
                Create Program
              </button>
            </form>
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/programs">
          <button>View All Programs</button>
        </Link>

        <button onClick={fetchCitizens} style={{ marginLeft: "1rem" }}>
          View Citizens
        </button>
        <button onClick={fetchHospitals} style={{ marginLeft: "1rem" }}>
          View Hospitals
        </button>
      </div>

      {/* Show Citizens */}
      {loadingCitizens ? <p>Loading citizens...</p> : citizens.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Citizens Data</h3>
          {citizens.map(c => (
            <div key={c.id} style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>
             <p><strong>Name:</strong> {c.full_name}</p>
              <p><strong>Address:</strong> {c.address}</p>
              <p><strong>Disease:</strong> {c.disease}</p>
            </div>
          ))}
        </div>
      )}

      {/* Show Hospitals */}
      {loadingHospitals ? <p>Loading hospitals...</p> : hospitals.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Hospitals Data</h3>
          {hospitals.map(h => (
            <div key={h.registration_number} style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>
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
