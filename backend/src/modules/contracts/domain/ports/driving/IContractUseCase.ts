/**
 * Puerto Primario: Interfaz del Caso de Uso de Contratos
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Contrato, ContratoConDetalles, EstadoContrato } from '../../entities/Contract';

export interface IContractUseCase {
  // Operaciones CRUD
  listarContratos(): Promise<Contrato[]>;
  crearContrato(contratoData: CrearContratoRequest): Promise<Contrato>;
  actualizarContrato(id: number, contratoData: Partial<ActualizarContratoRequest>): Promise<Contrato>;
  eliminarContrato(id: number): Promise<void>;
  obtenerContratoPorId(id: number): Promise<Contrato | null>;
  
  // Operaciones de negocio
  firmarContrato(id: number, fechaFirma?: Date): Promise<Contrato>;
  cancelarContrato(id: number, motivo?: string): Promise<Contrato>;
  completarContrato(id: number): Promise<Contrato>;
  
  // Consultas especializadas
  listarContratosPorEstado(estado: EstadoContrato): Promise<Contrato[]>;
  listarContratosPorPersona(idPersona: number): Promise<ContratoConDetalles[]>;
  listarContratosPorPropiedad(idPropiedad: number): Promise<ContratoConDetalles[]>;
  obtenerContratosConDetalles(): Promise<ContratoConDetalles[]>;
}

// DTOs para requests del caso de uso
export interface CrearContratoRequest {
  idPropiedad: number;
  idPersona: number;
  monto?: number;
  condiciones?: string;
  observaciones?: string;
}

export interface ActualizarContratoRequest {
  monto?: number;
  condiciones?: string;
  observaciones?: string;
}

export interface FirmarContratoRequest {
  fechaFirma?: Date;
}

export interface CancelarContratoRequest {
  motivo?: string;
}
