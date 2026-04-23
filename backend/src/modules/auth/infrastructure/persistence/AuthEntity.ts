/**
 * Entidad de Persistencia: AuthEntity
 * Separada de la entidad de dominio para cumplir con la Dependency Rule
 * Contiene anotaciones y dependencias de infraestructura
 */

// Entidad principal de usuarios
export interface UsuarioEntity {
  id_usuario: number;
  id_persona: number;
  nombre_usuario: string;
  contrasena: string;
  id_rol: number;
  fecha_creacion: string;
  ultimo_login?: string;
  activo: boolean;
}

// Entidad de roles
export interface RolEntity {
  id_rol: number;
  nombre_rol: string;
}

// Entidad de sesiones
export interface SesionEntity {
  id_sesion: number;
  id_usuario: number;
  token: string;
  fecha_creacion: string;
  fecha_expiracion: string;
  activa: boolean;
}

// Entidades combinadas para consultas complejas
export interface UsuarioWithDetailsEntity extends UsuarioEntity {
  // Datos de persona
  persona_nombres: string;
  persona_apellido_paterno: string;
  persona_apellido_materno: string;
  persona_tipo_documento: string;
  persona_numero_documento: string;
  
  // Datos de rol
  rol_nombre: string;
}

// Entidades para relaciones específicas
export interface UsuarioPersonaEntity {
  id_usuario: number;
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  tipo_documento: string;
  numero_documento: string;
}

export interface UsuarioRolEntity {
  id_usuario: number;
  id_rol: number;
  nombre_rol: string;
}
