/**
 * Contenedor de Inyección de Dependencias - Módulo Properties
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { PropiedadController } from './infrastructure/api/PropiedadController';
import { PropiedadService } from './application/use_cases/PropiedadService';
import { PropiedadSqliteRepo } from './infrastructure/persistence/PropiedadSqliteRepo';

import type { IPropiedadUseCase } from './domain/ports/driving/IPropiedadUseCase';
import type { IPropiedadRepo } from './domain/ports/driven/IPropiedadRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo properties
 * Siguiendo el principio de inversión de dependencias
 */
export class PropiedadContainer {
  private static propiedadRepo: IPropiedadRepo | null = null;
  private static propiedadUseCase: IPropiedadUseCase | null = null;
  private static propiedadController: PropiedadController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): IPropiedadRepo {
    if (!this.propiedadRepo) {
      this.propiedadRepo = new PropiedadSqliteRepo();
    }
    return this.propiedadRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): IPropiedadUseCase {
    if (!this.propiedadUseCase) {
      this.propiedadUseCase = new PropiedadService(this.getRepository());
    }
    return this.propiedadUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): PropiedadController {
    if (!this.propiedadController) {
      this.propiedadController = new PropiedadController(this.getUseCase());
    }
    return this.propiedadController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.propiedadRepo = null;
    this.propiedadUseCase = null;
    this.propiedadController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: IPropiedadRepo,
    useCase?: IPropiedadUseCase,
    controller?: PropiedadController
  ): void {
    if (repo) this.propiedadRepo = repo;
    if (useCase) this.propiedadUseCase = useCase;
    if (controller) this.propiedadController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const propiedadRepository = PropiedadContainer.getRepository();
export const propiedadUseCase = PropiedadContainer.getUseCase();
export const propiedadController = PropiedadContainer.getController();
