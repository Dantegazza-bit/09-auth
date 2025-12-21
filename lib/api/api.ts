import axios from "axios";

const origin = process.env.NEXT_PUBLIC_API_URL || "";
const baseURL = `${origin}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
