/**
 * Mapper: ReportMapper
 * Traductor entre entidades de dominio y entidades de persistencia
 * Aísla el mapeo de datos del resto del sistema
 */

import type { Reporte, ReporteConDetalles, TipoReporte } from '../../domain/entities/Report';
import type { 
  ReporteEntity, 
  ReporteWithDetailsEntity,
  ReporteUsuarioEntity,
  ReporteEstadisticasEntity
} from '../persistence/ReportEntity';

export class ReportMapper {
  // Mapeo de entidad de persistencia a entidad de dominio
  static toReporte(entity: ReporteEntity): Reporte {
    return {
      id: entity.id_reporte,
      nombre: entity.nombre,
      tipo: entity.tipo as TipoReporte,
      descripcion: entity.descripcion,
      parametros: this.parseJSON(entity.parametros),
      fechaGeneracion: new Date(entity.fecha_generacion),
      datos: this.parseJSON(entity.datos),
      formato: entity.formato as any
    };
  }

  // Mapeo de entidad de dominio a entidad de persistencia
  static toReportePersistence(reporte: Reporte): ReporteEntity {
    return {
      id_reporte: reporte.id,
      nombre: reporte.nombre,
      tipo: reporte.tipo,
      descripcion: reporte.descripcion || null,
      parametros: JSON.stringify(reporte.parametros),
      fecha_generacion: reporte.fechaGeneracion.toISOString(),
      datos: JSON.stringify(reporte.datos),
      formato: reporte.formato,
      id_usuario_generador: 1 // TODO: Obtener del contexto
    };
  }

  // Mapeo para reportes con detalles
  static toReporteConDetalles(row: ReporteWithDetailsEntity): ReporteConDetalles {
    const reporte = this.toReporte(row);
    return {
      ...reporte,
      generador: row.usuario_nombre_usuario ? {
        id: row.id_usuario_generador || 0,
        nombreUsuario: row.usuario_nombre_usuario,
        rol: row.usuario_rol || 'Unknown'
      } : undefined,
      estadisticas: {
        tiempoGeneracion: 2500, // Simulado
        tamanoArchivo: Buffer.byteLength(JSON.stringify(reporte.datos), 'utf8'),
        descargas: 0 // Simulado
      }
    };
  }

  // Mapeo para relaciones específicas
  static toReporteUsuario(entity: ReporteUsuarioEntity): ReporteConDetalles['generador'] {
    return {
      id: entity.id_usuario,
      nombreUsuario: entity.nombre_usuario,
      rol: entity.rol
    };
  }

  static toReporteEstadisticas(entity: ReporteEstadisticasEntity): any {
    return {
      tipo: entity.tipo,
      cantidad: entity.cantidad,
      ultimoGenerado: entity.ultimo_generado,
      tiempoPromedioMs: entity.tiempo_promedio_ms
    };
  }

  // Validación de mapeo
  static isValidTipo(tipo: string): tipo is TipoReporte {
    const tiposValidos: TipoReporte[] = ["Ventas", "Leads", "Citas", "Propiedades", "Usuarios"];
    return tiposValidos.includes(tipo as TipoReporte);
  }

  static isValidReporte(reporte: Partial<Reporte>): boolean {
    if (!reporte.nombre?.trim()) {
      return false;
    }
    if (!reporte.tipo) {
      return false;
    }
    if (!this.isValidTipo(reporte.tipo)) {
      return false;
    }
    return true;
  }

  static isValidFormato(formato: string): boolean {
    const formatosValidos = ["JSON", "CSV", "PDF", "Excel"];
    return formatosValidos.includes(formato);
  }

  static formatTipo(tipo: string): TipoReporte {
    const tipoFormateado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
    if (!this.isValidTipo(tipoFormateado)) {
      throw new Error(`Tipo de reporte inválido: ${tipo}`);
    }
    return tipoFormateado;
  }

  static formatFecha(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (isNaN(fechaObj.getTime())) {
      throw new Error('Fecha inválida');
    }
    return fechaObj.toISOString();
  }

