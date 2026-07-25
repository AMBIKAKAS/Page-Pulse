import axios from "axios";

export default axios.create({
  baseURL: "https://page-pulse-backend-t6np.onrender.com/api/audit",
  timeout: 10000,
});