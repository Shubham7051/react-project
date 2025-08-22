import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { registerUser } from "../../api/auth";
import axios from "axios";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
    shift: "shift 1",
    worker_address: "",
    w_latitude: "",
    w_longitude: "",
    organization_name: "",
    address: "",
    ticket_id: "",
    disease: "",
    isNgo: false,
  });

  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data (hospitals + specializations)
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
        console.error("Error fetching dropdown data:", err);
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

  // Build payload dynamically
  const getPayload = () => {
    const payload = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      user_type: formData.user_type,
    };

    switch (formData.user_type) {
      case "doctor":
        payload.hospital_id = formData.hospital_id;
        payload.specialization = formData.specialization;
        payload.profile_active = formData.profile_active;
        break;

      case "worker":
        payload.department = formData.department;
        payload.shift = formData.shift;
        payload.worker_address = formData.worker_address;
        payload.w_latitude = formData.w_latitude;
        payload.w_longitude = formData.w_longitude;
        break;

      case "ngo":
        payload.organization_name = formData.organization_name;
        break;

      case "citizen":
        payload.address = formData.address;
        payload.isNgo = formData.isNgo;
        break;

      default:
        break;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(getPayload());

      // ✅ Redirect only to login after registration
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{JSON.stringify(error)}</p>}

      <form onSubmit={handleSubmit}>
        {/* Common Fields */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
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

        {/* User Type */}
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

            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              required
            >
              <option value="shift 1">Shift 1</option>
              <option value="shift 2">Shift 2</option>
              <option value="shift 3">Shift 3</option>
              <option value="shift 4">Shift 4</option>
            </select>

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
  );
};

export default Register;
