import { contractController } from '~/src/modules/contracts';

export default defineEventHandler(async (event) => {
  return await contractController.crearContrato(event);
});
