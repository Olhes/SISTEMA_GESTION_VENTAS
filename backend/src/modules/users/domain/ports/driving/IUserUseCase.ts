/**
 * Puerto Primario: Interfaz del Caso de Uso de Usuarios
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Usuario, UsuarioConDetalles, EstadoUsuario } from '../../entities/User';

export interface IUserUseCase {
  // Operaciones CRUD
  listarUsuarios(): Promise<Usuario[]>;
  crearUsuario(usuarioData: CrearUsuarioRequest): Promise<Usuario>;
  actualizarUsuario(id: number, usuarioData: Partial<ActualizarUsuarioRequest>): Promise<Usuario>;
  eliminarUsuario(id: number): Promise<void>;
  obtenerUsuarioPorId(id: number): Promise<Usuario | null>;
  
  // Operaciones de autenticación y gestión
  login(credenciales: LoginRequest): Promise<LoginResponse>;
  cambiarContrasena(id: number, data: CambiarContrasenaRequest): Promise<void>;
  resetearContrasena(id: number, data: ResetearContrasenaRequest): Promise<void>;
  actualizarUltimoLogin(id: number): Promise<void>;
  
  // Operaciones de estado
  activarUsuario(id: number): Promise<Usuario>;
  desactivarUsuario(id: number): Promise<Usuario>;
  suspenderUsuario(id: number, motivo?: string): Promise<Usuario>;
  
  // Consultas especializadas
  listarUsuariosConDetalles(): Promise<UsuarioConDetalles[]>;
  listarUsuariosPorEstado(estado: EstadoUsuario): Promise<Usuario[]>;
  listarUsuariosPorRol(idRol: number): Promise<UsuarioConDetalles[]>;
  obtenerUsuarioPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null>;
  obtenerUsuarioPorNombreUsuarioConDetalles(nombreUsuario: string): Promise<UsuarioConDetalles | null>;
  
  // Operaciones de búsqueda y filtrado
  buscarUsuarios(termino: string): Promise<UsuarioConDetalles[]>;
  listarUsuariosInactivos(diasLimite?: number): Promise<UsuarioConDetalles[]>;
  obtenerEstadisticas(): Promise<UserEstadisticas>;
}

// DTOs para requests del caso de uso
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
}

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
    estado: string;
  };
  token?: string;
  expiresIn?: number;
}

export interface CambiarContrasenaRequest {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface ResetearContrasenaRequest {
  nuevaContrasena: string;
}

export interface SuspenderUsuarioRequest {
  motivo?: string;
}

export interface BuscarUsuariosRequest {
  termino: string;
  limite?: number;
}

export interface UserEstadisticas {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  usuariosSuspendidos: number;
  usuariosPorRol: Record<string, number>;
  usuariosInactivosPorDias: number;
  ultimoRegistro: string;
  promedioInactividad: number; // en días
}
