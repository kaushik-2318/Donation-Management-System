import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Ensure this is set in .env
  withCredentials: true, // ✅ Allows sending cookies (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
