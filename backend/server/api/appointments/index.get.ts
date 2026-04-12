import { appointmentsService } from '~/src/modules/appointments/services/appointments.service';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Usuario no autenticado"
      });
    }

    const citas = await appointmentsService.listarCitas(user.id);
    
    return {
      status: "success",
      message: "Citas listadas exitosamente",
      data: citas
    };
  } catch (error) {
    console.error('Error al listar citas:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Error al obtener citas"
    });
  }
});
