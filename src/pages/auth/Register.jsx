import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { registerUser } from "../../api/auth";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "citizen",
    hospital_id: "",
    specialization: "",
    profile_active: false,
    department: "",
    worker_address: "",
    organization_name: "",
    address: "",
    isNgo: false,
  });

  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalsRes, specializationsRes] = await Promise.all([
          axios.get("http://localhost:8000/API/hospitals/"),
          axios.get("http://localhost:8000/API/specializations/"),
        ]);
        setHospitals(hospitalsRes.data);
        setSpecializations(specializationsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const getPayload = () => {
    const payload = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      user_type: formData.user_type,
    };

    if (formData.user_type === "doctor") {
      payload.hospital_id = formData.hospital_id;
      payload.specialization = formData.specialization;
      payload.profile_active = formData.profile_active;
    } else if (formData.user_type === "worker") {
      payload.department = formData.department;
      payload.worker_address = formData.worker_address;
    } else if (formData.user_type === "ngo") {
      payload.organization_name = formData.organization_name;
    } else if (formData.user_type === "citizen") {
      payload.address = formData.address;
      payload.isNgo = formData.isNgo;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(getPayload());
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Register</h2>
        {error && <p className="error-message">{JSON.stringify(error)}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            required
          >
            <option value="citizen">Citizen</option>
            <option value="doctor">Doctor</option>
            <option value="worker">Worker</option>
            <option value="ngo">NGO</option>
          </select>

          {/* Doctor Fields */}
          {formData.user_type === "doctor" && (
            <>
              <select
                name="hospital_id"
                value={formData.hospital_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.registration_number}>
                    {h.name}
                  </option>
                ))}
              </select>

              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.category}>
                    {s.category}
                  </option>
                ))}
              </select>

              <label>
                <input
                  type="checkbox"
                  name="profile_active"
                  checked={formData.profile_active}
                  onChange={handleChange}
                />{" "}
                Profile Active
              </label>
            </>
          )}

          {/* Worker Fields */}
          {formData.user_type === "worker" && (
            <>
              <input
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />
              <input
                name="worker_address"
                placeholder="Worker Address"
                value={formData.worker_address}
                onChange={handleChange}
              />
            </>
          )}

          {/* NGO Fields */}
          {formData.user_type === "ngo" && (
            <input
              name="organization_name"
              placeholder="Organization Name"
              value={formData.organization_name}
              onChange={handleChange}
              required
            />
          )}

          {/* Citizen Fields */}
          {formData.user_type === "citizen" && (
            <>
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="isNgo"
                  checked={formData.isNgo}
                  onChange={handleChange}
                />{" "}
                Share data with NGO?
              </label>
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
