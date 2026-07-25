import axios from "axios";

export default axios.create({
    baseURL: "https://page-pulse-backend-t6np.onrender.com/",
    timeout:10000
});