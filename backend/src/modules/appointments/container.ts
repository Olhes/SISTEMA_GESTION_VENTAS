/**
 * Contenedor de Inyección de Dependencias - Módulo Appointments
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { AppointmentController } from './infrastructure/api/AppointmentController';
import { AppointmentService } from './application/use_cases/AppointmentService';
import { AppointmentSqliteRepo } from './infrastructure/persistence/AppointmentSqliteRepo';

import type { IAppointmentUseCase } from './domain/ports/driving/IAppointmentUseCase';
import type { IAppointmentRepo } from './domain/ports/driven/IAppointmentRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo appointments
 * Siguiendo el principio de inversión de dependencias
 */
export class AppointmentContainer {
  private static appointmentRepo: IAppointmentRepo | null = null;
  private static appointmentUseCase: IAppointmentUseCase | null = null;
  private static appointmentController: AppointmentController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): IAppointmentRepo {
    if (!this.appointmentRepo) {
      this.appointmentRepo = new AppointmentSqliteRepo();
    }
    return this.appointmentRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): IAppointmentUseCase {
    if (!this.appointmentUseCase) {
      this.appointmentUseCase = new AppointmentService(this.getRepository());
    }
    return this.appointmentUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): AppointmentController {
    if (!this.appointmentController) {
      this.appointmentController = new AppointmentController(this.getUseCase());
    }
    return this.appointmentController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.appointmentRepo = null;
    this.appointmentUseCase = null;
    this.appointmentController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: IAppointmentRepo,
    useCase?: IAppointmentUseCase,
    controller?: AppointmentController
  ): void {
    if (repo) this.appointmentRepo = repo;
    if (useCase) this.appointmentUseCase = useCase;
    if (controller) this.appointmentController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const appointmentRepository = AppointmentContainer.getRepository();
export const appointmentUseCase = AppointmentContainer.getUseCase();
export const appointmentController = AppointmentContainer.getController();
