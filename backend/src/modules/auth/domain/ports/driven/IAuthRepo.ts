/**
 * Puerto Secundario: Interfaz del Repositorio de Autenticación
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Usuario, UsuarioConDetalles, Sesion, Rol, Credenciales } from '../../entities/Auth';

export interface IAuthRepo {
  // Operaciones de usuarios
  findById(id: number): Promise<Usuario | null>;
  findByNombreUsuario(nombreUsuario: string): Promise<Usuario | null>;
  findAll(): Promise<UsuarioConDetalles[]>;
  save(usuario: Usuario): Promise<Usuario>;
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario>;
  delete(id: number): Promise<void>;
  
  // Operaciones con detalles
  findByIdWithDetails(id: number): Promise<UsuarioConDetalles | null>;
  findByNombreUsuarioWithDetails(nombreUsuario: string): Promise<UsuarioConDetalles | null>;
  
  // Validaciones de negocio
  nombreUsuarioDisponible(nombreUsuario: string): Promise<boolean>;
  personaValida(idPersona: number): Promise<boolean>;
  rolValido(idRol: number): Promise<boolean>;
  
  // Operaciones de sesiones
  crearSesion(sesion: Omit<Sesion, 'id' | 'fechaCreacion'>): Promise<Sesion>;
  findByToken(token: string): Promise<Sesion | null>;
  updateSesion(id: number, sesion: Partial<Sesion>): Promise<Sesion>;
  deleteSesion(id: number): Promise<void>;
  findSesionesActivasByUsuario(idUsuario: number): Promise<Sesion[]>;
  deleteSesionesByUsuario(idUsuario: number): Promise<void>;
  
  // Operaciones de roles
  findAllRoles(): Promise<Rol[]>;
  findRolById(id: number): Promise<Rol | null>;
}

// DTOs para operaciones del repositorio
export interface CreateUsuarioData {
  id_persona: number;
  nombre_usuario: string;
  contrasena: string;
  id_rol: number;
  fecha_creacion: string;
  ultimo_login?: string;
  activo: boolean;
}

export interface CreateSesionData {
  id_usuario: number;
  token: string;
  fecha_creacion: string;
  fecha_expiracion: string;
  activa: boolean;
}
