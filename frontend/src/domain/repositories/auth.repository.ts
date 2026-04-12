import type { User } from '~/src/domain/entities/user';

export interface AuthRepository {
  login(username: string, password: string): Promise<User | null>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
