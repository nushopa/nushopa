import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // Send the httpOnly access-token cookie on cross-origin requests.
  withCredentials: true,
});

export default axiosClient;