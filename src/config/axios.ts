import axios, { AxiosInstance } from "axios";

const OPENAI_API_URL = process.env.OPENAI_API_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const httpClient: AxiosInstance = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export { httpClient };
