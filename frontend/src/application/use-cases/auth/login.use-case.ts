import type { User } from '~/src/domain/entities/user';
import type { AuthRepository } from '~/src/domain/repositories/auth.repository';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(username: string, password: string): Promise<User> {
    if (!username || !password) {
      throw new Error('Usuario y contraseña son requeridos');
    }

    const user = await this.authRepository.login(username, password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    return user;
  }
}
