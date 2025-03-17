import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Базовый URL сервера

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (userData) => {
    return api.post('/api/auth/register', userData); 
};
  
export const loginUser = (credentials) => {
    return api.post('/api/auth/login', credentials);
};
  
export const getMedicalServices = () => {
    return api.get('/api/services'); 
};
  
export const submitForm = (formData) => {
    return api.post('/api/form/submit', formData); 
};

export default api;