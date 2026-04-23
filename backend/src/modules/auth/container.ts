/**
 * Contenedor de Inyección de Dependencias - Módulo Auth
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { AuthController } from './infrastructure/api/AuthController';
import { AuthService } from './application/use_cases/AuthService';
import { AuthSqliteRepo } from './infrastructure/persistence/AuthSqliteRepo';

import type { IAuthUseCase } from './domain/ports/driving/IAuthUseCase';
import type { IAuthRepo } from './domain/ports/driven/IAuthRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo auth
 * Siguiendo el principio de inversión de dependencias
 */
export class AuthContainer {
  private static authRepo: IAuthRepo | null = null;
  private static authUseCase: IAuthUseCase | null = null;
  private static authController: AuthController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): IAuthRepo {
    if (!this.authRepo) {
      this.authRepo = new AuthSqliteRepo();
    }
    return this.authRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): IAuthUseCase {
    if (!this.authUseCase) {
      this.authUseCase = new AuthService(this.getRepository());
    }
    return this.authUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): AuthController {
    if (!this.authController) {
      this.authController = new AuthController(this.getUseCase());
    }
    return this.authController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.authRepo = null;
    this.authUseCase = null;
    this.authController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: IAuthRepo,
    useCase?: IAuthUseCase,
    controller?: AuthController
  ): void {
    if (repo) this.authRepo = repo;
    if (useCase) this.authUseCase = useCase;
    if (controller) this.authController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const authRepository = AuthContainer.getRepository();
export const authUseCase = AuthContainer.getUseCase();
export const authController = AuthContainer.getController();
