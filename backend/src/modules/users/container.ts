/**
 * Contenedor de Inyección de Dependencias - Módulo Users
 * Configura todas las dependencias del módulo siguiendo la Dependency Rule
 */

import { UserController } from './infrastructure/api/UserController';
import { UserService } from './application/use_cases/UserService';
import { UserSqliteRepo } from './infrastructure/persistence/UserSqliteRepo';

import type { IUserUseCase } from './domain/ports/driving/IUserUseCase';
import type { IUserRepo } from './domain/ports/driven/IUserRepo';

/**
 * Clase contenedora que gestiona las dependencias del módulo users
 * Siguiendo el principio de inversión de dependencias
 */
export class UserContainer {
  private static userRepo: IUserRepo | null = null;
  private static userUseCase: IUserUseCase | null = null;
  private static userController: UserController | null = null;

  /**
   * Obtiene la instancia del repositorio (Adaptador Secundario)
   */
  static getRepository(): IUserRepo {
    if (!this.userRepo) {
      this.userRepo = new UserSqliteRepo();
    }
    return this.userRepo;
  }

  /**
   * Obtiene la instancia del caso de uso (Capa de Aplicación)
   */
  static getUseCase(): IUserUseCase {
    if (!this.userUseCase) {
      this.userUseCase = new UserService(this.getRepository());
    }
    return this.userUseCase;
  }

  /**
   * Obtiene la instancia del controlador (Adaptador Primario)
   */
  static getController(): UserController {
    if (!this.userController) {
      this.userController = new UserController(this.getUseCase());
    }
    return this.userController;
  }

  /**
   * Resetea las instancias (útil para testing)
   */
  static reset(): void {
    this.userRepo = null;
    this.userUseCase = null;
    this.userController = null;
  }

  /**
   * Permite inyectar dependencias manualmente (para testing)
   */
  static configureDependencies(
    repo?: IUserRepo,
    useCase?: IUserUseCase,
    controller?: UserController
  ): void {
    if (repo) this.userRepo = repo;
    if (useCase) this.userUseCase = useCase;
    if (controller) this.userController = controller;
  }
}

/**
 * Exportaciones por defecto para uso fácil
 */
export const userRepository = UserContainer.getRepository();
export const userUseCase = UserContainer.getUseCase();
export const userController = UserContainer.getController();
