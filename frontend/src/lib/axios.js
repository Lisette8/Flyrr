import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEP,
  withCredentials: true,
});

export default axiosInstance;
