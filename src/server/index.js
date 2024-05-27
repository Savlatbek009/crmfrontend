import axios from "axios";

export const request = axios.create({
  baseURL: "https://crm.mirzobox.uz/api/",
  timeout: 10000,
});
