import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL} from './config';
import { Platform } from 'react-native';
import FirebaseService from './FirebaseService';


export const AuthService = {
  async login(username: string, password: string) {
    try {
      const baseUrl = API_BASE_URL;
      console.log("LOGIN API URL =", `${baseUrl}/auth/login/`);
      const response = await axios.post(`${baseUrl}/auth/login/`, {
        username,
        password,
      });

      // Store tokens securely
      await SecureStore.setItemAsync('access_token', response.data.access);
      await SecureStore.setItemAsync('refresh_token', response.data.refresh);
      await SecureStore.setItemAsync('user_role', response.data.role);

      // Track login with Firebase
      await FirebaseService.trackLogin(username, 'username');
      await FirebaseService.setUserId(username);

      return { success: true, role: response.data.role };
    } catch (error: any) {
      console.log("LOGIN ERROR FULL OBJECT:", error);
      
      // Track login error with Firebase
      await FirebaseService.trackError(error instanceof Error ? error : new Error(String(error)), {
        context: 'login',
        username: username.substring(0, 3) + '***', // Partial for privacy
      });
    
      if (error.response) {
        console.log("RESPONSE STATUS:", error.response.status);
        console.log("RESPONSE DATA:", error.response.data);
        throw new Error(
          error.response.data?.error || "Server responded with an error"
        );
      }
    
      if (error.request) {
        console.log("NO RESPONSE RECEIVED:", error.request);
        throw new Error("No response from server (network / SSL issue)");
      }
    
      console.log("ERROR MESSAGE:", error.message);
      throw new Error(error.message || "Unknown login error");
    }
  },    

  async getProfile() {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const baseUrl = API_BASE_URL;
      const response = await axios.get(`${baseUrl}/auth/profile/`, {
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
        throw new Error('Failed to fetch profile. Please try again.');
      }
    }
  },

  async logout() {
    try {
      // Clear stored tokens
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user_role');
      
      // Track logout with Firebase
      await FirebaseService.trackLogout();
      
      return { success: true };
    } catch (error: any) {
      await FirebaseService.trackError(error instanceof Error ? error : new Error(String(error)), {
        context: 'logout',
      });
      throw new Error('Logout failed. Please try again.');
    }
  },

};