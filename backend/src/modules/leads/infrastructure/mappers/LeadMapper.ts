/**
 * Mapper: LeadMapper
 * Traductor entre entidades de dominio y entidades de persistencia
 * Aísla el mapeo de datos del resto del sistema
 */

import type { 
  Lead, 
  LeadVendedor, 
  LeadComprador, 
  TipoPersona 
} from '../../domain/entities/Lead';
import type { 
  LeadEntity, 
  UsuarioVendedorEntity, 
  UsuarioCompradorEntity,
  LeadVendedorEntity,
  LeadCompradorEntity
} from '../persistence/LeadEntity';

export class LeadMapper {
  // Mapeo de entidad de persistencia a entidad de dominio
  static toDomain(entity: LeadEntity): Lead {
    return {
      id: entity.id_persona,
      nombres: entity.nombres,
      apellidoPaterno: entity.apellido_paterno,
      apellidoMaterno: entity.apellido_materno,
      tipoDocumento: entity.tipo_documento,
      numeroDocumento: entity.numero_documento,
      telefono: entity.telefono,
      correo: entity.correo,
      tipoPersona: entity.tipo_persona as TipoPersona,
      fechaCreacion: new Date(entity.fecha_creacion),
      idUsuario: 0, // Se obtiene de las relaciones
      observacion: null
    };
  }

  // Mapeo de entidad de dominio a entidad de persistencia
  static toPersistence(lead: Lead): LeadEntity {
    return {
      id_persona: lead.id,
      nombres: lead.nombres,
      apellido_paterno: lead.apellidoPaterno,
      apellido_materno: lead.apellidoMaterno,
      tipo_documento: lead.tipoDocumento,
      numero_documento: lead.numeroDocumento,
      telefono: lead.telefono,
      correo: lead.correo,
      tipo_persona: lead.tipoPersona,
      fecha_creacion: lead.fechaCreacion.toISOString()
    };
  }

  // Mapeo para leads de vendedores
  static toLeadVendedorDomain(row: LeadVendedorEntity): LeadVendedor {
    return {
      id: row.id_persona,
      nombres: row.nombres,
      apellidoPaterno: row.apellido_paterno,
      apellidoMaterno: row.apellido_materno,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      telefono: row.telefono,
      correo: row.correo,
      tipoPersona: row.tipo_persona as TipoPersona,
      fechaCreacion: new Date(row.fecha_creacion),
      estadoVendedor: row.estado_vendedor as any,
      observacion: row.observacion_vendedor,
      idUsuario: row.id_usuario
    };
  }

  // Mapeo para leads de compradores
  static toLeadCompradorDomain(row: LeadCompradorEntity): LeadComprador {
    return {
      id: row.id_persona,
      nombres: row.nombres,
      apellidoPaterno: row.apellido_paterno,
      apellidoMaterno: row.apellido_materno,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      telefono: row.telefono,
      correo: row.correo,
      tipoPersona: row.tipo_persona as TipoPersona,
      fechaCreacion: new Date(row.fecha_creacion),
      estadoComprador: row.estado_comprador as any,
      observacion: row.observacion_comprador,
      idUsuario: row.id_usuario
    };
  }

  // Mapeo para creación de relaciones
  static toUsuarioVendedorPersistence(lead: LeadVendedor): UsuarioVendedorEntity {
    return {
      id_usuario: lead.idUsuario,
      id_persona: lead.id,
      estado_vendedor: lead.estadoVendedor,
      observacion: lead.observacion
    };
  }

  static toUsuarioCompradorPersistence(lead: LeadComprador): UsuarioCompradorEntity {
    return {
      id_usuario: lead.idUsuario,
      id_persona: lead.id,
      estado_comprador: lead.estadoComprador,
      observacion: lead.observacion
    };
  }

  // Validación de mapeo
  static isValidPersona(tipoPersona: string): boolean {
    const tiposValidos: TipoPersona[] = ["Cliente", "Referido", "Lead Alvas", "Lead Propio"];
    return tiposValidos.includes(tipoPersona as TipoPersona);
  }

  static isValidEstadoVendedor(estado: string): boolean {
    const estadosValidos = ["Seguimiento", "Cierre", "No responde"];
    return estadosValidos.includes(estado);
  }

  static isValidEstadoComprador(estado: string): boolean {
    const estadosValidos = [
      "Aún no se ha contactado",
      "Esperando respuesta", 
      "Agendó visita guiada",
      "Venta concretada",
      "No está interesado"
    ];
    return estadosValidos.includes(estado);
  }
}
