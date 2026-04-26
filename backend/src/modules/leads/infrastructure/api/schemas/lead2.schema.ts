/**
 * Schemas de API para Lead2
 * Data Transfer Objects para comunicación HTTP
 */

import type { TipoLead, EstadoLead } from '../../../domain/entities/Lead2';

// Schema para crear lead via API
export interface CrearLead2APIRequest {
  nombre: string;
  email: string;
  telefono: string;
  tipo: TipoLead;
}

// Schema para actualizar lead via API
export interface ActualizarLead2APIRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  tipo?: TipoLead;
  estado?: EstadoLead;
}

// Schema para respuesta de API
export interface Lead2APIResponse {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  tipo: TipoLead;
  estado: EstadoLead;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Schema para listar leads
export interface ListarLeads2APIResponse {
  status: "success" | "error";
  message: string;
  data: Lead2APIResponse[];
  total?: number;
}
