import axios from 'axios';

// Central Axios instance for every backend request.
// withCredentials lets the browser send/receive the httpOnly JWT cookie
// set by the backend on login/signup.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
