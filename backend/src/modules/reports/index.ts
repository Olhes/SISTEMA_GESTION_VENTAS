/**
 * Punto de entrada del módulo Reports
 * Exporta todas las interfaces y clases necesarias
 */

// Entidades de dominio
export type { 
  Reporte, 
  ReporteConDetalles,
  TipoReporte,
  ReporteParametros,
  ReporteDatos,
  ReporteMetricas,
  FormatoReporte,
  CrearReporteData,
  ActualizarReporteData
} from './domain/entities/Report';

export { ReportAggregate } from './domain/entities/Report';

// Puertos (interfaces)
export type { 
  IReportUseCase, 
  CrearReporteRequest, 
  ActualizarReporteRequest,
  GenerarReporteRequest,
  ExportarReporteRequest,
  ReporteEstadisticas
} from './domain/ports/driving/IReportUseCase';
export type { IReportRepo, CreateReporteData } from './domain/ports/driven/IReportRepo';

// Implementaciones
export { ReportService } from './application/use_cases/ReportService';
export { ReportController } from './infrastructure/api/ReportController';
export { ReportSqliteRepo } from './infrastructure/persistence/ReportSqliteRepo';
export { ReportMapper } from './infrastructure/mappers/ReportMapper';

// Entidades de persistencia
export type { 
  ReporteEntity, 
  ReporteExportadoEntity,
  ReporteWithDetailsEntity,
  ReporteUsuarioEntity,
  ReporteEstadisticasEntity
} from './infrastructure/persistence/ReportEntity';

// Contenedor de dependencias
export { 
  ReportContainer, 
  reportRepository, 
  reportUseCase, 
  reportController 
} from './container';
