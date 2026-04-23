/**
 * Adaptador Primario: AuthController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { IAuthUseCase } from '../../domain/ports/driving/IAuthUseCase';
import type { 
  LoginRequest, 
  CrearUsuarioRequest,
  ActualizarUsuarioRequest,
  CambiarContrasenaRequest
} from '../../domain/ports/driving/IAuthUseCase';

export class AuthController {
  constructor(private readonly authUseCase: IAuthUseCase) {}

  // Endpoint para login
  async login(event: any): Promise<any> {
    try {
      const body = await readBody<LoginRequest>(event);
      
      // Validaciones básicas
      this.validarLoginRequest(body);

      const response = await this.authUseCase.login(body);
      
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw createError({
        statusCode: 401,
        message: error instanceof Error ? error.message : "Error de autenticación"
      });
    }
  }

  // Endpoint para logout
  async logout(event: any): Promise<any> {
    try {
      const token = this.extractTokenFromRequest(event);
      if (!token) {
        throw createError({
          statusCode: 401,
          message: "Token no proporcionado"
        });
      }

      await this.authUseCase.logout(token);
      
      return {
        status: "success",
        message: "Logout exitoso"
      };
    } catch (error) {
      console.error('Error en logout:', error);
      throw createError({
        statusCode: 401,
        message: error instanceof Error ? error.message : "Error al cerrar sesión"
      });
    }
  }

  // Endpoint para validar token
  async validarToken(event: any): Promise<any> {
    try {
      const token = this.extractTokenFromRequest(event);
      if (!token) {
        throw createError({
          statusCode: 401,
          message: "Token no proporcionado"
        });
      }

      const usuario = await this.authUseCase.validarToken(token);
      
      if (!usuario) {
        throw createError({
          statusCode: 401,
          message: "Token inválido o expirado"
        });
      }
      
      return {
        status: "success",
        message: "Token válido",
        data: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          nombreCompleto: this.getNombreCompleto(usuario),
          rol: usuario.rol?.nombreRol || 'Sin rol'
        }
      };
    } catch (error) {
      console.error('Error al validar token:', error);
      throw createError({
        statusCode: 401,
        message: error instanceof Error ? error.message : "Error al validar token"
      });
    }
  }

  // Endpoint para refrescar token
  async refrescarToken(event: any): Promise<any> {
    try {
      const token = this.extractTokenFromRequest(event);
      if (!token) {
        throw createError({
          statusCode: 401,
          message: "Token no proporcionado"
        });
      }

      const nuevoToken = await this.authUseCase.refrescarToken(token);
      
      return {
        status: "success",
        message: "Token refrescado exitosamente",
        token: nuevoToken,
        expiresIn: 24 * 60 * 60 // 24 horas en segundos
      };
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw createError({
        statusCode: 401,
        message: error instanceof Error ? error.message : "Error al refrescar token"
      });
    }
  }

  // Endpoint para crear usuario
  async crearUsuario(event: any): Promise<any> {
    try {
      const body = await readBody<CrearUsuarioRequest>(event);
      
      // Validaciones básicas
      this.validarCrearUsuarioRequest(body);

      const usuario = await this.authUseCase.crearUsuario(body);
      
      return {
        status: "success",
        message: "Usuario creado exitosamente",
        data: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          idRol: usuario.idRol,
          activo: usuario.activo
        }
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al crear usuario"
      });
    }
  }

  // Endpoint para actualizar usuario
  async actualizarUsuario(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const body = await readBody<Partial<ActualizarUsuarioRequest>>(event);
      
      const usuario = await this.authUseCase.actualizarUsuario(id, body);
      
      return {
        status: "success",
        message: "Usuario actualizado exitosamente",
        data: usuario
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar usuario"
      });
    }
  }

  // Endpoint para eliminar usuario
  async eliminarUsuario(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      await this.authUseCase.eliminarUsuario(id);
      
      return {
        status: "success",
        message: "Usuario eliminado exitosamente"
      };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al eliminar usuario"
      });
    }
  }

  // Endpoint para listar usuarios
  async listarUsuarios(event: any): Promise<any> {
    try {
      const usuarios = await this.authUseCase.listarUsuarios();
      
      return {
        status: "success",
        message: "Usuarios listados exitosamente",
        data: usuarios
      };
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener usuarios"
      });
    }
  }

  // Endpoint para activar usuario
  async activarUsuario(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const usuario = await this.authUseCase.activarUsuario(id);
      
      return {
        status: "success",
        message: "Usuario activado exitosamente",
        data: usuario
      };
    } catch (error) {
      console.error('Error al activar usuario:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al activar usuario"
      });
    }
  }

  // Endpoint para desactivar usuario
  async desactivarUsuario(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const usuario = await this.authUseCase.desactivarUsuario(id);
      
      return {
        status: "success",
        message: "Usuario desactivado exitosamente",
        data: usuario
      };
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al desactivar usuario"
      });
    }
  }

  // Endpoint para cambiar contraseña
  async cambiarContrasena(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const body = await readBody<CambiarContrasenaRequest>(event);
      
      // Validaciones básicas
      this.validarCambiarContrasenaRequest(body);

      await this.authUseCase.cambiarContrasena(id, body.contrasenaActual, body.nuevaContrasena);
      
      return {
        status: "success",
        message: "Contraseña cambiada exitosamente"
      };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al cambiar contraseña"
      });
    }
  }

  // Endpoint para listar roles
  async listarRoles(event: any): Promise<any> {
    try {
      const roles = await this.authUseCase.listarRoles();
      
      return {
        status: "success",
        message: "Roles listados exitosamente",
        data: roles
      };
    } catch (error) {
      console.error('Error al listar roles:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener roles"
      });
    }
  }

  // Endpoint para listar sesiones activas
  async listarSesionesActivas(event: any): Promise<any> {
    try {
      const idUsuario = parseInt(getRouterParam(event, 'idUsuario') || '0');
      if (idUsuario === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const sesiones = await this.authUseCase.listarSesionesActivas(idUsuario);
      
      return {
        status: "success",
        message: "Sesiones activas listadas exitosamente",
        data: sesiones
      };
    } catch (error) {
      console.error('Error al listar sesiones activas:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener sesiones activas"
      });
    }
  }

  // Métodos privados de ayuda
  private extractTokenFromRequest(event: any): string | null {
    // Intentar obtener del header Authorization
    const authHeader = getHeader(event, 'authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Intentar obtener del cookie
    const token = getCookie(event, 'auth-token');
    if (token) {
      return token;
    }

    // Intentar obtener del query parameter
    const queryToken = getQuery(event, 'token');
    if (queryToken) {
      return queryToken as string;
    }

    return null;
  }

  private getNombreCompleto(usuario: any): string {
    if (!usuario.persona) {
      return usuario.nombreUsuario;
    }
    return `${usuario.persona.nombres} ${usuario.persona.apellidoPaterno} ${usuario.persona.apellidoMaterno}`.trim();
  }

  // Métodos de validación
  private validarLoginRequest(data: LoginRequest): void {
    if (!data.nombreUsuario?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (!data.contrasena?.trim()) {
      throw new Error('La contraseña es requerida');
    }
  }

  private validarCrearUsuarioRequest(data: CrearUsuarioRequest): void {
    if (!data.idPersona || data.idPersona <= 0) {
      throw new Error('El ID de persona es requerido');
    }
    if (!data.nombreUsuario?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (!data.contrasena?.trim()) {
      throw new Error('La contraseña es requerida');
    }
    if (data.contrasena.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (!data.idRol || data.idRol <= 0) {
      throw new Error('El ID de rol es requerido');
    }
  }

  private validarCambiarContrasenaRequest(data: CambiarContrasenaRequest): void {
    if (!data.contrasenaActual?.trim()) {
      throw new Error('La contraseña actual es requerida');
    }
    if (!data.nuevaContrasena?.trim()) {
      throw new Error('La nueva contraseña es requerida');
    }
    if (data.nuevaContrasena.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }
  }
}
