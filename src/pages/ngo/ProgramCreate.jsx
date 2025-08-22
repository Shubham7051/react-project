import React, { useState, useContext } from "react";
import { createProgram } from "../../api/ngo";
import { AuthContext } from "../../context/AuthContext";

const ProgramCreate = () => {
  const { accessToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    program_name: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProgram(formData, accessToken);
      setSuccess("Program created successfully!");
      setFormData({ program_name: "", description: "", location: "", start_date: "", end_date: "", start_time: "", end_time: "" });
    } catch (err) {
      setError(err.response?.data || "Failed to create program");
    }
  };

  return (
    <div className="form-container">
      <h2>Create NGO Program</h2>
      {error && <p style={{ color: "red" }}>{JSON.stringify(error)}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="program_name" placeholder="Program Name" value={formData.program_name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
        <button type="submit">Create Program</button>
      </form>
    </div>
  );
};

export default ProgramCreate;
