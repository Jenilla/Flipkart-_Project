import axios from 'axios';

// Central Axios instance for every backend request.
// A relative baseURL means this works unmodified in both setups:
// - Combined mode: `npm run build` + `npm start` in server/ serves the API
//   and the built frontend from the SAME origin/port, so '/api' just works.
// - Split dev mode: `npm run dev` in client/ runs Vite's dev server, whose
//   proxy (see client/vite.config.js) forwards '/api/*' to the backend.
// withCredentials lets the browser send/receive the httpOnly JWT cookie
// set by the backend on login/signup.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
