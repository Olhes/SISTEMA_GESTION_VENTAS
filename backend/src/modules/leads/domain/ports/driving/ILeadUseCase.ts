/**
 * Puerto Primario: Interfaz del Caso de Uso de Leads
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Lead, LeadVendedor, LeadComprador, TipoPersona } from '../../entities/Lead';

export interface ILeadUseCase {
  // Operaciones para leads de vendedores
  listarLeadsVendedor(idUsuario: number): Promise<LeadVendedor[]>;
  
  // Operaciones para leads de compradores
  listarLeadsComprador(idUsuario: number): Promise<LeadComprador[]>;
  
  // Gestión de leads
  crearLead(leadData: CrearLeadRequest): Promise<Lead>;
  actualizarLead(id: number, leadData: Partial<ActualizarLeadRequest>): Promise<Lead>;
  eliminarLead(id: number): Promise<void>;
  obtenerLeadPorId(id: number): Promise<Lead | null>;
  
  // Conversión de leads
  convertirLead(id: number, nuevoTipo: TipoPersona): Promise<void>;
}

// DTOs para requests del caso de uso
export interface CrearLeadRequest {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  telefono: string;
  correo?: string;
  tipoPersona: string;
  idUsuario: number;
  estadoVendedor?: string;
  estadoComprador?: string;
  observacion?: string;
}

export interface ActualizarLeadRequest {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  telefono?: string;
  correo?: string;
}
