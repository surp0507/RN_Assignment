import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.restful-api.dev',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export default api;