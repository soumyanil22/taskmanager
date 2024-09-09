import axios from 'axios';

axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})


export default axiosInstance;