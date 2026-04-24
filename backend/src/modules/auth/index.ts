/**
 * Punto de entrada del módulo Auth
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Usuario, 
  UsuarioConDetalles,
  Sesion,
  Rol,
  RolNombre,
  Credenciales,
  CrearUsuarioData,
  ActualizarUsuarioData,
  CrearSesionData
} from './domain/entities/Auth';

export { AuthAggregate } from './domain/entities/Auth';

// Puertos (interfaces)
export type { 
  IAuthUseCase, 
  LoginRequest, 
  LoginResponse,
  CrearUsuarioRequest,
  ActualizarUsuarioRequest,
  CambiarContrasenaRequest
} from './domain/ports/driving/IAuthUseCase';
export type { IAuthRepo, CreateUsuarioData, CreateSesionData } from './domain/ports/driven/IAuthRepo';

// Implementaciones
export { AuthService } from './application/use_cases/AuthService';
export { AuthController } from './infrastructure/api/AuthController';
export { AuthSqliteRepo } from './infrastructure/persistence/AuthSqliteRepo';
export { AuthMapper } from './infrastructure/mappers/AuthMapper';

// Entidades de persistencia
export type { 
  UsuarioEntity, 
  RolEntity,
  SesionEntity,
  UsuarioWithDetailsEntity,
  UsuarioPersonaEntity,
  UsuarioRolEntity
} from './infrastructure/persistence/AuthEntity';

// Contenedor de dependencias
export { 
  AuthContainer, 
  authRepository, 
  authUseCase, 
  authController 
} from './container';
