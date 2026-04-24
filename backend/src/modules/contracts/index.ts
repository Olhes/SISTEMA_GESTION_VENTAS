/**
 * Punto de entrada del módulo Contracts
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Contrato, 
  ContratoConDetalles,
  EstadoContrato,
  CrearContratoData,
  ActualizarContratoData
} from './domain/entities/Contract';

export { ContractAggregate } from './domain/entities/Contract';

// Puertos (interfaces)
export type { 
  IContractUseCase, 
  CrearContratoRequest, 
  ActualizarContratoRequest,
  FirmarContratoRequest,
  CancelarContratoRequest
} from './domain/ports/driving/IContractUseCase';
export type { IContractRepo, CreateContractData } from './domain/ports/driven/IContractRepo';

// Implementaciones
export { ContractService } from './application/use_cases/ContractService';
export { ContractController } from './infrastructure/api/ContractController';
export { ContractSqliteRepo } from './infrastructure/persistence/ContractSqliteRepo';
export { ContractMapper } from './infrastructure/mappers/ContractMapper';

// Entidades de persistencia
export type { 
  ContractEntity, 
  ContractWithDetailsEntity,
  ContractPropertyEntity,
  ContractPersonEntity
} from './infrastructure/persistence/ContractEntity';

// Contenedor de dependencias
export { 
  ContractContainer, 
  contractRepository, 
  contractUseCase, 
  contractController 
} from './container';
