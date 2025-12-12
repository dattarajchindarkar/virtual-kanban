// app/lib/fetcher.js
import api from "./api";

export const fetcher = (url) => api.get(url).then((response) => response.data);

export default fetcher;
