/**
 * Puerto Primario: Interfaz del Caso de Uso de Reportes
 * Define la intención del negocio sin dependencias de infraestructura
 */

import type { Reporte, ReporteConDetalles, TipoReporte, ReporteParametros } from '../../entities/Report';

export interface IReportUseCase {
  // Operaciones CRUD
  listarReportes(): Promise<Reporte[]>;
  crearReporte(reporteData: CrearReporteRequest): Promise<Reporte>;
  actualizarReporte(id: number, reporteData: Partial<ActualizarReporteRequest>): Promise<Reporte>;
  eliminarReporte(id: number): Promise<void>;
  obtenerReportePorId(id: number): Promise<Reporte | null>;
  
  // Operaciones de generación de reportes
  generarReporteVentas(parametros: ReporteParametros): Promise<Reporte>;
  generarReporteLeads(parametros: ReporteParametros): Promise<Reporte>;
  generarReporteCitas(parametros: ReporteParametros): Promise<Reporte>;
  generarReportePropiedades(parametros: ReporteParametros): Promise<Reporte>;
  generarReporteUsuarios(parametros: ReporteParametros): Promise<Reporte>;
  
  // Operaciones especializadas
  listarReportesPorTipo(tipo: TipoReporte): Promise<Reporte[]>;
  listarReportesConDetalles(): Promise<ReporteConDetalles[]>;
  obtenerEstadisticasGeneracion(): Promise<ReporteEstadisticas>;
  
  // Operaciones de exportación
  exportarReporte(id: number, formato: string): Promise<ExportarReporteResponse>;
  descargarReporte(id: number): Promise<Buffer | string>;
}

// DTOs para requests del caso de uso
export interface CrearReporteRequest {
  nombre: string;
  tipo: TipoReporte;
  descripcion?: string;
  parametros?: ReporteParametros;
  formato?: string;
}

export interface ActualizarReporteRequest {
  nombre?: string;
  descripcion?: string;
  parametros?: ReporteParametros;
  formato?: string;
}

export interface GenerarReporteRequest {
  tipo: TipoReporte;
  nombre?: string;
  descripcion?: string;
  parametros: ReporteParametros;
  formato?: string;
}

export interface ExportarReporteRequest {
  formato: string;
  opciones?: Record<string, any>;
}

export interface ExportarReporteResponse {
  status: string;
  message: string;
  data: {
    formato: string;
    contenido: string | Buffer;
    nombreArchivo: string;
    tamano: number;
    fechaGeneracion: string;
  };
}

export interface ReporteEstadisticas {
  totalReportes: number;
  reportesPorTipo: Record<TipoReporte, number>;
  reportesGeneradosHoy: number;
  reportesGeneradosEstaSemana: number;
  tiempoPromedioGeneracion: number;
  formatoMasUsado: string;
}
