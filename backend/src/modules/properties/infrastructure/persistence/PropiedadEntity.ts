/**
 * Entidad de Persistencia: PropiedadEntity
 * Separada de la entidad de dominio para cumplir con la Dependency Rule
 * Contiene anotaciones y dependencias de infraestructura
 */

// Entidad principal de base de datos
export interface PropiedadEntity {
  id_propiedad: number;
  direccion: string;
  descripcion: string | null;
  medidas: string | null;
  servicios_basicos: string | null;
  precio_negociable: number;
  partida_registral: string | null;
}

// Entidad para relación de interesados
export interface InteresadoEntity {
  id_propiedad: number;
  id_persona: number;
  vendido: boolean;
  separado: boolean;
}

// Entidades combinadas para consultas complejas
export interface PropiedadConInteresadosEntity extends PropiedadEntity {
  total_interesados?: number;
  vendido?: boolean;
  separado?: boolean;
}
