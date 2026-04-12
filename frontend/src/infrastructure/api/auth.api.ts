import type { User } from '~/src/domain/entities/user';
import type { LoginRequest, LoginResponse, UserSession, ApiResponse } from '~/src/types/api';
import type { AuthRepository } from '~/src/domain/repositories/auth.repository';

export class AuthApiRepository implements AuthRepository {
  private apiBase: string;

  constructor() {
    const config = useRuntimeConfig();
    this.apiBase = config.public.apiBase;
  }

  async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await $fetch<any>(`${this.apiBase}/api/auth/login`, {
        method: 'POST',
        body: { username, password }
      });

      if (response.status === 'success') {
        return {
          id: response.user.id,
          username: response.user.nombre_usuario,
          fullName: response.user.nombre_completo,
          role: response.user.rol
        };
      }

      return null;
    } catch (error) {
      console.error('Login API error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await $fetch(`${this.apiBase}/api/auth/logout`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await $fetch<any>(`${this.apiBase}/api/auth/me`);
      
      if (response.status === 'success') {
        return {
          id: response.user.id,
          username: response.user.nombre_usuario,
          fullName: response.user.nombre_completo,
          role: response.user.rol
        };
      }

      return null;
    } catch (error) {
      console.error('Get current user API error:', error);
      return null;
    }
  }
}