  // Métodos de ayuda para JSON
  private static parseJSON(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {};
    }
  }

  // Métodos de exportación
  static toJSON(reporte: Reporte): string {
    return JSON.stringify(reporte, null, 2);
  }

  static toCSV(reporte: Reporte): string {
    const headers = ['ID', 'Nombre', 'Tipo', 'Fecha Generación', 'Total Registros', 'Formato'];
    const rows = [
      headers.join(','),
      `${reporte.id},"${reporte.nombre}","${reporte.tipo}","${reporte.fechaGeneracion.toISOString()}","${reporte.datos.totalRegistros}","${reporte.formato}"`
    ];

    // Agregar métricas si existen
    if (reporte.datos.metricas) {
      rows.push(''); // Línea en blanco
      rows.push('Métricas:');
      Object.entries(reporte.datos.metricas).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          rows.push(`"${key}","${JSON.stringify(value)}"`);
        } else {
          rows.push(`"${key}","${value}"`);
        }
      });
    }

    return rows.join('\n');
  }

  static toXML(reporte: Reporte): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<reporte>
  <id>${reporte.id}</id>
  <nombre><![CDATA[${reporte.nombre}]]></nombre>
  <tipo>${reporte.tipo}</tipo>
  <descripcion><![CDATA[${reporte.descripcion || ''}]]></descripcion>
  <fechaGeneracion>${reporte.fechaGeneracion.toISOString()}</fechaGeneracion>
  <formato>${reporte.formato}</formato>
  <datos>
    <totalRegistros>${reporte.datos.totalRegistros}</totalRegistros>
    <resumen><![CDATA[${JSON.stringify(reporte.datos.resumen)}]]></resumen>
  </datos>
</reporte>`;
  }

  static generarNombreArchivo(reporte: Reporte, formato: string): string {
    const nombreLimpio = reporte.nombre.replace(/[^a-zA-Z0-9]/g, '_');
    const fecha = reporte.fechaGeneracion.toISOString().split('T')[0];
    return `${nombreLimpio}_${fecha}.${formato.toLowerCase()}`;
  }

  static calcularTamanoArchivo(reporte: Reporte, formato: string): number {
    const contenido = this.convertirAFormato(reporte, formato);
    return Buffer.byteLength(contenido, 'utf8');
  }

  static convertirAFormato(reporte: Reporte, formato: string): string {
    switch (formato.toUpperCase()) {
      case 'JSON':
        return this.toJSON(reporte);
      case 'CSV':
        return this.toCSV(reporte);
      case 'XML':
        return this.toXML(reporte);
      default:
        throw new Error(`Formato no soportado: ${formato}`);
    }
  }

  static generarResumenEjecutivo(reporte: Reporte): string {
    const resumen = reporte.datos.resumen;
    let texto = `Reporte: ${reporte.nombre}\n`;
    texto += `Tipo: ${reporte.tipo}\n`;
    texto += `Fecha: ${reporte.fechaGeneracion.toLocaleDateString('es-ES')}\n`;
    texto += `Total Registros: ${reporte.datos.totalRegistros}\n\n`;
    
    texto += 'Resumen Ejecutivo:\n';
    Object.entries(resumen).forEach(([key, value]) => {
      texto += `- ${this.formatKey(key)}: ${value}\n`;
    });

    return texto;
  }

  private static formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  static validarParametros(tipo: TipoReporte, parametros: any): boolean {
    // Validaciones específicas por tipo
    switch (tipo) {
      case 'Ventas':
      case 'Leads':
      case 'Citas':
        return parametros.fechaInicio && parametros.fechaFin;
      case 'Propiedades':
      case 'Usuarios':
        return true; // No requieren fechas obligatorias
      default:
        return false;
    }
  }

  static obtenerTiempoEstimado(tipo: TipoReporte): number {
    const tiempos = {
      'Ventas': 3000,
      'Leads': 2500,
      'Citas': 2000,
      'Propiedades': 1500,
      'Usuarios': 1000
    };
    return tiempos[tipo] || 2000;
  }

  static generarColorTipo(tipo: TipoReporte): string {
    const colores = {
      'Ventas': '#4CAF50',
      'Leads': '#2196F3',
      'Citas': '#FF9800',
      'Propiedades': '#9C27B0',
      'Usuarios': '#F44336'
    };
    return colores[tipo] || '#607D8B';
  }
}
