/**
 * Puerto Secundario: Interfaz del Repositorio de Propiedades
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Propiedad } from '../../entities/Propiedad';

export interface IPropiedadRepo {
  // Operaciones CRUD básicas
  findById(id: number): Promise<Propiedad | null>;
  findAll(): Promise<Propiedad[]>;
  save(propiedad: Propiedad): Promise<Propiedad>;
  update(id: number, propiedad: Partial<Propiedad>): Promise<Propiedad>;
  delete(id: number): Promise<void>;
  
  // Operaciones de negocio
  registrarInteres(idPersona: number, idPropiedad: number): Promise<void>;
  findPropiedadesInteresadas(idPersona: number): Promise<Propiedad[]>;
  actualizarEstadoPropiedad(idPropiedad: number, vendido: boolean, separado: boolean): Promise<void>;
}

// DTOs para operaciones del repositorio
export interface CreatePropiedadData {
  direccion: string;
  descripcion: string | null;
  medidas: string | null;
  serviciosBasicos: string | null;
  precioNegociable: number;
  partidaRegistral: string | null;
}
