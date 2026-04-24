/**
 * Entidad de Persistencia: UserEntity
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
  estado: string;
  fecha_creacion: string;
  ultimo_login?: string;
  fecha_modificacion?: string;
}

// Entidad de roles
export interface RolEntity {
  id_rol: number;
  nombre_rol: string;
}

// Entidades combinadas para consultas complejas
export interface UsuarioWithDetailsEntity extends UsuarioEntity {
  // Datos de persona
  persona_nombres: string;
  persona_apellido_paterno: string;
  persona_apellido_materno: string;
  persona_tipo_documento: string;
  persona_numero_documento: string;
  persona_telefono: string;
  persona_correo: string;
  
  // Datos de rol
  rol_nombre: string;
  
  // Estadísticas adicionales
  total_leads_gestionados?: number;
  total_citas_agendadas?: number;
  total_ventas_realizadas?: number;
  ultima_actividad?: string;
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
  telefono: string;
  correo: string;
}

export interface UsuarioRolEntity {
  id_usuario: number;
  id_rol: number;
  nombre_rol: string;
}

export interface UsuarioEstadisticasEntity {
  id_usuario: number;
  total_leads_gestionados: number;
  total_citas_agendadas: number;
  total_ventas_realizadas: number;
  ultima_actividad: string;
}
