/**
 * Mapper: AppointmentMapper
 * Traductor entre entidades de dominio y entidades de persistencia
 * Aísla el mapeo de datos del resto del sistema
 */

import type { Cita, CitaConDetalles, EstadoVisitaGuiada } from '../../domain/entities/Appointment';
import type { 
  CitaEntity, 
  CitaWithDetailsEntity,
  CitaPersonaEntity,
  CitaUsuarioEntity,
  CitaPropiedadEntity
} from '../persistence/AppointmentEntity';

export class AppointmentMapper {
  // Mapeo de entidad de persistencia a entidad de dominio
  static toCita(entity: CitaEntity): Cita {
    return {
      id: entity.id_cita,
      fechaAgendada: new Date(entity.fecha_agendada),
      observacion: entity.observacion,
      estadoVisitaGuiada: entity.estado_visita_guiada as EstadoVisitaGuiada,
      idPersona: entity.id_persona,
      idUsuario: entity.id_usuario,
      fechaCreacion: new Date(entity.fecha_creacion),
      fechaModificacion: entity.fecha_modificacion ? new Date(entity.fecha_modificacion) : null
    };
  }

  // Mapeo de entidad de dominio a entidad de persistencia
  static toCitaPersistence(cita: Cita): CitaEntity {
    return {
      id_cita: cita.id,
      fecha_agendada: cita.fechaAgendada.toISOString(),
      observacion: cita.observacion || null,
      estado_visita_guiada: cita.estadoVisitaGuiada,
      id_persona: cita.idPersona,
      id_usuario: cita.idUsuario,
      fecha_creacion: cita.fechaCreacion.toISOString(),
      fecha_modificacion: cita.fechaModificacion?.toISOString()
    };
  }

  // Mapeo para citas con detalles
  static toCitaConDetalles(row: CitaWithDetailsEntity): CitaConDetalles {
    const cita = this.toCita(row);
    return {
      ...cita,
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidoPaterno: row.persona_apellido_paterno,
        apellidoMaterno: row.persona_apellido_materno,
        telefono: row.persona_telefono,
        correo: row.persona_correo
      },
      usuario: {
        id: row.id_usuario,
        nombreUsuario: row.usuario_nombre_usuario,
        rol: row.usuario_rol
      },
      propiedad: row.propiedad_id ? {
        id: row.propiedad_id,
        direccion: row.propiedad_direccion || '',
        precioNegociable: row.propiedad_precio_negociable || 0
      } : undefined
    };
  }

  // Mapeo para relaciones específicas
  static toCitaPersona(entity: CitaPersonaEntity): CitaConDetalles['persona'] {
    return {
      id: entity.id_persona,
      nombres: entity.nombres,
      apellidoPaterno: entity.apellido_paterno,
      apellidoMaterno: entity.apellido_materno,
      telefono: entity.telefono,
      correo: entity.correo
    };
  }

  static toCitaUsuario(entity: CitaUsuarioEntity): CitaConDetalles['usuario'] {
    return {
      id: entity.id_usuario,
      nombreUsuario: entity.nombre_usuario,
      rol: entity.rol
    };
  }

  static toCitaPropiedad(entity: CitaPropiedadEntity): CitaConDetalles['propiedad'] {
    return {
      id: entity.id_propiedad,
      direccion: entity.direccion,
      precioNegociable: entity.precio_negociable
    };
  }

  // Validación de mapeo
  static isValidEstado(estado: string): estado is EstadoVisitaGuiada {
    const estadosValidos: EstadoVisitaGuiada[] = ["Reprogramó", "Canceló", "No realizó visita", "Realizó visita"];
    return estadosValidos.includes(estado as EstadoVisitaGuiada);
  }

  static isValidCita(cita: Partial<Cita>): boolean {
    if (!cita.idPersona || cita.idPersona <= 0) {
      return false;
    }
    if (!cita.idUsuario || cita.idUsuario <= 0) {
      return false;
    }
    if (!cita.fechaAgendada) {
      return false;
    }
    return true;
  }

  static isValidFecha(fecha: Date): boolean {
    return !isNaN(fecha.getTime()) && fecha > new Date();
  }

  static formatEstado(estado: string): EstadoVisitaGuiada {
    const estadoFormateado = estado.replace(/\s+/g, ' ').trim();
    if (!this.isValidEstado(estadoFormateado)) {
      throw new Error(`Estado de visita inválido: ${estado}`);
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

  static generarResumenCita(cita: CitaConDetalles): string {
    const persona = cita.persona;
    const fecha = cita.fechaAgendada.toLocaleDateString('es-ES');
    const hora = cita.fechaAgendada.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    return `Cita con ${persona?.nombres} ${persona?.apellidoPaterno} el ${fecha} a las ${hora}`;
  }

  static calcularDuracionCita(): number {
    // Duración estándar en minutos
    return 60;
  }

  static obtenerColorEstado(estado: EstadoVisitaGuiada): string {
    const colores = {
      'Realizó visita': 'blue',
      'Reprogramó': 'yellow',
      'Canceló': 'red',
      'No realizó visita': 'gray'
    };
    return colores[estado] || 'gray';
  }

  static estaProxima(cita: Cita, horasAnticipacion: number = 24): boolean {
    const ahora = new Date();
    const limite = new Date(cita.fechaAgendada.getTime() - (horasAnticipacion * 60 * 60 * 1000));
    return ahora >= limite && ahora < cita.fechaAgendada;
  }

  static estaVencida(cita: Cita): boolean {
    return cita.fechaAgendada < new Date();
  }

  static obtenerSiguienteCita(citas: Cita[]): Cita | null {
    const ahora = new Date();
    const citasFuturas = citas
      .filter(cita => cita.fechaAgendada > ahora)
      .filter(cita => cita.estadoVisitaGuiada === 'Realizó visita')
      .sort((a, b) => a.fechaAgendada.getTime() - b.fechaAgendada.getTime());
    
    return citasFuturas.length > 0 ? citasFuturas[0] : null;
  }

  static generarRecordatorio(cita: Cita): string {
    const tiempo = cita.fechaAgendada.getTime() - Date.now();
    const horas = Math.floor(tiempo / (1000 * 60 * 60));
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) {
      return `Cita en ${dias} día${dias > 1 ? 's' : ''}`;
    } else if (horas > 0) {
      return `Cita en ${horas} hora${horas > 1 ? 's' : ''}`;
    } else {
      return 'Cita programada para hoy';
    }
  }
}
