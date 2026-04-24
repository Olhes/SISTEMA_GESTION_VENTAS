/**
 * Punto de entrada del módulo Leads
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Lead, 
  LeadVendedor, 
  LeadComprador, 
  TipoPersona, 
  EstadoVendedor, 
  EstadoComprador,
  PersonaBase,
  CrearLeadData 
} from './domain/entities/Lead';

export { LeadAggregate } from './domain/entities/Lead';

// Puertos (interfaces)
export type { ILeadUseCase, CrearLeadRequest, ActualizarLeadRequest } from './domain/ports/driving/ILeadUseCase';
export type { ILeadRepo, CreateLeadData } from './domain/ports/driven/ILeadRepo';

// Implementaciones
export { LeadService } from './application/use_cases/LeadService';
export { LeadController } from './infrastructure/api/LeadController';
export { LeadSqliteRepo } from './infrastructure/persistence/LeadSqliteRepo';
export { LeadMapper } from './infrastructure/mappers/LeadMapper';

// Entidades de persistencia
export type { 
  LeadEntity, 
  UsuarioVendedorEntity, 
  UsuarioCompradorEntity,
  LeadVendedorEntity,
  LeadCompradorEntity
} from './infrastructure/persistence/LeadEntity';

// Contenedor de dependencias
export { LeadContainer, leadRepository, leadUseCase, leadController } from './container';
