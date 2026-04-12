import { usersService } from '~/src/modules/users/services/users.service';

export default defineEventHandler(async (event) => {
  try {
    const asesores = await usersService.listarAsesores();
    
    return {
      status: "success",
      message: "Asesores listados exitosamente",
      data: asesores
    };
  } catch (error) {
    console.error('Error al listar asesores:', error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener la lista de asesores"
    });
  }
});
