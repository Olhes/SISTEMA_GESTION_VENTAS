/**
 * Entidad de Persistencia: AppointmentEntity
 * Separada de la entidad de dominio para cumplir con la Dependency Rule
 * Contiene anotaciones y dependencias de infraestructura
 */

// Entidad principal de citas
export interface CitaEntity {
  id_cita: number;
  fecha_agendada: string;
  observacion: string | null;
  estado_visita_guiada: string;
  id_persona: number;
  id_usuario: number;
  fecha_creacion: string;
  fecha_modificacion: string | null;
}

// Entidades combinadas para consultas complejas
export interface CitaWithDetailsEntity extends CitaEntity {
  // Datos de persona
  persona_nombres: string;
  persona_apellido_paterno: string;
  persona_apellido_materno: string;
  persona_telefono: string;
  persona_correo: string | null;
  
  // Datos de usuario
  usuario_nombre_usuario: string;
  usuario_rol: string;
  
  // Datos de propiedad (si aplica)
  propiedad_id?: number;
  propiedad_direccion?: string;
  propiedad_precio_negociable?: number;
}

// Entidades para relaciones específicas
export interface CitaPersonaEntity {
  id_cita: number;
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  correo: string | null;
}

export interface CitaUsuarioEntity {
  id_cita: number;
  id_usuario: number;
  nombre_usuario: string;
  rol: string;
}

export interface CitaPropiedadEntity {
  id_cita: number;
  id_propiedad: number;
  direccion: string;
  precio_negociable: number;
}
