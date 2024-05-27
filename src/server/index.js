import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constant";

export const request = axios.create({
  baseURL: "https://crm.mirzobox.uz/api/",
  timeout: 10000,
  headers: { Authorization: `Bearer ${Cookies.get(TOKEN)}` },
});
