import { leadController } from '~/src/modules/leads';

export default defineEventHandler(async (event) => {
  return await leadController.listarLeadsVendedor(event);
});
