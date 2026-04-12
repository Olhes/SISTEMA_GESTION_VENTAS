import { authService } from '~/src/modules/auth/services/auth.service';
import type { LoginRequest } from '~/src/shared/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginRequest>(event);
    const { username, password } = body;

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: "Usuario y contraseña son requeridos",
      });
    }

    const loginResponse = await authService.login({ username, password });

    await setUserSession(event, {
      user: loginResponse.user,
      loggedInAt: new Date(),
    });

    return loginResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw createError({
      statusCode: 401,
      message: error instanceof Error ? error.message : "Error de autenticación",
    });
  }
});
