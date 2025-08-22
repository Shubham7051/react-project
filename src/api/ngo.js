import axios from 'axios';

const API_URL = "https://your-backend-url.com/ngo/";

export const getCitizens = (token) => axios.get(`${API_URL}NGO/citizen`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const getHospitals = (token) => axios.get(`${API_URL}NGO/hospital`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const createProgram = (data, token) => axios.post(`${API_URL}NGO/program`, data, {
  headers: { Authorization: `Bearer ${token}` }
});

export const listPrograms = (token) => axios.get(`${API_URL}NGO/ListProgram`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const downloadPDF = (programId, token) => axios.get(`${API_URL}citizen/volunteer/${programId}/`, {
  headers: { Authorization: `Bearer ${token}` },
  responseType: 'blob'
});
