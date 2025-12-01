import axios from "axios";

const API_URL = "http://localhost:8500/api/dashboard";

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};

export const getActivities = async () => {
  const res = await axios.get(`${API_URL}/activities`);
  return res.data;
};
