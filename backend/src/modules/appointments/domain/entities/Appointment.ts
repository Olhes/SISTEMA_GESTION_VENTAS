/**
 * Aggregate Root: Appointment
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export type EstadoVisitaGuiada = "Reprogramó" | "Canceló" | "No realizó visita" | "Realizó visita";

export interface Cita {
  id: number;
  fechaAgendada: Date;
  observacion?: string | null;
  estadoVisitaGuiada: EstadoVisitaGuiada;
  idPersona: number;
  idUsuario: number;
  fechaCreacion: Date;
  fechaModificacion?: Date | null;
}

// Value Objects para información extendida
export interface CitaConDetalles extends Cita {
  persona?: {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    correo?: string;
  };
  usuario?: {
    id: number;
    nombreUsuario: string;
    rol?: string;
  };
  propiedad?: {
    id: number;
    direccion: string;
    precioNegociable: number;
  };
}

// Métodos de dominio
export class AppointmentAggregate {
  static crearCita(data: CrearCitaData): Cita {
    // Validaciones de negocio
    if (!data.idPersona || data.idPersona <= 0) {
      throw new Error('El ID de persona es requerido');
    }
    if (!data.idUsuario || data.idUsuario <= 0) {
      throw new Error('El ID de usuario es requerido');
    }
    if (!data.fechaAgendada) {
      throw new Error('La fecha agendada es requerida');
    }
    if (data.fechaAgendada <= new Date()) {
      throw new Error('La fecha agendada debe ser futura');
    }

    return {
      id: 0, // Se asignará en persistencia
      fechaAgendada: data.fechaAgendada,
      observacion: data.observacion || null,
      estadoVisitaGuiada: 'Realizó visita', // Estado inicial
      idPersona: data.idPersona,
      idUsuario: data.idUsuario,
      fechaCreacion: new Date(),
      fechaModificacion: null
    };
  }

  static reprogramarCita(cita: Cita, nuevaFecha: Date, motivo?: string): Cita {
    if (nuevaFecha <= new Date()) {
      throw new Error('La nueva fecha debe ser futura');
    }

    if (cita.estadoVisitaGuiada !== 'Realizó visita') {
      throw new Error('Solo se pueden reprogramar citas pendientes');
    }

    return {
      ...cita,
      fechaAgendada: nuevaFecha,
      estadoVisitaGuiada: 'Reprogramó',
      observacion: motivo ? `Reprogramado: ${motivo}` : 'Reprogramado',
      fechaModificacion: new Date()
    };
  }

  static cancelarCita(cita: Cita, motivo?: string): Cita {
    if (cita.estadoVisitaGuiada === 'No realizó visita' || cita.estadoVisitaGuiada === 'Realizó visita') {
      throw new Error('No se puede cancelar una cita ya realizada');
    }

    return {
      ...cita,
      estadoVisitaGuiada: 'Canceló',
      observacion: motivo ? `Cancelado: ${motivo}` : 'Cancelado',
      fechaModificacion: new Date()
    };
  }

  static confirmarAsistencia(cita: Cita, asistio: boolean): Cita {
    if (cita.estadoVisitaGuiada !== 'Realizó visita') {
      throw new Error('Solo se puede confirmar asistencia de citas pendientes');
    }

    return {
      ...cita,
      estadoVisitaGuiada: asistio ? 'Realizó visita' : 'No realizó visita',
      fechaModificacion: new Date()
    };
  }

  static puedeSerModificada(cita: Cita): boolean {
    return cita.estadoVisitaGuiada === 'Realizó visita';
  }

  static estaVencida(cita: Cita): boolean {
    return cita.fechaAgendada < new Date();
  }

  static estaProxima(cita: Cita, horasAnticipacion: number = 24): boolean {
    const ahora = new Date();
    const limite = new Date(cita.fechaAgendada.getTime() - (horasAnticipacion * 60 * 60 * 1000));
    return ahora >= limite && ahora < cita.fechaAgendada;
  }

  static obtenerDuracionEstimada(): number {
    // Duración estándar de una visita en minutos
    return 60;
  }

  static validarDisponibilidad(fecha: Date, citasExistentes: Cita[]): boolean {
    // Validar que no haya citas solapadas (considerando 1 hora por cita)
    const inicio = new Date(fecha);
    const fin = new Date(inicio.getTime() + (this.obtenerDuracionEstimada() * 60 * 1000));

    return !citasExistentes.some(cita => {
      if (cita.estadoVisitaGuiada === 'Canceló') return false;
      
      const citaInicio = new Date(cita.fechaAgendada);
      const citaFin = new Date(citaInicio.getTime() + (this.obtenerDuracionEstimada() * 60 * 1000));
      
      return (inicio < citaFin && fin > citaInicio);
    });
  }
}

// DTOs para operaciones del dominio
export interface CrearCitaData {
  fechaAgendada: Date;
  observacion?: string;
  idPersona: number;
  idUsuario: number;
}

export interface ActualizarCitaData {
  fechaAgendada?: Date;
  observacion?: string;
  estadoVisitaGuiada?: EstadoVisitaGuiada;
}

export interface ReprogramarCitaData {
  nuevaFecha: Date;
  motivo?: string;
}

export interface CancelarCitaData {
  motivo?: string;
}
