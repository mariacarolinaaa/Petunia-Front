import axios from "axios";

//a palavra localhost não funciona no React Native, precisa ser IPV4:8080
const api = axios.create({
  baseURL: "http://192.168.0.107:8765/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;