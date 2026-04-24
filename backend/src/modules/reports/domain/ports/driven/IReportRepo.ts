/**
 * Puerto Secundario: Interfaz del Repositorio de Reportes
 * Define el contrato de persistencia sin dependencias de infraestructura
 */

import type { Reporte, ReporteConDetalles, TipoReporte } from '../../entities/Report';

export interface IReportRepo {
  // Operaciones CRUD básicas
  findById(id: number): Promise<Reporte | null>;
  findAll(): Promise<Reporte[]>;
  save(reporte: Reporte): Promise<Reporte>;
  update(id: number, reporte: Partial<Reporte>): Promise<Reporte>;
  delete(id: number): Promise<void>;
  
  // Operaciones con detalles
  findByIdWithDetails(id: number): Promise<ReporteConDetalles | null>;
  findAllWithDetails(): Promise<ReporteConDetalles[]>;
  
  // Operaciones de consulta especializadas
  findByTipo(tipo: TipoReporte): Promise<Reporte[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Reporte[]>;
  findRecent(limit: number): Promise<Reporte[]>;
  
  // Estadísticas y análisis
  getTotalCount(): Promise<number>;
  getCountByTipo(): Promise<Record<TipoReporte, number>>;
  getCountByFecha(fecha: Date): Promise<number>;
  getCountByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<number>;
  getAverageGenerationTime(): Promise<number>;
  
  // Operaciones de exportación
  saveExportedData(idReporte: number, formato: string, datos: string | Buffer): Promise<void>;
  getExportedData(idReporte: number, formato: string): Promise<string | Buffer | null>;
}

// DTOs para operaciones del repositorio
export interface CreateReporteData {
  nombre: string;
  tipo: string;
  descripcion: string | null;
  parametros: string; // JSON string
  fecha_generacion: string;
  datos: string; // JSON string
  formato: string;
  id_usuario_generador?: number;
}

export interface ReporteExportadoData {
  id_reporte_exportado: number;
  id_reporte: number;
  formato: string;
  datos: string; // Base64 encoded
  fecha_generacion: string;
  tamano_bytes: number;
}
