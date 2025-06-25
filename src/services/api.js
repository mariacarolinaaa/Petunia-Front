import axios from "axios";

//a palavra localhost não funciona no React Native, precisa ser IPV4:8080
const api = axios.create({
  baseURL: "https://bare-marris-prof-ferretto-8544d847.koyeb.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;