import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000,
  headers: {
    API_KEY: process.env.REACT_APP_API_KEY || '',
  },
});
