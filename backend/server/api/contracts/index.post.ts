import { contractsService } from '~/src/modules/contracts/services/contracts.service';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id_persona, id_propiedad } = body;

    if (!id_persona || !id_propiedad) {
      throw createError({
        statusCode: 400,
        message: "ID de persona y propiedad son requeridos"
      });
    }

    const contrato = await contractsService.generarContrato(id_persona, id_propiedad);
    
    return {
      status: "success",
      message: "Contrato generado exitosamente",
      data: contrato
    };
  } catch (error) {
    console.error('Error al generar contrato:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Error al generar contrato"
    });
  }
});
