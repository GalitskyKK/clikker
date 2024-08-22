import axios from 'axios';

const API_URL = 'http://127.0.0.1:8002';

const generateUserId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const userId = getUserId();

export const getInitialData = async () => {
  const response = await axios.get(`${API_URL}/test/user_entry_check/${userId}`);
  return response.data;
};

export const updateBalanceAndEnergy = async (balance: number, energy: number) => {
  const response = await axios.post(`${API_URL}/update`, { userId, balance, energy });
  return response.data;
};
