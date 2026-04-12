export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'Administrador' | 'Asesor';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}
