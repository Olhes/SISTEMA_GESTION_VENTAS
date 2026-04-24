/**
 * Entidad de Persistencia: ContractEntity
 * Separada de la entidad de dominio para cumplir con la Dependency Rule
 * Contiene anotaciones y dependencias de infraestructura
 */

// Entidad principal de base de datos
export interface ContractEntity {
  id_contrato: number;
  fecha_emision: string;
  id_propiedad: number;
  id_persona: number;
  estado: string;
  monto: number | null;
  condiciones: string | null;
  fecha_firma: string | null;
  observaciones: string | null;
}

// Entidades combinadas para consultas complejas
export interface ContractWithDetailsEntity extends ContractEntity {
  // Datos de propiedad
  propiedad_direccion: string;
  propiedad_precio_negociable: number;
  
  // Datos de persona
  persona_nombres: string;
  persona_apellido_paterno: string;
  persona_apellido_materno: string;
  persona_tipo_documento: string;
  persona_numero_documento: string;
}

// Entidades para relaciones específicas
export interface ContractPropertyEntity {
  id_contrato: number;
  id_propiedad: number;
  direccion: string;
  precio_negociable: number;
}

export interface ContractPersonEntity {
  id_contrato: number;
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  tipo_documento: string;
  numero_documento: string;
}
