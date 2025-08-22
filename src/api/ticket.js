import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/";

export const raiseTicket = (data, token) =>
  axios.post(`${API_URL}ticket/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const raiseEmergencyTicket = (data, token) =>
  axios.post(`${API_URL}EmergencyTicket/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

