/**
 * Puerto Secundario: Interfaz del Repositorio de Leads
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Lead, LeadVendedor, LeadComprador, TipoPersona } from '../../entities/Lead';

export interface ILeadRepo {
  // Operaciones CRUD básicas
  findById(id: number): Promise<Lead | null>;
  save(lead: Lead): Promise<Lead>;
  update(id: number, lead: Partial<Lead>): Promise<Lead>;
  delete(id: number): Promise<void>;
  
  // Operaciones de negocio para leads
  findLeadsVendedor(idUsuario: number): Promise<LeadVendedor[]>;
  findLeadsComprador(idUsuario: number): Promise<LeadComprador[]>;
  createLead(leadData: CreateLeadData): Promise<Lead>;
  convertirLead(id: number, nuevoTipo: TipoPersona): Promise<void>;
}

// DTOs para operaciones del repositorio
export interface CreateLeadData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correo: string | null;
  tipoPersona: TipoPersona;
  idUsuario: number;
  estadoVendedor?: string;
  estadoComprador?: string;
  observacion?: string | null;
}
