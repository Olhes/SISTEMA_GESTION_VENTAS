import { appointmentController } from '~/src/modules/appointments';

export default defineEventHandler(async (event) => {
  return await appointmentController.listarCitasPorUsuario(event);
});
