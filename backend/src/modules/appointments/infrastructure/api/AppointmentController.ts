/**
 * Adaptador Primario: AppointmentController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { IAppointmentUseCase } from '../../domain/ports/driving/IAppointmentUseCase';
import type { 
  CrearCitaRequest, 
  ActualizarCitaRequest,
  ReprogramarCitaRequest,
  CancelarCitaRequest,
  ConfirmarAsistenciaRequest,
  VerificarDisponibilidadRequest
} from '../../domain/ports/driving/IAppointmentUseCase';

export class AppointmentController {
  constructor(private readonly appointmentUseCase: IAppointmentUseCase) {}

  // Endpoint para listar citas
  async listarCitas(event: any): Promise<any> {
    try {
      const citas = await this.appointmentUseCase.listarCitas();
      
      return {
        status: "success",
        message: "Citas listadas exitosamente",
        data: citas
      };
    } catch (error) {
      console.error('Error al listar citas:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener citas"
      });
    }
  }

  // Endpoint para crear cita
  async crearCita(event: any): Promise<any> {
    try {
      const body = await readBody<CrearCitaRequest>(event);
      
      // Validaciones básicas
      this.validarCrearCitaRequest(body);

      const cita = await this.appointmentUseCase.crearCita(body);
      
      return {
        status: "success",
        message: "Cita creada exitosamente",
        data: cita
      };
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al crear cita"
      });
    }
  }

  // Endpoint para actualizar cita
  async actualizarCita(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de cita inválido"
        });
      }

      const body = await readBody<Partial<ActualizarCitaRequest>>(event);
      
      const cita = await this.appointmentUseCase.actualizarCita(id, body);
      
      return {
        status: "success",
        message: "Cita actualizada exitosamente",
        data: cita
      };
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar cita"
      });
    }
  }

  // Endpoint para eliminar cita
  async eliminarCita(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de cita inválido"
        });
      }

      await this.appointmentUseCase.eliminarCita(id);
      
      return {
        status: "success",
        message: "Cita eliminada exitosamente"
      };
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al eliminar cita"
      });
    }
  }

  // Endpoint para obtener cita por ID
  async obtenerCitaPorId(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de cita inválido"
        });
      }

      const cita = await this.appointmentUseCase.obtenerCitaPorId(id);
      
      if (!cita) {
        throw createError({
          statusCode: 404,
          message: "Cita no encontrada"
        });
      }
      
      return {
        status: "success",
        message: "Cita obtenida exitosamente",
        data: cita
      };
    } catch (error) {
      console.error('Error al obtener cita:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al obtener cita"
      });
    }
  }

  // Endpoint para reprogramar cita
  async reprogramarCita(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de cita inválido"
        });
      }

      const body = await readBody<ReprogramarCitaRequest>(event);
      
      const cita = await this.appointmentUseCase.reprogramarCita(id, body);
      
      return {
        status: "success",
        message: "Cita reprogramada exitosamente",
        data: cita
      };
    } catch (error) {
      console.error('Error al reprogramar cita:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al reprogramar cita"
      });
    }
  }

  // Endpoint para cancelar cita
  async cancelarCita(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de cita inválido"
        });
      }

      const body = await readBody<CancelarCitaRequest>(event);
      
      const cita = await this.appointmentUseCase.cancelarCita(id, body);
      
      return {
        status: "success",
        message: "Cita cancelada exitosamente",
        data: cita
      };
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al cancelar cita"
      });
    }
  }

  // Endpoint para confirmar asistencia
  async confirmarAsistencia(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de cita inválido"
        });
      }

      const body = await readBody<ConfirmarAsistenciaRequest>(event);
      
      const cita = await this.appointmentUseCase.confirmarAsistencia(id, body.asistio);
      
      return {
        status: "success",
        message: "Asistencia confirmada exitosamente",
        data: cita
      };
    } catch (error) {
      console.error('Error al confirmar asistencia:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al confirmar asistencia"
      });
    }
  }

  // Endpoint para listar citas por persona
  async listarCitasPorPersona(event: any): Promise<any> {
    try {
      const idPersona = parseInt(getRouterParam(event, 'idPersona') || '0');
      if (idPersona === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de persona inválido"
        });
      }

      const citas = await this.appointmentUseCase.listarCitasPorPersona(idPersona);
      
      return {
        status: "success",
        message: "Citas listadas exitosamente",
        data: citas
      };
    } catch (error) {
      console.error('Error al listar citas por persona:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener citas por persona"
      });
    }
  }

  // Endpoint para listar citas por usuario
  async listarCitasPorUsuario(event: any): Promise<any> {
    try {
      const idUsuario = parseInt(getRouterParam(event, 'idUsuario') || '0');
      if (idUsuario === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const citas = await this.appointmentUseCase.listarCitasPorUsuario(idUsuario);
      
      return {
        status: "success",
        message: "Citas listadas exitosamente",
        data: citas
      };
    } catch (error) {
      console.error('Error al listar citas por usuario:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener citas por usuario"
      });
    }
  }

  // Endpoint para listar citas con detalles
  async listarCitasConDetalles(event: any): Promise<any> {
    try {
      const citas = await this.appointmentUseCase.listarCitasConDetalles();
      
      return {
        status: "success",
        message: "Citas con detalles listadas exitosamente",
        data: citas
      };
    } catch (error) {
      console.error('Error al listar citas con detalles:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener citas con detalles"
      });
    }
  }

  // Endpoint para verificar disponibilidad
  async verificarDisponibilidad(event: any): Promise<any> {
    try {
      const body = await readBody<VerificarDisponibilidadRequest>(event);
      
      if (!body.fecha) {
        throw createError({
          statusCode: 400,
          message: "La fecha es requerida"
        });
      }

      const fecha = new Date(body.fecha);
      const disponible = await this.appointmentUseCase.verificarDisponibilidad(fecha, body.idUsuario);
      
      return {
        status: "success",
        message: "Disponibilidad verificada exitosamente",
        data: {
          fecha: body.fecha,
          disponible,
          idUsuario: body.idUsuario
        }
      };
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al verificar disponibilidad"
      });
    }
  }

  // Endpoint para obtener horarios disponibles
  async obtenerHorariosDisponibles(event: any): Promise<any> {
    try {
      const fecha = getQuery(event, 'fecha') as string;
      const idUsuario = getQuery(event, 'idUsuario') as string;
      
      if (!fecha) {
        throw createError({
          statusCode: 400,
          message: "La fecha es requerida"
        });
      }

      const fechaDate = new Date(fecha);
      const idUsuarioNum = idUsuario ? parseInt(idUsuario) : undefined;
      
      const horarios = await this.appointmentUseCase.obtenerHorariosDisponibles(fechaDate, idUsuarioNum);
      
      return {
        status: "success",
        message: "Horarios disponibles obtenidos exitosamente",
        data: {
          fecha: fecha,
          horarios: horarios.map(h => h.toISOString())
        }
      };
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al obtener horarios disponibles"
      });
    }
  }

  // Métodos de validación
  private validarCrearCitaRequest(data: CrearCitaRequest): void {
    if (!data.fechaAgendada) {
      throw new Error('La fecha agendada es requerida');
    }
    if (!data.idPersona || data.idPersona <= 0) {
      throw new Error('El ID de persona es requerido');
    }
    if (!data.idUsuario || data.idUsuario <= 0) {
      throw new Error('El ID de usuario es requerido');
    }

    const fecha = new Date(data.fechaAgendada);
    if (isNaN(fecha.getTime())) {
      throw new Error('La fecha agendada no es válida');
    }
    if (fecha <= new Date()) {
      throw new Error('La fecha agendada debe ser futura');
    }
  }
}
