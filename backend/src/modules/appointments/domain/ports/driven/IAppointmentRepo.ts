/**
 * Puerto Secundario: Interfaz del Repositorio de Citas
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Cita, CitaConDetalles, EstadoVisitaGuiada } from '../../entities/Appointment';

export interface IAppointmentRepo {
  // Operaciones CRUD básicas
  findById(id: number): Promise<Cita | null>;
  findAll(): Promise<Cita[]>;
  save(cita: Cita): Promise<Cita>;
  update(id: number, cita: Partial<Cita>): Promise<Cita>;
  delete(id: number): Promise<void>;
  
  // Operaciones con detalles
  findByIdWithDetails(id: number): Promise<CitaConDetalles | null>;
  findAllWithDetails(): Promise<CitaConDetalles[]>;
  
  // Operaciones de consulta especializadas
  findByPersona(idPersona: number): Promise<CitaConDetalles[]>;
  findByUsuario(idUsuario: number): Promise<CitaConDetalles[]>;
  findByEstado(estado: EstadoVisitaGuiada): Promise<Cita[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Cita[]>;
  findProximas(horasAnticipacion: number): Promise<CitaConDetalles[]>;
  findVencidas(): Promise<CitaConDetalles[]>;
  
  // Validaciones de negocio
  personaValida(idPersona: number): Promise<boolean>;
  usuarioValido(idUsuario: number): Promise<boolean>;
  verificarDisponibilidad(fecha: Date, idUsuario: number): Promise<boolean>;
  obtenerCitasDelDia(fecha: Date, idUsuario: number): Promise<Cita[]>;
}

// DTOs para operaciones del repositorio
export interface CreateCitaData {
  fecha_agendada: string;
  observacion: string | null;
  estado_visita_guiada: string;
  id_persona: number;
  id_usuario: number;
  fecha_creacion: string;
  fecha_modificacion: string | null;
}
