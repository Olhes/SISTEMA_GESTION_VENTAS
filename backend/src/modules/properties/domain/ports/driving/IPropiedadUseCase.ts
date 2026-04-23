/**
 * Puerto Primario: Interfaz del Caso de Uso de Propiedades
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Propiedad } from '../../entities/Propiedad';

export interface IPropiedadUseCase {
  // Operaciones CRUD
  listarPropiedades(): Promise<Propiedad[]>;
  crearPropiedad(propiedadData: CrearPropiedadRequest): Promise<Propiedad>;
  actualizarPropiedad(id: number, propiedadData: Partial<ActualizarPropiedadRequest>): Promise<Propiedad>;
  eliminarPropiedad(id: number): Promise<void>;
  obtenerPropiedadPorId(id: number): Promise<Propiedad | null>;
  
  // Operaciones de negocio
  registrarInteres(idPersona: number, idPropiedad: number): Promise<void>;
  listarPropiedadesInteresadas(idPersona: number): Promise<Propiedad[]>;
  actualizarEstadoPropiedad(idPropiedad: number, vendido: boolean, separado: boolean): Promise<void>;
}

// DTOs para requests del caso de uso
export interface CrearPropiedadRequest {
  direccion: string;
  descripcion?: string;
  medidas?: string;
  serviciosBasicos?: string;
  precioNegociable: number;
  partidaRegistral?: string;
}

export interface ActualizarPropiedadRequest {
  direccion?: string;
  descripcion?: string;
  medidas?: string;
  serviciosBasicos?: string;
  precioNegociable?: number;
  partidaRegistral?: string;
}
