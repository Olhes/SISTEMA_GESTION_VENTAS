import { propertiesService } from '~/src/modules/properties/services/properties.service';

export default defineEventHandler(async (event) => {
  try {
    const propiedades = await propertiesService.listarPropiedades();
    
    return {
      status: "success",
      message: "Propiedades listadas exitosamente",
      data: propiedades
    };
  } catch (error) {
    console.error('Error al listar propiedades:', error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener la lista de propiedades"
    });
  }
});
