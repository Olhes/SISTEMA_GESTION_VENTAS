/**
 * Punto de entrada del módulo Properties
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Propiedad, 
  Interesado,
  CrearPropiedadData 
} from './domain/entities/Propiedad';

export { PropiedadAggregate } from './domain/entities/Propiedad';

// Puertos (interfaces)
export type { 
  IPropiedadUseCase, 
  CrearPropiedadRequest, 
  ActualizarPropiedadRequest 
} from './domain/ports/driving/IPropiedadUseCase';
export type { IPropiedadRepo, CreatePropiedadData } from './domain/ports/driven/IPropiedadRepo';

// Implementaciones
export { PropiedadService } from './application/use_cases/PropiedadService';
export { PropiedadController } from './infrastructure/api/PropiedadController';
export { PropiedadSqliteRepo } from './infrastructure/persistence/PropiedadSqliteRepo';
export { PropiedadMapper } from './infrastructure/mappers/PropiedadMapper';

// Entidades de persistencia
export type { 
  PropiedadEntity, 
  InteresadoEntity,
  PropiedadConInteresadosEntity
} from './infrastructure/persistence/PropiedadEntity';

// Contenedor de dependencias
export { 
  PropiedadContainer, 
  propiedadRepository, 
  propiedadUseCase, 
  propiedadController 
} from './container';
