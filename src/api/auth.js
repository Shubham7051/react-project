import axios from 'axios';

const API_URL = "http://localhost:8000/API/";

export const registerUser = (data) => axios.post(`${API_URL}register/`, data);
export const loginUser = (data) => axios.post(`${API_URL}login/`, data);
export const logoutUser = (refreshToken) => axios.post(`${API_URL}logout/`, { refresh: refreshToken });
