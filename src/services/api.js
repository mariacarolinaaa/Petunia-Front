import axios from "axios";

//a palavra localhost não funciona no React Native, precisa ser IPV4:8080
const api = axios.create({
  baseURL: "http://172.20.10.3:8765/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;