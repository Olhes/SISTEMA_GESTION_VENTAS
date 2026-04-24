/**
 * Contenedor de Inyección de Dependencias - Módulo Leads
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { LeadController } from './infrastructure/api/LeadController';
import { LeadService } from './application/use_cases/LeadService';
import { LeadSqliteRepo } from './infrastructure/persistence/LeadSqliteRepo';

import type { ILeadUseCase } from './domain/ports/driving/ILeadUseCase';
import type { ILeadRepo } from './domain/ports/driven/ILeadRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo leads
 * Siguiendo el principio de inversión de dependencias
 */
export class LeadContainer {
  private static leadRepo: ILeadRepo | null = null;
  private static leadUseCase: ILeadUseCase | null = null;
  private static leadController: LeadController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): ILeadRepo {
    if (!this.leadRepo) {
      this.leadRepo = new LeadSqliteRepo();
    }
    return this.leadRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): ILeadUseCase {
    if (!this.leadUseCase) {
      this.leadUseCase = new LeadService(this.getRepository());
    }
    return this.leadUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): LeadController {
    if (!this.leadController) {
      this.leadController = new LeadController(this.getUseCase());
    }
    return this.leadController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.leadRepo = null;
    this.leadUseCase = null;
    this.leadController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: ILeadRepo,
    useCase?: ILeadUseCase,
    controller?: LeadController
  ): void {
    if (repo) this.leadRepo = repo;
    if (useCase) this.leadUseCase = useCase;
    if (controller) this.leadController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const leadRepository = LeadContainer.getRepository();
export const leadUseCase = LeadContainer.getUseCase();
export const leadController = LeadContainer.getController();
