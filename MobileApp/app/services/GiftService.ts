import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from './config';

export interface Gift {
  id: number;
  range: string;
  name: string;
  stock_quantity: number;
  image: string | null;
}

export const GiftService = {
  async fetchGifts(): Promise<Gift[]> {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get(`${API_BASE_URL}/games/gifts/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Fetch gifts failed. Please try again.');
      }
    }
  },
};