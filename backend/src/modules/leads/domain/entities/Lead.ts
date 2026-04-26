/**
 * Aggregate Root: Lead
 * Entidad pura de dominio sin dependencias de infraestructura
 */
export type TipoPersona = "Cliente" | "Referido" | "Lead Alvas" | "Lead Propio";
export type EstadoVendedor = "Seguimiento" | "Cierre" | "No responde";
export type EstadoComprador = 
  | "Aún no se ha contactado"
  | "Esperando respuesta"
  | "Agendó visita guiada"
  | "Venta concretada"
  | "No está interesado";

export interface PersonaBase {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correo: string | null;
  tipoPersona: TipoPersona;
  fechaCreacion: Date;
}

export interface Lead extends PersonaBase {
  // Datos específicos para leads de vendedores
  estadoVendedor?: EstadoVendedor;
  
  // Datos específicos para leads de compradores
  estadoComprador?: EstadoComprador;
  
  // Datos comunes de gestión
  observacion?: string | null;
  idUsuario: number;
}

// Value Objects para leads especializados
export interface LeadVendedor extends Lead {
  estadoVendedor: EstadoVendedor;
}

export interface LeadComprador extends Lead {
  estadoComprador: EstadoComprador;
}

// Métodos de dominio
export class LeadAggregate {
  static crearLead(data: import('../../application/dto/lead.dto').CrearLeadData): Lead {
    // Validaciones de negocio
    if (!data.nombres?.trim()) {
      throw new Error('Los nombres son requeridos');
    }
    if (!data.apellidoPaterno?.trim()) {
      throw new Error('El apellido paterno es requerido');
    }
    if (!data.numeroDocumento?.trim()) {
      throw new Error('El número de documento es requerido');
    }
    if (!data.telefono?.trim()) {
      throw new Error('El teléfono es requerido');
    }

    return {
      id: 0, // Se asignará en persistencia
      nombres: data.nombres,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno || '',
      tipoDocumento: data.tipoDocumento || 'DNI',
      numeroDocumento: data.numeroDocumento,
      telefono: data.telefono,
      correo: data.correo || null,
      tipoPersona: data.tipoPersona,
      fechaCreacion: new Date(),
      estadoVendedor: data.estadoVendedor,
      estadoComprador: data.estadoComprador,
      observacion: data.observacion || null,
      idUsuario: data.idUsuario
    };
  }

  static convertirLead(lead: Lead, nuevoTipo: TipoPersona): Lead {
    return {
      ...lead,
      tipoPersona: nuevoTipo
    };
  }

  static esValidoParaConversion(lead: Lead): boolean {
    // Lógica de negocio para determinar si un lead puede ser convertido
    if (lead.estadoVendedor === 'Cierre' || lead.estadoComprador === 'Venta concretada') {
      return true;
    }
    return false;
  }
}

// NOTA: CrearLeadData movido a application/dto/lead.dto.ts
// Los DTOs pertenecen a la capa de aplicación, no al dominio 
