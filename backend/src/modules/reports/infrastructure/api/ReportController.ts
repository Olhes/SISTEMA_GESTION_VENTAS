/**
 * Adaptador Primario: ReportController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { IReportUseCase } from '../../domain/ports/driving/IReportUseCase';
import type { 
  CrearReporteRequest, 
  ActualizarReporteRequest,
  GenerarReporteRequest,
  ExportarReporteRequest
} from '../../domain/ports/driving/IReportUseCase';

export class ReportController {
  constructor(private readonly reportUseCase: IReportUseCase) {}

  // Endpoint para listar reportes
  async listarReportes(event: any): Promise<any> {
    try {
      const reportes = await this.reportUseCase.listarReportes();
      
      return {
        status: "success",
        message: "Reportes listados exitosamente",
        data: reportes
      };
    } catch (error) {
      console.error('Error al listar reportes:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener reportes"
      });
    }
  }

  // Endpoint para crear reporte
  async crearReporte(event: any): Promise<any> {
    try {
      const body = await readBody<CrearReporteRequest>(event);
      
      // Validaciones básicas
      this.validarCrearReporteRequest(body);

      const reporte = await this.reportUseCase.crearReporte(body);
      
      return {
        status: "success",
        message: "Reporte creado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al crear reporte:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al crear reporte"
      });
    }
  }

  // Endpoint para actualizar reporte
  async actualizarReporte(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de reporte inválido"
        });
      }

      const body = await readBody<Partial<ActualizarReporteRequest>>(event);
      
      const reporte = await this.reportUseCase.actualizarReporte(id, body);
      
      return {
        status: "success",
        message: "Reporte actualizado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar reporte"
      });
    }
  }

  // Endpoint para eliminar reporte
  async eliminarReporte(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de reporte inválido"
        });
      }

      await this.reportUseCase.eliminarReporte(id);
      
      return {
        status: "success",
        message: "Reporte eliminado exitosamente"
      };
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al eliminar reporte"
      });
    }
  }

  // Endpoint para obtener reporte por ID
  async obtenerReportePorId(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de reporte inválido"
        });
      }

      const reporte = await this.reportUseCase.obtenerReportePorId(id);
      
      if (!reporte) {
        throw createError({
          statusCode: 404,
          message: "Reporte no encontrado"
        });
      }
      
      return {
        status: "success",
        message: "Reporte obtenido exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al obtener reporte:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al obtener reporte"
      });
    }
  }

  // Endpoint para generar reporte de ventas
  async generarReporteVentas(event: any): Promise<any> {
    try {
      const body = await readBody<any>(event);
      
      const reporte = await this.reportUseCase.generarReporteVentas(body.parametros || {});
      
      return {
        status: "success",
        message: "Reporte de ventas generado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al generar reporte de ventas:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al generar reporte de ventas"
      });
    }
  }

  // Endpoint para generar reporte de leads
  async generarReporteLeads(event: any): Promise<any> {
    try {
      const body = await readBody<any>(event);
      
      const reporte = await this.reportUseCase.generarReporteLeads(body.parametros || {});
      
      return {
        status: "success",
        message: "Reporte de leads generado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al generar reporte de leads:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al generar reporte de leads"
      });
    }
  }

  // Endpoint para generar reporte de citas
  async generarReporteCitas(event: any): Promise<any> {
    try {
      const body = await readBody<any>(event);
      
      const reporte = await this.reportUseCase.generarReporteCitas(body.parametros || {});
      
      return {
        status: "success",
        message: "Reporte de citas generado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al generar reporte de citas:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al generar reporte de citas"
      });
    }
  }

  // Endpoint para generar reporte de propiedades
  async generarReportePropiedades(event: any): Promise<any> {
    try {
      const body = await readBody<any>(event);
      
      const reporte = await this.reportUseCase.generarReportePropiedades(body.parametros || {});
      
      return {
        status: "success",
        message: "Reporte de propiedades generado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al generar reporte de propiedades:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al generar reporte de propiedades"
      });
    }
  }

  // Endpoint para generar reporte de usuarios
  async generarReporteUsuarios(event: any): Promise<any> {
    try {
      const body = await readBody<any>(event);
      
      const reporte = await this.reportUseCase.generarReporteUsuarios(body.parametros || {});
      
      return {
        status: "success",
        message: "Reporte de usuarios generado exitosamente",
        data: reporte
      };
    } catch (error) {
      console.error('Error al generar reporte de usuarios:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al generar reporte de usuarios"
      });
    }
  }

  // Endpoint para listar reportes por tipo
  async listarReportesPorTipo(event: any): Promise<any> {
    try {
      const tipo = getRouterParam(event, 'tipo') as string;
      
      if (!tipo) {
        throw createError({
          statusCode: 400,
          message: "Tipo de reporte es requerido"
        });
      }

      const reportes = await this.reportUseCase.listarReportesPorTipo(tipo as any);
      
      return {
        status: "success",
        message: "Reportes listados exitosamente",
        data: reportes
      };
    } catch (error) {
      console.error('Error al listar reportes por tipo:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener reportes por tipo"
      });
    }
  }

  // Endpoint para listar reportes con detalles
  async listarReportesConDetalles(event: any): Promise<any> {
    try {
      const reportes = await this.reportUseCase.listarReportesConDetalles();
      
      return {
        status: "success",
        message: "Reportes con detalles listados exitosamente",
        data: reportes
      };
    } catch (error) {
      console.error('Error al listar reportes con detalles:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener reportes con detalles"
      });
    }
  }

  // Endpoint para obtener estadísticas
  async obtenerEstadisticas(event: any): Promise<any> {
    try {
      const estadisticas = await this.reportUseCase.obtenerEstadisticasGeneracion();
      
      return {
        status: "success",
        message: "Estadísticas obtenidas exitosamente",
        data: estadisticas
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener estadísticas"
      });
    }
  }

  // Endpoint para exportar reporte
  async exportarReporte(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de reporte inválido"
        });
      }

      const body = await readBody<ExportarReporteRequest>(event);
      
      const resultado = await this.reportUseCase.exportarReporte(id, body.formato);
      
      return resultado;
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al exportar reporte"
      });
    }
  }

  // Endpoint para descargar reporte
  async descargarReporte(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de reporte inválido"
        });
      }

      const contenido = await this.reportUseCase.descargarReporte(id);
      
      // Configurar headers para descarga
      setHeader(event, 'Content-Type', 'application/json');
      setHeader(event, 'Content-Disposition', `attachment; filename="reporte_${id}.json"`);
      
      return contenido;
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al descargar reporte"
      });
    }
  }

  // Métodos de validación
  private validarCrearReporteRequest(data: CrearReporteRequest): void {
    if (!data.nombre?.trim()) {
      throw new Error('El nombre del reporte es requerido');
    }
    if (!data.tipo) {
      throw new Error('El tipo de reporte es requerido');
    }
    
    const tiposValidos = ["Ventas", "Leads", "Citas", "Propiedades", "Usuarios"];
    if (!tiposValidos.includes(data.tipo)) {
      throw new Error('El tipo de reporte no es válido');
    }
  }
}
