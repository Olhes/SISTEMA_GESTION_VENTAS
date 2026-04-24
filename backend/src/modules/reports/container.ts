/**
 * Contenedor de Inyección de Dependencias - Módulo Reports
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { ReportController } from './infrastructure/api/ReportController';
import { ReportService } from './application/use_cases/ReportService';
import { ReportSqliteRepo } from './infrastructure/persistence/ReportSqliteRepo';

import type { IReportUseCase } from './domain/ports/driving/IReportUseCase';
import type { IReportRepo } from './domain/ports/driven/IReportRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo reports
 * Siguiendo el principio de inversión de dependencias
 */
export class ReportContainer {
  private static reportRepo: IReportRepo | null = null;
  private static reportUseCase: IReportUseCase | null = null;
  private static reportController: ReportController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): IReportRepo {
    if (!this.reportRepo) {
      this.reportRepo = new ReportSqliteRepo();
    }
    return this.reportRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): IReportUseCase {
    if (!this.reportUseCase) {
      this.reportUseCase = new ReportService(this.getRepository());
    }
    return this.reportUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): ReportController {
    if (!this.reportController) {
      this.reportController = new ReportController(this.getUseCase());
    }
    return this.reportController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.reportRepo = null;
    this.reportUseCase = null;
    this.reportController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: IReportRepo,
    useCase?: IReportUseCase,
    controller?: ReportController
  ): void {
    if (repo) this.reportRepo = repo;
    if (useCase) this.reportUseCase = useCase;
    if (controller) this.reportController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const reportRepository = ReportContainer.getRepository();
export const reportUseCase = ReportContainer.getUseCase();
export const reportController = ReportContainer.getController();
