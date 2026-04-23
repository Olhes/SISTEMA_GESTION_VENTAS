/**
 * Implementación del Caso de Uso de Citas
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  IAppointmentUseCase, 
  CrearCitaRequest, 
  ActualizarCitaRequest,
  ReprogramarCitaRequest,
  CancelarCitaRequest,
  ConfirmarAsistenciaRequest,
  VerificarDisponibilidadRequest
} from '../../domain/ports/driving/IAppointmentUseCase';
import type { IAppointmentRepo, CreateCitaData } from '../../domain/ports/driven/IAppointmentRepo';
import type { 
  Cita,
  CitaConDetalles,
  EstadoVisitaGuiada,
  CrearCitaData as DominioCrearCitaData,
  ActualizarCitaData as DominioActualizarCitaData,
  ReprogramarCitaData as DominioReprogramarCitaData,
  CancelarCitaData as DominioCancelarCitaData
} from '../../domain/entities/Appointment';
import { AppointmentAggregate } from '../../domain/entities/Appointment';

export class AppointmentService implements IAppointmentUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepo) {}

  async listarCitas(): Promise<Cita[]> {
    return await this.appointmentRepo.findAll();
  }

  async crearCita(citaData: CrearCitaRequest): Promise<Cita> {
    // Validaciones de negocio
    const personaValida = await this.appointmentRepo.personaValida(citaData.idPersona);
    if (!personaValida) {
      throw new Error('La persona especificada no es válida');
    }

    const usuarioValido = await this.appointmentRepo.usuarioValido(citaData.idUsuario);
    if (!usuarioValido) {
      throw new Error('El usuario especificado no es válido');
    }

    const fechaAgendada = new Date(citaData.fechaAgendada);
    const disponible = await this.appointmentRepo.verificarDisponibilidad(fechaAgendada, citaData.idUsuario);
    if (!disponible) {
      throw new Error('La fecha seleccionada no está disponible');
    }

    // Transformar datos para el dominio
    const dominioData: DominioCrearCitaData = {
      fechaAgendada,
      observacion: citaData.observacion,
      idPersona: citaData.idPersona,
      idUsuario: citaData.idUsuario
    };

    // Usar el Aggregate Root para crear la cita
    const cita = AppointmentAggregate.crearCita(dominioData);

    // Guardar a través del repositorio
    return await this.appointmentRepo.save(cita);
  }

  async actualizarCita(id: number, citaData: Partial<ActualizarCitaRequest>): Promise<Cita> {
    const existingCita = await this.appointmentRepo.findById(id);
    if (!existingCita) {
      throw new Error('Cita no encontrada');
    }

    // Validar que la cita pueda ser modificada
    if (!AppointmentAggregate.puedeSerModificada(existingCita)) {
      throw new Error('La cita no puede ser modificada en su estado actual');
    }

    // Si se cambia la fecha, validar disponibilidad
    if (citaData.fechaAgendada) {
      const nuevaFecha = new Date(citaData.fechaAgendada);
      const disponible = await this.appointmentRepo.verificarDisponibilidad(nuevaFecha, existingCita.idUsuario);
      if (!disponible) {
        throw new Error('La nueva fecha no está disponible');
      }
    }

    const dominioData: Partial<DominioActualizarCitaData> = {
      fechaAgendada: citaData.fechaAgendada ? new Date(citaData.fechaAgendada) : undefined,
      observacion: citaData.observacion,
      estadoVisitaGuiada: citaData.estadoVisitaGuiada
    };

    return await this.appointmentRepo.update(id, dominioData);
  }

  async eliminarCita(id: number): Promise<void> {
    const existingCita = await this.appointmentRepo.findById(id);
    if (!existingCita) {
      throw new Error('Cita no encontrada');
    }

    if (!AppointmentAggregate.puedeSerModificada(existingCita)) {
      throw new Error('No se puede eliminar una cita ya realizada');
    }

    await this.appointmentRepo.delete(id);
  }

  async obtenerCitaPorId(id: number): Promise<Cita | null> {
    return await this.appointmentRepo.findById(id);
  }

  async reprogramarCita(id: number, data: ReprogramarCitaRequest): Promise<Cita> {
    const cita = await this.appointmentRepo.findById(id);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    const nuevaFecha = new Date(data.nuevaFecha);
    const disponible = await this.appointmentRepo.verificarDisponibilidad(nuevaFecha, cita.idUsuario);
    if (!disponible) {
      throw new Error('La nueva fecha no está disponible');
    }

    const dominioData: DominioReprogramarCitaData = {
      nuevaFecha,
      motivo: data.motivo
    };

    const citaReprogramada = AppointmentAggregate.reprogramarCita(cita, dominioData.nuevaFecha, dominioData.motivo);
    return await this.appointmentRepo.update(id, { 
      fechaAgendada: citaReprogramada.fechaAgendada,
      estadoVisitaGuiada: citaReprogramada.estadoVisitaGuiada,
      observacion: citaReprogramada.observacion,
      fechaModificacion: citaReprogramada.fechaModificacion
    });
  }

  async cancelarCita(id: number, data: CancelarCitaRequest): Promise<Cita> {
    const cita = await this.appointmentRepo.findById(id);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    const dominioData: DominioCancelarCitaData = {
      motivo: data.motivo
    };

    const citaCancelada = AppointmentAggregate.cancelarCita(cita, dominioData.motivo);
    return await this.appointmentRepo.update(id, { 
      estadoVisitaGuiada: citaCancelada.estadoVisitaGuiada,
      observacion: citaCancelada.observacion,
      fechaModificacion: citaCancelada.fechaModificacion
    });
  }

  async confirmarAsistencia(id: number, asistio: boolean): Promise<Cita> {
    const cita = await this.appointmentRepo.findById(id);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    const citaActualizada = AppointmentAggregate.confirmarAsistencia(cita, asistio);
    return await this.appointmentRepo.update(id, { 
      estadoVisitaGuiada: citaActualizada.estadoVisitaGuiada,
      fechaModificacion: citaActualizada.fechaModificacion
    });
  }

  async listarCitasPorPersona(idPersona: number): Promise<CitaConDetalles[]> {
    const personaValida = await this.appointmentRepo.personaValida(idPersona);
    if (!personaValida) {
      throw new Error('La persona especificada no es válida');
    }

    return await this.appointmentRepo.findByPersona(idPersona);
  }

  async listarCitasPorUsuario(idUsuario: number): Promise<CitaConDetalles[]> {
    const usuarioValido = await this.appointmentRepo.usuarioValido(idUsuario);
    if (!usuarioValido) {
      throw new Error('El usuario especificado no es válido');
    }

    return await this.appointmentRepo.findByUsuario(idUsuario);
  }

  async listarCitasPorEstado(estado: EstadoVisitaGuiada): Promise<Cita[]> {
    return await this.appointmentRepo.findByEstado(estado);
  }

  async listarCitasConDetalles(): Promise<CitaConDetalles[]> {
    return await this.appointmentRepo.findAllWithDetails();
  }

  async listarCitasProximas(horasAnticipacion: number = 24): Promise<CitaConDetalles[]> {
    return await this.appointmentRepo.findProximas(horasAnticipacion);
  }

  async listarCitasVencidas(): Promise<CitaConDetalles[]> {
    return await this.appointmentRepo.findVencidas();
  }

  async verificarDisponibilidad(fecha: Date, idUsuario?: number): Promise<boolean> {
    if (!idUsuario) {
      throw new Error('El ID de usuario es requerido para verificar disponibilidad');
    }

    return await this.appointmentRepo.verificarDisponibilidad(fecha, idUsuario);
  }

  async obtenerHorariosDisponibles(fecha: Date, idUsuario?: number): Promise<Date[]> {
    if (!idUsuario) {
      throw new Error('El ID de usuario es requerido para obtener horarios disponibles');
    }

    const citasDelDia = await this.appointmentRepo.obtenerCitasDelDia(fecha, idUsuario);
    const duracionCita = AppointmentAggregate.obtenerDuracionEstimada();
    
    // Generar horarios disponibles (ejemplo: de 9:00 a 18:00)
    const horariosDisponibles: Date[] = [];
    const inicioDia = new Date(fecha);
    inicioDia.setHours(9, 0, 0, 0);
    
    const finDia = new Date(fecha);
    finDia.setHours(18, 0, 0, 0);

    let horaActual = new Date(inicioDia);
    
    while (horaActual < finDia) {
      const horaFin = new Date(horaActual.getTime() + (duracionCita * 60 * 1000));
      
      // Verificar si este horario está disponible
      if (AppointmentAggregate.validarDisponibilidad(horaActual, citasDelDia)) {
        horariosDisponibles.push(new Date(horaActual));
      }
      
      horaActual = new Date(horaActual.getTime() + (duracionCita * 60 * 1000));
    }

    return horariosDisponibles;
  }
}
