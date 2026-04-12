import type { LoginRequest, LoginResponse, UserSession } from 'shared/types';
import { hash, verify } from '~/src/shared/utils/hash';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { username, password } = credentials;
    
    // TODO: Implementar lógica de autenticación
    // 1. Buscar usuario en la base de datos
    // 2. Verificar contraseña
    // 3. Retornar datos del usuario
    
    // Mock para desarrollo
    if (username === 'admin' && password === 'admin123') {
      return {
        status: 'success',
        message: 'Login exitoso',
        user: {
          id: 1,
          nombre_usuario: 'admin',
          nombre_completo: 'Administrador del Sistema',
          rol: 'Administrador'
        }
      };
    }
    
    throw new Error('Credenciales inválidas');
  }

  async validateUser(userId: number): Promise<UserSession | null> {
    // TODO: Implementar validación de usuario
    return null;
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return verify(password, hashedPassword);
  }
}

export const authService = new AuthService();
