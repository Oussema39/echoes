import axios, { AxiosInstance } from "axios";

const HF_API_URL = process.env.HF_API_URL;
const HF_API_KEY = process.env.HF_API_KEY;

const httpClient: AxiosInstance = axios.create({
  baseURL: HF_API_URL,
  headers: {
    Authorization: `Bearer ${HF_API_KEY}`,
  },
  withCredentials: true,
});

export { httpClient };
