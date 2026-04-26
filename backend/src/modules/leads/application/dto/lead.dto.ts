/**
 * DTOs para la capa de aplicación
 * Data Transfer Objects para comunicación entre capas
 */

import type { Lead, TipoPersona, EstadoVendedor, EstadoComprador } from '../../domain/entities/Lead';

// DTOs para comunicación con el dominio
export interface CrearLeadData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  telefono: string;
  correo?: string;
  tipoPersona: TipoPersona;
  idUsuario: number;
  estadoVendedor?: EstadoVendedor;
  estadoComprador?: EstadoComprador;
  observacion?: string;
}

// DTOs para comunicación entre capas
export interface CrearLeadRequest {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correo?: string;
  tipoPersona: TipoPersona;
  idUsuario: number;
}

export interface CrearLeadResponse {
  success: boolean;
  lead?: Lead;
  error?: string;
}

export interface ListarLeadsRequest {
  idUsuario?: number;
  tipoPersona?: TipoPersona;
  estadoVendedor?: EstadoVendedor;
  limit?: number;
  offset?: number;
}

export interface ListarLeadsResponse {
  success: boolean;
  leads: Lead[];
  total: number;
  error?: string;
}

export interface ActualizarLeadRequest {
  id: number;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  telefono?: string;
  correo?: string;
  estadoVendedor?: EstadoVendedor;
  estadoComprador?: EstadoComprador;
  observacion?: string;
}

export interface ActualizarLeadResponse {
  success: boolean;
  lead?: Lead;
  error?: string;
}

export interface ConvertirLeadRequest {
  id: number;
  tipoConversion: 'vendedor-a-comprador' | 'comprador-a-vendedor';
  observacion: string;
}

export interface ConvertirLeadResponse {
  success: boolean;
  lead?: Lead;
  error?: string;
}
