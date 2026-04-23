/**
 * Implementación del Caso de Uso de Reportes
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  IReportUseCase, 
  CrearReporteRequest, 
  ActualizarReporteRequest,
  GenerarReporteRequest,
  ExportarReporteRequest,
  ReporteEstadisticas
} from '../../domain/ports/driving/IReportUseCase';
import type { IReportRepo, CreateReporteData } from '../../domain/ports/driven/IReportRepo';
import type { 
  Reporte,
  ReporteConDetalles,
  TipoReporte,
  ReporteParametros,
  CrearReporteData as DominioCrearReporteData,
  ActualizarReporteData as DominioActualizarReporteData
} from '../../domain/entities/Report';
import { ReportAggregate } from '../../domain/entities/Report';

export class ReportService implements IReportUseCase {
  constructor(private readonly reportRepo: IReportRepo) {}

  async listarReportes(): Promise<Reporte[]> {
    return await this.reportRepo.findAll();
  }

  async crearReporte(reporteData: CrearReporteRequest): Promise<Reporte> {
    // Validaciones de negocio
    if (!ReportAggregate.puedeSerGenerado(reporteData.tipo)) {
      throw new Error('El tipo de reporte especificado no es válido');
    }

    // Generar datos del reporte según el tipo
    const datos = this.generarDatosPorTipo(reporteData.tipo, reporteData.parametros || {});

    // Transformar datos para el dominio
    const dominioData: DominioCrearReporteData = {
      nombre: reporteData.nombre,
      tipo: reporteData.tipo,
      descripcion: reporteData.descripcion,
      parametros: reporteData.parametros || {},
      datos,
      formato: (reporteData.formato as any) || 'JSON'
    };

    // Usar el Aggregate Root para crear el reporte
    const reporte = ReportAggregate.crearReporte(dominioData);

    // Guardar a través del repositorio
    return await this.reportRepo.save(reporte);
  }

  async actualizarReporte(id: number, reporteData: Partial<ActualizarReporteRequest>): Promise<Reporte> {
    const existingReporte = await this.reportRepo.findById(id);
    if (!existingReporte) {
      throw new Error('Reporte no encontrado');
    }

    // Si se cambian parámetros, regenerar datos
    let nuevosDatos = existingReporte.datos;
    if (reporteData.parametros) {
      nuevosDatos = this.generarDatosPorTipo(existingReporte.tipo, reporteData.parametros);
    }

    const dominioData: Partial<DominioActualizarReporteData> = {
      nombre: reporteData.nombre,
      descripcion: reporteData.descripcion,
      parametros: reporteData.parametros,
      formato: reporteData.formato as any
    };

    const reporteActualizado = { ...existingReporte, ...dominioData };
    if (reporteData.parametros) {
      reporteActualizado.datos = nuevosDatos;
    }

    return await this.reportRepo.update(id, reporteActualizado);
  }

  async eliminarReporte(id: number): Promise<void> {
    const existingReporte = await this.reportRepo.findById(id);
    if (!existingReporte) {
      throw new Error('Reporte no encontrado');
    }

    await this.reportRepo.delete(id);
  }

  async obtenerReportePorId(id: number): Promise<Reporte | null> {
    return await this.reportRepo.findById(id);
  }

  async generarReporteVentas(parametros: ReporteParametros): Promise<Reporte> {
    const datos = ReportAggregate.generarReporteVentas(parametros);
    
    const reporte: Reporte = {
      id: 0,
      nombre: `Reporte de Ventas - ${new Date().toLocaleDateString('es-ES')}`,
      tipo: 'Ventas',
      descripcion: 'Reporte de ventas con métricas y estadísticas',
      parametros,
      fechaGeneracion: new Date(),
      datos,
      formato: 'JSON'
    };

    return await this.reportRepo.save(reporte);
  }

  async generarReporteLeads(parametros: ReporteParametros): Promise<Reporte> {
    const datos = ReportAggregate.generarReporteLeads(parametros);
    
    const reporte: Reporte = {
      id: 0,
      nombre: `Reporte de Leads - ${new Date().toLocaleDateString('es-ES')}`,
      tipo: 'Leads',
      descripcion: 'Reporte de leads con tasas de conversión y métricas',
      parametros,
      fechaGeneracion: new Date(),
      datos,
      formato: 'JSON'
    };

    return await this.reportRepo.save(reporte);
  }

  async generarReporteCitas(parametros: ReporteParametros): Promise<Reporte> {
    const datos = ReportAggregate.generarReporteCitas(parametros);
    
    const reporte: Reporte = {
      id: 0,
      nombre: `Reporte de Citas - ${new Date().toLocaleDateString('es-ES')}`,
      tipo: 'Citas',
      descripcion: 'Reporte de citas con estadísticas de asistencia',
      parametros,
      fechaGeneracion: new Date(),
      datos,
      formato: 'JSON'
    };

    return await this.reportRepo.save(reporte);
  }

  async generarReportePropiedades(parametros: ReporteParametros): Promise<Reporte> {
    const datos = ReportAggregate.generarReportePropiedades(parametros);
    
    const reporte: Reporte = {
      id: 0,
      nombre: `Reporte de Propiedades - ${new Date().toLocaleDateString('es-ES')}`,
      tipo: 'Propiedades',
      descripcion: 'Reporte de propiedades con precios y disponibilidad',
      parametros,
      fechaGeneracion: new Date(),
      datos,
      formato: 'JSON'
    };

    return await this.reportRepo.save(reporte);
  }

  async generarReporteUsuarios(parametros: ReporteParametros): Promise<Reporte> {
    const datos = ReportAggregate.generarReporteUsuarios(parametros);
    
    const reporte: Reporte = {
      id: 0,
      nombre: `Reporte de Usuarios - ${new Date().toLocaleDateString('es-ES')}`,
      tipo: 'Usuarios',
      descripcion: 'Reporte de usuarios con roles y actividad',
      parametros,
      fechaGeneracion: new Date(),
      datos,
      formato: 'JSON'
    };

    return await this.reportRepo.save(reporte);
  }

  async listarReportesPorTipo(tipo: TipoReporte): Promise<Reporte[]> {
    return await this.reportRepo.findByTipo(tipo);
  }

  async listarReportesConDetalles(): Promise<ReporteConDetalles[]> {
    return await this.reportRepo.findAllWithDetails();
  }

  async obtenerEstadisticasGeneracion(): Promise<ReporteEstadisticas> {
    const [
      totalReportes,
      reportesPorTipo,
      reportesHoy,
      reportesSemana,
      tiempoPromedio
    ] = await Promise.all([
      this.reportRepo.getTotalCount(),
      this.reportRepo.getCountByTipo(),
      this.reportRepo.getCountByFecha(new Date()),
      this.getReportesEstaSemana(),
      this.reportRepo.getAverageGenerationTime()
    ]);

    return {
      totalReportes,
      reportesPorTipo,
      reportesGeneradosHoy: reportesHoy,
      reportesGeneradosEstaSemana: reportesSemana,
      tiempoPromedioGeneracion: tiempoPromedio,
      formatoMasUsado: 'JSON' // En un sistema real, se calcularía desde la BD
    };
  }

  async exportarReporte(id: number, formato: string): Promise<any> {
    const reporte = await this.reportRepo.findById(id);
    if (!reporte) {
      throw new Error('Reporte no encontrado');
    }

    // Convertir el reporte al formato solicitado
    let contenido: string;
    let nombreArchivo: string;

    switch (formato.toUpperCase()) {
      case 'CSV':
        contenido = this.convertirACSV(reporte);
        nombreArchivo = `${reporte.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        break;
      case 'JSON':
        contenido = JSON.stringify(reporte, null, 2);
        nombreArchivo = `${reporte.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        break;
      case 'PDF':
        // En un sistema real, se usaría una librería como PDFKit
        contenido = this.convertirAHTML(reporte); // Placeholder
        nombreArchivo = `${reporte.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        break;
      case 'EXCEL':
        // En un sistema real, se usaría una librería como ExcelJS
        contenido = this.convertirACSV(reporte); // Placeholder
        nombreArchivo = `${reporte.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
        break;
      default:
        throw new Error(`Formato no soportado: ${formato}`);
    }

    const tamano = Buffer.byteLength(contenido, 'utf8');

    return {
      status: "success",
      message: `Reporte exportado exitosamente en formato ${formato}`,
      data: {
        formato: formato.toUpperCase(),
        contenido,
        nombreArchivo,
        tamano,
        fechaGeneracion: new Date().toISOString()
      }
    };
  }

  async descargarReporte(id: number): Promise<Buffer | string> {
    const reporte = await this.reportRepo.findById(id);
    if (!reporte) {
      throw new Error('Reporte no encontrado');
    }

    return JSON.stringify(reporte, null, 2);
  }

  // Métodos privados de ayuda
  private generarDatosPorTipo(tipo: TipoReporte, parametros: ReporteParametros): any {
    switch (tipo) {
      case 'Ventas':
        return ReportAggregate.generarReporteVentas(parametros);
      case 'Leads':
        return ReportAggregate.generarReporteLeads(parametros);
      case 'Citas':
        return ReportAggregate.generarReporteCitas(parametros);
      case 'Propiedades':
        return ReportAggregate.generarReportePropiedades(parametros);
      case 'Usuarios':
        return ReportAggregate.generarReporteUsuarios(parametros);
      default:
        throw new Error(`Tipo de reporte no soportado: ${tipo}`);
    }
  }

  private async getReportesEstaSemana(): Promise<number> {
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(finSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    return await this.reportRepo.getCountByFechaRange(inicioSemana, finSemana);
  }

  private convertirACSV(reporte: Reporte): string {
    // Implementación simple de conversión a CSV
    const headers = ['ID', 'Nombre', 'Tipo', 'Fecha Generación', 'Total Registros'];
    const rows = [
      headers.join(','),
      `${reporte.id},"${reporte.nombre}","${reporte.tipo}","${reporte.fechaGeneracion.toISOString()}","${reporte.datos.totalRegistros}"`
    ];

    // Agregar detalles si existen
    if (reporte.datos.detalles && reporte.datos.detalles.length > 0) {
      rows.push(''); // Línea en blanco
      rows.push('Detalles:');
      const detalleHeaders = Object.keys(reporte.datos.detalles[0]);
      rows.push(detalleHeaders.join(','));
      
      reporte.datos.detalles.forEach(detalle => {
        const valores = detalleHeaders.map(header => {
          const valor = detalle[header];
          return typeof valor === 'string' ? `"${valor}"` : valor;
        });
        rows.push(valores.join(','));
      });
    }

    return rows.join('\n');
  }

  private convertirAHTML(reporte: Reporte): string {
    // Implementación simple de conversión a HTML (para PDF)
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${reporte.nombre}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>${reporte.nombre}</h1>
    <p><strong>Tipo:</strong> ${reporte.tipo}</p>
    <p><strong>Fecha Generación:</strong> ${reporte.fechaGeneracion.toLocaleString('es-ES')}</p>
    <p><strong>Descripción:</strong> ${reporte.descripcion || 'N/A'}</p>
    
    <h2>Resumen</h2>
    <table>
        <tr><th>Métrica</th><th>Valor</th></tr>
        ${Object.entries(reporte.datos.resumen).map(([key, value]) => 
          `<tr><td>${key}</td><td>${value}</td></tr>`
        ).join('')}
    </table>
    
    <h2>Detalles</h2>
    <table>
        <tr><th>ID</th><th>Nombre</th><th>Valor</th><th>Fecha</th></tr>
        ${reporte.datos.detalles.map(detalle => 
          `<tr>
            <td>${detalle.id}</td>
            <td>${detalle.nombre}</td>
            <td>${detalle.valor}</td>
            <td>${new Date(detalle.fecha).toLocaleDateString('es-ES')}</td>
          </tr>`
        ).join('')}
    </table>
</body>
</html>`;
  }
}
