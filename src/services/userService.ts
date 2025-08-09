/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 *
 * User Service for CRM Control Panel
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
import { User, PaginatedResponse, ApiResponse, UserRole } from '@/types';

// TESTING IMPORTS - Remove in production
import { mockUserService, isMockApiEnabled } from './mockApiService';

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserFilters {
  search?: string;
  role?: UserRole | undefined;
  isActive?: boolean | undefined;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UserService {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    // TESTING: Use mock API if enabled
    if (isMockApiEnabled()) {
      return mockUserService.getUsers(filters);
    }

    // PRODUCTION: Use real API
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedResponse<User>>(
      `/users?${params.toString()}`
    );
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // TESTING: Use mock API if enabled
    if (isMockApiEnabled()) {
      return mockUserService.createUser(userData);
    }

    // PRODUCTION: Use real API
    const response = await apiClient.post<ApiResponse<User>>(
      '/users',
      userData
    );
    return response.data.data;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      userData
    );
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    await apiClient.post('/users/bulk-delete', { ids });
  }

  async toggleUserStatus(id: string): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}/toggle-status`
    );
    return response.data.data;
  }

  async resetUserPassword(id: string): Promise<void> {
    await apiClient.post(`/users/${id}/reset-password`);
  }

  async exportUsers(filters: UserFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/users/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  async importUsers(
    file: File
  ): Promise<{ success: number; errors: string[] }> {
    const response = await apiClient.uploadFile<{
      success: number;
      errors: string[];
    }>('/users/import', file);
    return response.data;
  }
}

export const userService = new UserService();
