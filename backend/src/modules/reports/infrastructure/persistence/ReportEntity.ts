/**
 * Entidad de Persistencia: ReportEntity
 * Separada de la entidad de dominio para cumplir con la Dependency Rule
 * Contiene anotaciones y dependencias de infraestructura
 */

// Entidad principal de reportes
export interface ReporteEntity {
  id_reporte: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  parametros: string; // JSON string
  fecha_generacion: string;
  datos: string; // JSON string
  formato: string;
  id_usuario_generador?: number;
}

// Entidad para datos exportados
export interface ReporteExportadoEntity {
  id_reporte_exportado: number;
  id_reporte: number;
  formato: string;
  datos: string; // Base64 encoded
  fecha_generacion: string;
  tamano_bytes: number;
}

// Entidades combinadas para consultas complejas
export interface ReporteWithDetailsEntity extends ReporteEntity {
  // Datos de usuario generador
  usuario_nombre_usuario?: string;
  usuario_rol?: string;
  
  // Estadísticas adicionales
  total_descargas?: number;
  ultima_descarga?: string;
}

// Entidades para relaciones específicas
export interface ReporteUsuarioEntity {
  id_reporte: number;
  id_usuario: number;
  nombre_usuario: string;
  rol: string;
}

export interface ReporteEstadisticasEntity {
  tipo: string;
  cantidad: number;
  ultimo_generado: string;
  tiempo_promedio_ms: number;
}
