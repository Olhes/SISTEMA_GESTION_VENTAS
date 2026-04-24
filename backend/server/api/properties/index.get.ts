import { propiedadController } from '~/src/modules/properties';

export default defineEventHandler(async (event) => {
  return await propiedadController.listarPropiedades(event);
});
