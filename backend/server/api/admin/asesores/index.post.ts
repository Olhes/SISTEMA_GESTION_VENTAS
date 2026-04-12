import { usersService } from '~/src/modules/users/services/users.service';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { nombre_usuario, contrasena, id_persona, id_rol } = body;

    if (!nombre_usuario || !contrasena || !id_persona || !id_rol) {
      throw createError({
        statusCode: 400,
        message: "Todos los campos son requeridos"
      });
    }

    const nuevoAsesor = await usersService.crearAsesor({
      nombre_usuario,
      contrasena,
      id_persona,
      id_rol
    });

    return {
      status: "success",
      message: "Asesor creado exitosamente",
      data: nuevoAsesor
    };
  } catch (error) {
    console.error('Error al crear asesor:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Error al crear asesor"
    });
  }
});
