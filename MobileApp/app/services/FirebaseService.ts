/**
 * Firebase Service
 * 
 * High-level service for Firebase operations in the QuattroPlus app.
 * This service provides analytics, crash reporting, and other Firebase features.
 */

import { logEvent, setUserProperties } from './firebase';

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export class FirebaseService {
  /**
   * Log a custom analytics event
   */
  static async trackEvent(eventName: string, params?: Record<string, any>): Promise<void> {
    await logEvent(eventName, params);
  }

  /**
   * Track user login
   */
  static async trackLogin(userId: string, method: string = 'username'): Promise<void> {
    await logEvent('login', {
      method,
      user_id: userId,
    });
    await setUserProperties({
      user_id: userId,
    });
  }

  /**
   * Track user logout
   */
  static async trackLogout(): Promise<void> {
    await logEvent('logout');
  }

  /**
   * Track ticket scan
   */
  static async trackTicketScan(success: boolean, error?: string): Promise<void> {
    await logEvent('ticket_scan', {
      success,
      ...(error && { error }),
    });
  }

  /**
   * Track ticket creation
   */
  static async trackTicketCreate(
    ticketNumber: string,
    stake: number,
    isQuattroPlus: boolean
  ): Promise<void> {
    await logEvent('ticket_create', {
      ticket_number: ticketNumber.substring(0, 10) + '...', // Partial for privacy
      stake,
      is_quattro_plus: isQuattroPlus,
    });
  }

  /**
   * Track game play
   */
  static async trackGamePlay(
    ticketId: number,
    numbers: number[],
    hasWon: boolean,
    gift?: string
  ): Promise<void> {
    await logEvent('game_play', {
      ticket_id: ticketId,
      numbers: numbers.join(','),
      has_won: hasWon,
      ...(gift && { gift }),
    });
  }

  /**
   * Track screen view
   */
  static async trackScreenView(screenName: string, screenClass?: string): Promise<void> {
    await logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  }

  /**
   * Track error
   */
  static async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    await logEvent('error', {
      error_message: error.message,
      error_name: error.name,
      ...context,
    });
  }

  /**
   * Set user ID for analytics
   */
  static async setUserId(userId: string): Promise<void> {
    await setUserProperties({
      user_id: userId,
    });
  }

  /**
   * Set user properties
   */
  static async setUserProperty(key: string, value: string): Promise<void> {
    await setUserProperties({
      [key]: value,
    });
  }

  /**
   * Track button click
   */
  static async trackButtonClick(buttonName: string, screen?: string): Promise<void> {
    await logEvent('button_click', {
      button_name: buttonName,
      ...(screen && { screen }),
    });
  }

  /**
   * Track OCR processing time
   */
  static async trackOcrProcessingTime(duration: number, success: boolean): Promise<void> {
    await logEvent('ocr_processing', {
      duration_ms: duration,
      success,
    });
  }
}

export default FirebaseService;

