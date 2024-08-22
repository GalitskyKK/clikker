// services/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8002/test';

export const getInitialData = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/user_entry_check/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
    throw error;
  }
};

export const updateBalanceAndEnergy = async (userId: string, balance: number, energy: number) => {
  try {
    const response = await axios.post(`${API_URL}/user_exit/${userId}`, { coins: balance, energy });
    return response.data;
  } catch (error) {
    console.error('Failed to update balance and energy:', error);
    throw error;
  }
};
