/**
 * Puerto Primario: Interfaz del Caso de Uso de Citas
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Cita, CitaConDetalles, EstadoVisitaGuiada } from '../../entities/Appointment';

export interface IAppointmentUseCase {
  // Operaciones CRUD
  listarCitas(): Promise<Cita[]>;
  crearCita(citaData: CrearCitaRequest): Promise<Cita>;
  actualizarCita(id: number, citaData: Partial<ActualizarCitaRequest>): Promise<Cita>;
  eliminarCita(id: number): Promise<void>;
  obtenerCitaPorId(id: number): Promise<Cita | null>;
  
  // Operaciones de negocio
  reprogramarCita(id: number, data: ReprogramarCitaRequest): Promise<Cita>;
  cancelarCita(id: number, data: CancelarCitaRequest): Promise<Cita>;
  confirmarAsistencia(id: number, asistio: boolean): Promise<Cita>;
  
  // Consultas especializadas
  listarCitasPorPersona(idPersona: number): Promise<CitaConDetalles[]>;
  listarCitasPorUsuario(idUsuario: number): Promise<CitaConDetalles[]>;
  listarCitasPorEstado(estado: EstadoVisitaGuiada): Promise<Cita[]>;
  listarCitasConDetalles(): Promise<CitaConDetalles[]>;
  listarCitasProximas(horasAnticipacion?: number): Promise<CitaConDetalles[]>;
  listarCitasVencidas(): Promise<CitaConDetalles[]>;
  
  // Operaciones de disponibilidad
  verificarDisponibilidad(fecha: Date, idUsuario?: number): Promise<boolean>;
  obtenerHorariosDisponibles(fecha: Date, idUsuario?: number): Promise<Date[]>;
}

// DTOs para requests del caso de uso
export interface CrearCitaRequest {
  fechaAgendada: string;
  observacion?: string;
  idPersona: number;
  idUsuario: number;
}

export interface ActualizarCitaRequest {
  fechaAgendada?: string;
  observacion?: string;
  estadoVisitaGuiada?: EstadoVisitaGuiada;
}

export interface ReprogramarCitaRequest {
  nuevaFecha: string;
  motivo?: string;
}

export interface CancelarCitaRequest {
  motivo?: string;
}

export interface ConfirmarAsistenciaRequest {
  asistio: boolean;
}

export interface VerificarDisponibilidadRequest {
  fecha: string;
  idUsuario?: number;
}
