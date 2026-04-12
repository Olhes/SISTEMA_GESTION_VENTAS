import { leadsService } from '~/src/modules/leads/services/leads.service';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Usuario no autenticado"
      });
    }

    const leads = await leadsService.listarLeadsVendedor(user.id);
    
    return {
      status: "success",
      message: "Leads listados exitosamente",
      data: leads
    };
  } catch (error) {
    console.error('Error al listar leads:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Error al obtener leads"
    });
  }
});
