/**
 * Punto de entrada del módulo Appointments
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Cita, 
  CitaConDetalles,
  EstadoVisitaGuiada,
  CrearCitaData,
  ActualizarCitaData,
  ReprogramarCitaData,
  CancelarCitaData
} from './domain/entities/Appointment';

export { AppointmentAggregate } from './domain/entities/Appointment';

// Puertos (interfaces)
export type { 
  IAppointmentUseCase, 
  CrearCitaRequest, 
  ActualizarCitaRequest,
  ReprogramarCitaRequest,
  CancelarCitaRequest,
  ConfirmarAsistenciaRequest,
  VerificarDisponibilidadRequest
} from './domain/ports/driving/IAppointmentUseCase';
export type { IAppointmentRepo, CreateCitaData } from './domain/ports/driven/IAppointmentRepo';

// Implementaciones
export { AppointmentService } from './application/use_cases/AppointmentService';
export { AppointmentController } from './infrastructure/api/AppointmentController';
export { AppointmentSqliteRepo } from './infrastructure/persistence/AppointmentSqliteRepo';
export { AppointmentMapper } from './infrastructure/mappers/AppointmentMapper';

// Entidades de persistencia
export type { 
  CitaEntity, 
  CitaWithDetailsEntity,
  CitaPersonaEntity,
  CitaUsuarioEntity,
  CitaPropiedadEntity
} from './infrastructure/persistence/AppointmentEntity';

// Contenedor de dependencias
export { 
  AppointmentContainer, 
  appointmentRepository, 
  appointmentUseCase, 
  appointmentController 
} from './container';
