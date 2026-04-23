/**
 * Adaptador Primario: UserController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { IUserUseCase } from '../../domain/ports/driving/IUserUseCase';
import type { 
  CrearUsuarioRequest, 
  ActualizarUsuarioRequest,
  LoginRequest,
  CambiarContrasenaRequest,
  ResetearContrasenaRequest,
  SuspenderUsuarioRequest,
  BuscarUsuariosRequest
} from '../../domain/ports/driving/IUserUseCase';

export class UserController {
  constructor(private readonly userUseCase: IUserUseCase) {}

  // Endpoint para listar usuarios
  async listarUsuarios(event: any): Promise<any> {
    try {
      const usuarios = await this.userUseCase.listarUsuarios();
      
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

  // Endpoint para crear usuario
  async crearUsuario(event: any): Promise<any> {
    try {
      const body = await readBody<CrearUsuarioRequest>(event);
      
      // Validaciones básicas
      this.validarCrearUsuarioRequest(body);

      const usuario = await this.userUseCase.crearUsuario(body);
      
      return {
        status: "success",
        message: "Usuario creado exitosamente",
        data: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          idRol: usuario.idRol,
          estado: usuario.estado
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
      
      const usuario = await this.userUseCase.actualizarUsuario(id, body);
      
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

      await this.userUseCase.eliminarUsuario(id);
      
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

  // Endpoint para obtener usuario por ID
  async obtenerUsuarioPorId(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const usuario = await this.userUseCase.obtenerUsuarioPorId(id);
      
      if (!usuario) {
        throw createError({
          statusCode: 404,
          message: "Usuario no encontrado"
        });
      }
      
      return {
        status: "success",
        message: "Usuario obtenido exitosamente",
        data: usuario
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al obtener usuario"
      });
    }
  }

  // Endpoint para login
  async login(event: any): Promise<any> {
    try {
      const body = await readBody<LoginRequest>(event);
      
      // Validaciones básicas
      this.validarLoginRequest(body);

      const response = await this.userUseCase.login(body);
      
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw createError({
        statusCode: 401,
        message: error instanceof Error ? error.message : "Error de autenticación"
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

      await this.userUseCase.cambiarContrasena(id, body);
      
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

  // Endpoint para resetear contraseña
  async resetearContrasena(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const body = await readBody<ResetearContrasenaRequest>(event);
      
      // Validaciones básicas
      if (!body.nuevaContrasena?.trim()) {
        throw new Error('La nueva contraseña es requerida');
      }
      if (body.nuevaContrasena.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      await this.userUseCase.resetearContrasena(id, body);
      
      return {
        status: "success",
        message: "Contraseña reseteada exitosamente"
      };
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al resetear contraseña"
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

      const usuario = await this.userUseCase.activarUsuario(id);
      
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

      const usuario = await this.userUseCase.desactivarUsuario(id);
      
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

  // Endpoint para suspender usuario
  async suspenderUsuario(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de usuario inválido"
        });
      }

      const body = await readBody<SuspenderUsuarioRequest>(event);
      
      const usuario = await this.userUseCase.suspenderUsuario(id, body.motivo);
      
      return {
        status: "success",
        message: "Usuario suspendido exitosamente",
        data: usuario
      };
    } catch (error) {
      console.error('Error al suspender usuario:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al suspender usuario"
      });
    }
  }

  // Endpoint para listar usuarios con detalles
  async listarUsuariosConDetalles(event: any): Promise<any> {
    try {
      const usuarios = await this.userUseCase.listarUsuariosConDetalles();
      
      return {
        status: "success",
        message: "Usuarios con detalles listados exitosamente",
        data: usuarios
      };
    } catch (error) {
      console.error('Error al listar usuarios con detalles:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener usuarios con detalles"
      });
    }
  }

  // Endpoint para buscar usuarios
  async buscarUsuarios(event: any): Promise<any> {
    try {
      const termino = getQuery(event, 'termino') as string;
      const limite = getQuery(event, 'limite') ? parseInt(getQuery(event, 'limite') as string) : undefined;
      
      if (!termino) {
        throw createError({
          statusCode: 400,
          message: "El término de búsqueda es requerido"
        });
      }

      const usuarios = await this.userUseCase.buscarUsuarios(termino);
      
      return {
        status: "success",
        message: "Usuarios encontrados exitosamente",
        data: usuarios
      };
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al buscar usuarios"
      });
    }
  }

  // Endpoint para obtener estadísticas
  async obtenerEstadisticas(event: any): Promise<any> {
    try {
      const estadisticas = await this.userUseCase.obtenerEstadisticas();
      
      return {
        status: "success",
        message: "Estadísticas obtenidas exitosamente",
        data: estadisticas
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener estadísticas"
      });
    }
  }

  // Métodos de validación
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

  private validarLoginRequest(data: LoginRequest): void {
    if (!data.nombreUsuario?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (!data.contrasena?.trim()) {
      throw new Error('La contraseña es requerida');
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
