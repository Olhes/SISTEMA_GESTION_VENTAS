/**
 * Punto de entrada del módulo Users
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Usuario, 
  UsuarioConDetalles,
  EstadoUsuario,
  CrearUsuarioData,
  ActualizarUsuarioData,
  CambiarContrasenaData,
  ResetearContrasenaData
} from './domain/entities/User';

export { UserAggregate } from './domain/entities/User';

// Puertos (interfaces)
export type { 
  IUserUseCase, 
  CrearUsuarioRequest, 
  ActualizarUsuarioRequest,
  LoginRequest,
  LoginResponse,
  CambiarContrasenaRequest,
  ResetearContrasenaRequest,
  SuspenderUsuarioRequest,
  BuscarUsuariosRequest,
  UserEstadisticas
} from './domain/ports/driving/IUserUseCase';
export type { IUserRepo, CreateUsuarioData } from './domain/ports/driven/IUserRepo';

// Implementaciones
export { UserService } from './application/use_cases/UserService';
export { UserController } from './infrastructure/api/UserController';
export { UserSqliteRepo } from './infrastructure/persistence/UserSqliteRepo';
export { UserMapper } from './infrastructure/mappers/UserMapper';

// Entidades de persistencia
export type { 
  UsuarioEntity, 
  RolEntity,
  UsuarioWithDetailsEntity,
  UsuarioPersonaEntity,
  UsuarioRolEntity,
  UsuarioEstadisticasEntity
} from './infrastructure/persistence/UserEntity';

// Contenedor de dependencias
export { 
  UserContainer, 
  userRepository, 
  userUseCase, 
  userController 
} from './container';
