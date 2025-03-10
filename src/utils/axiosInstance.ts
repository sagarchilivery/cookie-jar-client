import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
