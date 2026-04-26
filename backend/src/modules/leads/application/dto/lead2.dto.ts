/**
 * DTOs para Lead2
 * Data Transfer Objects para comunicación entre capas
 */

import type { Lead, TipoLead, EstadoLead } from '../../domain/entities/Lead2';

// DTO para crear Lead2
export interface CrearLead2Request {
  nombre: string;
  email: string;
  telefono: string;
  tipo: TipoLead;
}

// DTO para comunicación con el dominio
export interface CrearLead2Data {
  nombre: string;
  email: string;
  telefono: string;
  tipo: TipoLead;
  idUsuario: number;
}

// DTO para actualizar Lead2
export interface ActualizarLead2Request {
  nombre?: string;
  email?: string;
  telefono?: string;
  tipo?: TipoLead;
  estado?: EstadoLead;
}

// DTO para respuesta
export interface Lead2Response {
  success: boolean;
  lead?: Lead;
  error?: string;
}
