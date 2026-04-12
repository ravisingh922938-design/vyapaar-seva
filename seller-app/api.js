import axios from 'axios';

// Aapka Naya IPv4 Address (ipconfig wala)
const API_URL = "http://localhost:5000/api";


const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Agar 10 second tak server jawaab na de toh error dikhaye
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;