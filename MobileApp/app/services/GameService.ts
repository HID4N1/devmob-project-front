import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL} from './config';
import { Platform } from 'react-native';
import FirebaseService from './FirebaseService';


export const GameService = {
  async createTicket(ticketNumber: string, agentId: string, numbers: number[], stake: number, age_verified: boolean = false, Is_quatro_plus: boolean = false, detaillant?: string, crc?: string) {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const baseUrl = API_BASE_URL;
      const response = await axios.post(`${baseUrl}/games/tickets/`, {
        external_ticket_number: ticketNumber,
        numbers: numbers,
        stake: stake,
        age_verified: age_verified,
        Is_quatro_plus: Is_quatro_plus,
        CRC: crc,
        Detaillant: detaillant,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Track ticket creation with Firebase
      await FirebaseService.trackTicketCreate(ticketNumber, stake, Is_quatro_plus);

      return response.data;  // Should include id
    } catch (error: any) {
      // Track error with Firebase
      await FirebaseService.trackError(error instanceof Error ? error : new Error(String(error)), {
        context: 'create_ticket',
      });
      
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Create ticket failed. Please try again.');
      }
    }
  },

  async playTicket(ticketId: number) {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const baseUrl = API_BASE_URL;
      const response = await axios.post(`${baseUrl}/games/tickets/${ticketId}/play/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Track game play with Firebase
      await FirebaseService.trackGamePlay(
        ticketId,
        response.data.winning_numbers || [],
        response.data.has_won || false,
        response.data.gift
      );

      return response.data;
    } catch (error: any) {
      // Track error with Firebase
      await FirebaseService.trackError(error instanceof Error ? error : new Error(String(error)), {
        context: 'play_ticket',
        ticketId,
      });
      
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Play ticket failed. Please try again.');
      }
    }
  },

  async updateTicket(ticketId: number, phoneNumber: string) {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const baseUrl = API_BASE_URL;
      const response = await axios.patch(`${baseUrl}/games/tickets/${ticketId}/`, {
        phone_number: phoneNumber,
      }, {
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
        throw new Error('Update ticket failed. Please try again.');
      }
    }
  },
};