import { reportsService } from '~/src/modules/reports/services/reports.service';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { fecha_inicio, fecha_fin } = query;

    if (!fecha_inicio || !fecha_fin) {
      throw createError({
        statusCode: 400,
        message: "Fechas de inicio y fin son requeridas"
      });
    }

    const reporte = await reportsService.generarReporteVentas(
      fecha_inicio as string, 
      fecha_fin as string
    );
    
    return {
      status: "success",
      message: "Reporte de ventas generado exitosamente",
      data: reporte
    };
  } catch (error) {
    console.error('Error al generar reporte:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Error al generar reporte"
    });
  }
});
