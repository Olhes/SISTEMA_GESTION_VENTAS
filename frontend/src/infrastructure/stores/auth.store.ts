import { defineStore } from 'pinia';
import type { User, AuthState } from '~/src/domain/entities/user';
import { LoginUseCase } from '~/src/application/use-cases/auth/login.use-case';
import { AuthApiRepository } from '~/src/infrastructure/api/auth.api';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    token: undefined
  }),

  persist: {
    storage: persistedState.localStorage,
    paths: ['user', 'isAuthenticated', 'token']
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'Administrador',
    isAsesor: (state) => state.user?.role === 'Asesor',
    userFullName: (state) => state.user?.fullName || ''
  },

  actions: {
    async login(username: string, password: string) {
      const authRepository = new AuthApiRepository();
      const loginUseCase = new LoginUseCase(authRepository);

      try {
        const user = await loginUseCase.execute(username, password);
        
        this.user = user;
        this.isAuthenticated = true;
        
        return { success: true, user };
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    async logout() {
      const authRepository = new AuthApiRepository();
      await authRepository.logout();
      
      this.user = null;
      this.isAuthenticated = false;
      this.token = undefined;
    },

    async checkAuth() {
      if (this.isAuthenticated && this.user) {
        return true;
      }

      const authRepository = new AuthApiRepository();
      const user = await authRepository.getCurrentUser();
      
      if (user) {
        this.user = user;
        this.isAuthenticated = true;
        return true;
      }

      this.logout();
      return false;
    }
  }
});
