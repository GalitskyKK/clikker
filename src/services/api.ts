import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8002/test';

export const fetchUserData = async (userId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/user_entry_check/${userId}`);
    console.log(`Your score: Coins: ${response.data.coins}, Energy: ${response.data.energy}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const postUserData = async (userId: number, coins: number, energy: number) => {
  try {
    console.log('Sending POST request with:', { userId, coins, energy });
    const response = await axios.post(`${BASE_URL}/user_exit/${userId}`, null, {
      params: {
        coins,
        energy,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error posting user data:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
