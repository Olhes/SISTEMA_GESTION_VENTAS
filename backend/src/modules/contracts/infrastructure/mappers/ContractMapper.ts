/**
 * Mapper: ContractMapper
 * Traductor entre entidades de dominio y entidades de persistencia
 * Aísla el mapeo de datos del resto del sistema
 */

import type { Contrato, ContratoConDetalles, EstadoContrato } from '../../domain/entities/Contract';
import type { 
  ContractEntity, 
  ContractWithDetailsEntity,
  ContractPropertyEntity,
  ContractPersonEntity
} from '../persistence/ContractEntity';

export class ContractMapper {
  // Mapeo de entidad de persistencia a entidad de dominio
  static toDomain(entity: ContractEntity): Contrato {
    return {
      id: entity.id_contrato,
      fechaEmision: new Date(entity.fecha_emision),
      idPropiedad: entity.id_propiedad,
      idPersona: entity.id_persona,
      estado: entity.estado as EstadoContrato,
      monto: entity.monto || undefined,
      condiciones: entity.condiciones || undefined,
      fechaFirma: entity.fecha_firma ? new Date(entity.fecha_firma) : null,
      observaciones: entity.observaciones
    };
  }

  // Mapeo de entidad de dominio a entidad de persistencia
  static toPersistence(contrato: Contrato): ContractEntity {
    return {
      id_contrato: contrato.id,
      fecha_emision: contrato.fechaEmision.toISOString(),
      id_propiedad: contrato.idPropiedad,
      id_persona: contrato.idPersona,
      estado: contrato.estado,
      monto: contrato.monto || null,
      condiciones: contrato.condiciones || null,
      fecha_firma: contrato.fechaFirma?.toISOString() || null,
      observaciones: contrato.observaciones || null
    };
  }

  // Mapeo para contratos con detalles
  static toDomainWithDetails(row: ContractWithDetailsEntity): ContratoConDetalles {
    const contrato = this.toDomain(row);
    return {
      ...contrato,
      propiedad: {
        id: row.id_propiedad,
        direccion: row.propiedad_direccion,
        precioNegociable: row.propiedad_precio_negociable
      },
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidoPaterno: row.persona_apellido_paterno,
        apellidoMaterno: row.persona_apellido_materno,
        tipoDocumento: row.persona_tipo_documento,
        numeroDocumento: row.persona_numero_documento
      }
    };
  }

  // Mapeo para relaciones específicas
  static toContractProperty(entity: ContractPropertyEntity): Contrato['propiedad'] {
    return {
      id: entity.id_propiedad,
      direccion: entity.direccion,
      precioNegociable: entity.precio_negociable
    };
  }

  static toContractPerson(entity: ContractPersonEntity): Contrato['persona'] {
    return {
      id: entity.id_persona,
      nombres: entity.nombres,
      apellidoPaterno: entity.apellido_paterno,
      apellidoMaterno: entity.apellido_materno,
      tipoDocumento: entity.tipo_documento,
      numeroDocumento: entity.numero_documento
    };
  }

  // Validación de mapeo
  static isValidEstado(estado: string): estado is EstadoContrato {
    const estadosValidos: EstadoContrato[] = ["Pendiente", "Firmado", "Cancelado", "Completado"];
    return estadosValidos.includes(estado as EstadoContrato);
  }

  static isValidContrato(contrato: Partial<Contrato>): boolean {
    if (!contrato.idPropiedad || contrato.idPropiedad <= 0) {
      return false;
    }
    if (!contrato.idPersona || contrato.idPersona <= 0) {
      return false;
    }
    if (contrato.monto !== undefined && contrato.monto <= 0) {
      return false;
    }
    return true;
  }

  static isValidMonto(monto: number): boolean {
    return monto > 0 && monto <= 10000000; // Límite razonable
  }

  static formatEstado(estado: string): EstadoContrato {
    const estadoFormateado = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    if (!this.isValidEstado(estadoFormateado)) {
      throw new Error(`Estado de contrato inválido: ${estado}`);
    }
    return estadoFormateado;
  }

  static formatFecha(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (isNaN(fechaObj.getTime())) {
      throw new Error('Fecha inválida');
    }
    return fechaObj.toISOString();
  }
}
