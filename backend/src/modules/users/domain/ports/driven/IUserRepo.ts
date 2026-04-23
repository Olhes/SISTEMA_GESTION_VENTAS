/**
 * Puerto Secundario: Interfaz del Repositorio de Usuarios
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Usuario, UsuarioConDetalles, EstadoUsuario } from '../../entities/User';

export interface IUserRepo {
  // Operaciones CRUD básicas
  findById(id: number): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  save(usuario: Usuario): Promise<Usuario>;
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario>;
  delete(id: number): Promise<void>;
  
  // Operaciones con detalles
  findByIdWithDetails(id: number): Promise<UsuarioConDetalles | null>;
  findAllWithDetails(): Promise<UsuarioConDetalles[]>;
  
  // Operaciones de consulta especializadas
  findByNombreUsuario(nombreUsuario: string): Promise<Usuario | null>;
  findByNombreUsuarioWithDetails(nombreUsuario: string): Promise<UsuarioConDetalles | null>;
  findByEstado(estado: EstadoUsuario): Promise<Usuario[]>;
  findByRol(idRol: number): Promise<UsuarioConDetalles[]>;
  searchByTerm(termino: string, limite?: number): Promise<UsuarioConDetalles[]>;
  findInactive(diasLimite: number): Promise<UsuarioConDetalles[]>;
  
  // Validaciones de negocio
  nombreUsuarioDisponible(nombreUsuario: string, excludeId?: number): Promise<boolean>;
  personaValida(idPersona: number): Promise<boolean>;
  rolValido(idRol: number): Promise<boolean>;
  
  // Estadísticas y análisis
  getTotalCount(): Promise<number>;
  getCountByEstado(): Promise<Record<EstadoUsuario, number>>;
  getCountByRol(): Promise<Record<number, number>>;
  getInactiveCount(diasLimite: number): Promise<number>;
  getLastRegistered(): Promise<Date>;
  getAverageInactivityDays(): Promise<number>;
}

// DTOs para operaciones del repositorio
export interface CreateUsuarioData {
  id_persona: number;
  nombre_usuario: string;
  contrasena: string;
  id_rol: number;
  estado: string;
  fecha_creacion: string;
  ultimo_login?: string;
  fecha_modificacion?: string;
}
