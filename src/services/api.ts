// services/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8002'; // Адрес вашего бэкенда

export const getInitialData = async () => {
  const response = await axios.get(`${API_URL}/initial-data`);
  return response.data;
};

export const updateBalanceAndEnergy = async (balance: number, energy: number) => {
  const response = await axios.post(`${API_URL}/update`, { balance, energy });
  return response.data;
};
