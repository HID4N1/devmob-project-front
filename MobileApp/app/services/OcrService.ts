import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from './config';
import FirebaseService from './FirebaseService';

interface TicketData {
  external_ticket_number: string | null;
  stake: number | null;
  CRC: string | null;
  Detaillant: string | null;
}

class OcrService {
  private static readonly API_BASE_URL = API_BASE_URL;

  /**
   * Processes an image URI to extract ticket data using backend OCR.
   * @param {string} imageUri - The URI of the ticket image.
   * @returns {Promise<TicketData>} - Parsed ticket data.
   */
  static async processTicketImage(imageUri: string): Promise<TicketData> {
    const startTime = Date.now();
    try {
      console.log('Processing ticket image with URI:', imageUri);

      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'ticket.jpg',
      } as any);

      console.log('Sending request to backend API:', `${this.API_BASE_URL}/games/tickets/extract_ticket_data/`);

      // Get access token
      const token = await SecureStore.getItemAsync('access_token');
      console.log('Retrieved access token:', token ? 'Token exists' : 'No token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      // Call backend API
      const response = await fetch(`${this.API_BASE_URL}/games/tickets/extract_ticket_data/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Backend response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error data:', errorData);
        throw new Error(errorData.error || 'Failed to extract ticket data');
      }

      const data = await response.json();
      console.log('Extracted data:', data);
      console.log('Fields retrieved:');
      console.log('- external_ticket_number:', data.external_ticket_number);
      console.log('- stake:', data.stake);
      console.log('- CRC:', data.CRC);
      console.log('- Detaillant:', data.Detaillant);
      
      const duration = Date.now() - startTime;
      
      // Track successful OCR
      await FirebaseService.trackTicketScan(true);
      await FirebaseService.trackOcrProcessingTime(duration, true);
      
      return {
        external_ticket_number: data.external_ticket_number || null,
        stake: data.stake || null,
        CRC: data.CRC || null,
        Detaillant: data.Detaillant || null,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Track failed OCR
      await FirebaseService.trackTicketScan(false, error instanceof Error ? error.message : 'Unknown error');
      await FirebaseService.trackOcrProcessingTime(duration, false);
      await FirebaseService.trackError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ocr_processing',
      });
      
      console.error('Error processing ticket image:', error);
      throw error;
    }
  }
}

export default OcrService;
export type { TicketData };