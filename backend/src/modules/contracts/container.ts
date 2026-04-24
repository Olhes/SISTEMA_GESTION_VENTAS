/**
 * Contenedor de Inyección de Dependencias - Módulo Contracts
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { ContractController } from './infrastructure/api/ContractController';
import { ContractService } from './application/use_cases/ContractService';
import { ContractSqliteRepo } from './infrastructure/persistence/ContractSqliteRepo';

import type { IContractUseCase } from './domain/ports/driving/IContractUseCase';
import type { IContractRepo } from './domain/ports/driven/IContractRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo contracts
 * Siguiendo el principio de inversión de dependencias
 */
export class ContractContainer {
  private static contractRepo: IContractRepo | null = null;
  private static contractUseCase: IContractUseCase | null = null;
  private static contractController: ContractController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): IContractRepo {
    if (!this.contractRepo) {
      this.contractRepo = new ContractSqliteRepo();
    }
    return this.contractRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): IContractUseCase {
    if (!this.contractUseCase) {
      this.contractUseCase = new ContractService(this.getRepository());
    }
    return this.contractUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): ContractController {
    if (!this.contractController) {
      this.contractController = new ContractController(this.getUseCase());
    }
    return this.contractController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.contractRepo = null;
    this.contractUseCase = null;
    this.contractController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: IContractRepo,
    useCase?: IContractUseCase,
    controller?: ContractController
  ): void {
    if (repo) this.contractRepo = repo;
    if (useCase) this.contractUseCase = useCase;
    if (controller) this.contractController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const contractRepository = ContractContainer.getRepository();
export const contractUseCase = ContractContainer.getUseCase();
export const contractController = ContractContainer.getController();
