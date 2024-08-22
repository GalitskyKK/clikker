import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8002/test';

export const fetchUserData = async (userId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/user_entry_check/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const postUserData = async (userId: number, balance: number, energy: number) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8002/test/user_exit/${userId}`,
      {
        coins: balance,
        energy: energy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting user data:', error);
    throw error;
  }
};
