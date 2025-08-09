/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 *
 * Authentication Service for CRM Control Panel
 *
 * PRODUCTION NOTE: This service automatically switches between mock and production APIs
 * based on the REACT_APP_USE_MOCK_API environment variable.
 *
 * For production deployment:
 * - Set REACT_APP_USE_MOCK_API=false
 * - Configure your production API endpoints
 * - Remove mock API imports and logic
 */

import { apiClient } from './apiClient';
import { LoginCredentials, LoginResponse, User } from '@/types';

// TESTING IMPORTS - Remove in production
import { mockAuthService, isMockApiEnabled } from './mockApiService';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // TESTING: Use mock API if enabled
    if (isMockApiEnabled()) {
      return mockAuthService.login(credentials);
    }

    // PRODUCTION: Use real API
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  }

  async logout(): Promise<void> {
    // TESTING: Use mock API if enabled
    if (isMockApiEnabled()) {
      return mockAuthService.logout();
    }

    // PRODUCTION: Use real API
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // TESTING: Use mock API if enabled
    if (isMockApiEnabled()) {
      const result = await mockAuthService.refreshToken(refreshToken);
      return result.token;
    }

    // PRODUCTION: Use real API
    const response = await apiClient.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });
    return response.data.token;
  }

  async getCurrentUser(): Promise<User> {
    // TESTING: Use mock API if enabled
    if (isMockApiEnabled()) {
      return mockAuthService.getCurrentUser();
    }

    // PRODUCTION: Use real API
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<void> {
    await apiClient.post('/auth/resend-verification');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  getTokenExpirationTime(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
