const raw = import.meta.env.VITE_BASE_URL || "";
export const API_BASE_URL = raw.replace(/\/+$/, "") + "/";
