/**
 * Aggregate Root: Contract
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export type EstadoContrato = "Pendiente" | "Firmado" | "Cancelado" | "Completado";

export interface Contrato {
  id: number;
  fechaEmision: Date;
  idPropiedad: number;
  idPersona: number;
  estado: EstadoContrato;
  monto?: number;
  condiciones?: string;
  fechaFirma: Date | null;
  observaciones?: string | null;
}

// Value Objects para información extendida
export interface ContratoConDetalles extends Contrato {
  propiedad?: {
    id: number;
    direccion: string;
    precioNegociable: number;
  };
  persona?: {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
}

// Métodos de dominio
export class ContractAggregate {
  static crearContrato(data: CrearContratoData): Contrato {
    // Validaciones de negocio
    if (!data.idPropiedad || data.idPropiedad <= 0) {
      throw new Error('El ID de propiedad es requerido');
    }
    if (!data.idPersona || data.idPersona <= 0) {
      throw new Error('El ID de persona es requerido');
    }
    if (data.monto !== undefined && data.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    return {
      id: 0, // Se asignará en persistencia
      fechaEmision: new Date(),
      idPropiedad: data.idPropiedad,
      idPersona: data.idPersona,
      estado: 'Pendiente',
      monto: data.monto,
      condiciones: data.condiciones,
      fechaFirma: null,
      observaciones: data.observaciones || null
    };
  }

  static firmarContrato(contrato: Contrato, fechaFirma?: Date): Contrato {
    if (contrato.estado !== 'Pendiente') {
      throw new Error('Solo se pueden firmar contratos en estado Pendiente');
    }

    return {
      ...contrato,
      estado: 'Firmado',
      fechaFirma: fechaFirma || new Date()
    };
  }

  static cancelarContrato(contrato: Contrato, motivo?: string): Contrato {
    if (contrato.estado === 'Completado') {
      throw new Error('No se puede cancelar un contrato completado');
    }

    return {
      ...contrato,
      estado: 'Cancelado',
      observaciones: motivo ? `Cancelado: ${motivo}` : 'Cancelado'
    };
  }

  static completarContrato(contrato: Contrato): Contrato {
    if (contrato.estado !== 'Firmado') {
      throw new Error('Solo se pueden completar contratos firmados');
    }

    return {
      ...contrato,
      estado: 'Completado'
    };
  }

  static puedeSerModificado(contrato: Contrato): boolean {
    return contrato.estado === 'Pendiente';
  }

  static estaVigente(contrato: Contrato): boolean {
    return contrato.estado === 'Firmado' || contrato.estado === 'Completado';
  }
}

// DTOs para operaciones del dominio
export interface CrearContratoData {
  idPropiedad: number;
  idPersona: number;
  monto?: number;
  condiciones?: string;
  observaciones?: string;
}

export interface ActualizarContratoData {
  monto?: number;
  condiciones?: string;
  observaciones?: string;
}
