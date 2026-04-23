/**
 * Puerto Primario: Interfaz del Caso de Uso de Autenticación
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Usuario, UsuarioConDetalles, Sesion, Rol, Credenciales } from '../../entities/Auth';

export interface IAuthUseCase {
  // Operaciones de autenticación
  login(credenciales: LoginRequest): Promise<LoginResponse>;
  logout(token: string): Promise<void>;
  validarToken(token: string): Promise<UsuarioConDetalles | null>;
  refrescarToken(token: string): Promise<string>;
  
  // Operaciones de usuarios
  crearUsuario(usuarioData: CrearUsuarioRequest): Promise<Usuario>;
  actualizarUsuario(id: number, usuarioData: Partial<ActualizarUsuarioRequest>): Promise<Usuario>;
  eliminarUsuario(id: number): Promise<void>;
  obtenerUsuarioPorId(id: number): Promise<Usuario | null>;
  obtenerUsuarioPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null>;
  listarUsuarios(): Promise<UsuarioConDetalles[]>;
  
  // Operaciones de gestión de usuarios
  activarUsuario(id: number): Promise<Usuario>;
  desactivarUsuario(id: number): Promise<Usuario>;
  cambiarContrasena(id: number, contrasenaActual: string, nuevaContrasena: string): Promise<void>;
  
  // Operaciones de roles
  listarRoles(): Promise<Rol[]>;
  obtenerRolPorId(id: number): Promise<Rol | null>;
  
  // Operaciones de sesiones
  listarSesionesActivas(idUsuario: number): Promise<Sesion[]>;
  cerrarTodasLasSesiones(idUsuario: number): Promise<void>;
}

// DTOs para requests del caso de uso
export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id: number;
    nombreUsuario: string;
    nombreCompleto: string;
    rol: string;
  };
  token?: string;
  expiresIn?: number;
}

export interface CrearUsuarioRequest {
  idPersona: number;
  nombreUsuario: string;
  contrasena: string;
  idRol: number;
}

export interface ActualizarUsuarioRequest {
  nombreUsuario?: string;
  contrasena?: string;
  idRol?: number;
  activo?: boolean;
}

export interface CambiarContrasenaRequest {
  contrasenaActual: string;
  nuevaContrasena: string;
}
