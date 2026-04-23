/**
 * Entidad de Persistencia: LeadEntity
 * Separada de la entidad de dominio para cumplir con la Dependency Rule
 * Contiene anotaciones y dependencias de infraestructura
 */

// Entidad principal de base de datos
export interface LeadEntity {
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
  correo: string | null;
  tipo_persona: string;
  fecha_creacion: string;
}

// Entidades para relaciones específicas
export interface UsuarioVendedorEntity {
  id_usuario: number;
  id_persona: number;
  estado_vendedor: string;
  observacion: string | null;
}

export interface UsuarioCompradorEntity {
  id_usuario: number;
  id_persona: number;
  estado_comprador: string;
  observacion: string | null;
}

// Entidades combinadas para consultas complejas
export interface LeadVendedorEntity extends LeadEntity {
  estado_vendedor: string;
  observacion_vendedor: string | null;
  id_usuario: number;
}

export interface LeadCompradorEntity extends LeadEntity {
  estado_comprador: string;
  observacion_comprador: string | null;
  id_usuario: number;
}
