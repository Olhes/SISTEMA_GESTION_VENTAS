/**
 * Puerto Secundario: Interfaz del Repositorio de Contratos
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Contrato, ContratoConDetalles, EstadoContrato } from '../../entities/Contract';

export interface IContractRepo {
  // Operaciones CRUD básicas
  findById(id: number): Promise<Contrato | null>;
  findAll(): Promise<Contrato[]>;
  save(contrato: Contrato): Promise<Contrato>;
  update(id: number, contrato: Partial<Contrato>): Promise<Contrato>;
  delete(id: number): Promise<void>;
  
  // Operaciones de negocio
  findByEstado(estado: EstadoContrato): Promise<Contrato[]>;
  findByPersona(idPersona: number): Promise<ContratoConDetalles[]>;
  findByPropiedad(idPropiedad: number): Promise<ContratoConDetalles[]>;
  findAllWithDetalles(): Promise<ContratoConDetalles[]>;
  
  // Validaciones de negocio
  propiedadDisponible(idPropiedad: number): Promise<boolean>;
  personaValida(idPersona: number): Promise<boolean>;
}

// DTOs para operaciones del repositorio
export interface CreateContractData {
  fecha_emision: string;
  id_propiedad: number;
  id_persona: number;
  estado: string;
  monto?: number;
  condiciones?: string;
  fecha_firma?: string;
  observaciones?: string;
}
