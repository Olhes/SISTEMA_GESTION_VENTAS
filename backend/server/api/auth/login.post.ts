import { authController } from '~/src/modules/auth';

export default defineEventHandler(async (event) => {
  const response = await authController.login(event);
  
  // Mantener la sesión de usuario para compatibilidad
  if (response.status === 'success' && response.user) {
    await setUserSession(event, {
      user: response.user,
      loggedInAt: new Date(),
    });
  }
  
  return response;
});
