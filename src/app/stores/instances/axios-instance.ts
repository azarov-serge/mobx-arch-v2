import axios from 'axios';

const axiosInstance = axios.create({
  // withCredentials: true,
  timeout: 1_000 * 60 * 10, // 10 min
});

// axiosInstance.defaults.withCredentials = true;

/* Configure axios */

export { axiosInstance };
