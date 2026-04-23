/**
 * Implementación del Caso de Uso de Autenticación
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  IAuthUseCase, 
  LoginRequest, 
  LoginResponse,
  CrearUsuarioRequest,
  ActualizarUsuarioRequest,
  CambiarContrasenaRequest
} from '../../domain/ports/driving/IAuthUseCase';
import type { IAuthRepo, CreateUsuarioData, CreateSesionData } from '../../domain/ports/driven/IAuthRepo';
import type { 
  Usuario,
  UsuarioConDetalles,
  Sesion,
  Rol,
  Credenciales,
  CrearUsuarioData as DominioCrearUsuarioData,
  ActualizarUsuarioData as DominioActualizarUsuarioData
} from '../../domain/entities/Auth';
import { AuthAggregate } from '../../domain/entities/Auth';

export class AuthService implements IAuthUseCase {
  constructor(private readonly authRepo: IAuthRepo) {}

  async login(credenciales: LoginRequest): Promise<LoginResponse> {
    // Validar credenciales
    const usuario = await this.authRepo.findByNombreUsuarioWithDetails(credenciales.nombreUsuario);
    if (!usuario) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Validar contraseña (en un sistema real se usaría hash)
    const credencialesValidas: Credenciales = {
      nombreUsuario: credenciales.nombreUsuario.toLowerCase(),
      contrasena: credenciales.contrasena // En producción, esto debería ser un hash
    };

    if (!AuthAggregate.validarCredenciales(usuario, credencialesValidas)) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    if (!AuthAggregate.puedeIniciarSesion(usuario)) {
      throw new Error('Usuario inactivo');
    }

    // Actualizar último login
    const usuarioActualizado = AuthAggregate.actualizarUltimoLogin(usuario);
    await this.authRepo.update(usuario.id, { ultimoLogin: usuarioActualizado.ultimoLogin });

    // Crear sesión
    const token = this.generarToken(usuario);
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 24); // 24 horas

    const sesionData: CreateSesionData = {
      id_usuario: usuario.id,
      token,
      fecha_creacion: new Date().toISOString(),
      fecha_expiracion: fechaExpiracion.toISOString(),
      activa: true
    };

    await this.authRepo.crearSesion({
      idUsuario: sesionData.id_usuario,
      token: sesionData.token,
      fechaExpiracion: new Date(sesionData.fecha_expiracion),
      activa: sesionData.activa
    });

    return {
      status: "success",
      message: "Login exitoso",
      user: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        nombreCompleto: this.getNombreCompleto(usuario),
        rol: usuario.rol?.nombreRol || 'Sin rol'
      },
      token,
      expiresIn: 24 * 60 * 60 // 24 horas en segundos
    };
  }

  async logout(token: string): Promise<void> {
    const sesion = await this.authRepo.findByToken(token);
    if (!sesion) {
      throw new Error('Sesión no encontrada');
    }

    const sesionCerrada = AuthAggregate.cerrarSesion(sesion);
    await this.authRepo.updateSesion(sesion.id, { activa: sesionCerrada.activa });
  }

  async validarToken(token: string): Promise<UsuarioConDetalles | null> {
    const sesion = await this.authRepo.findByToken(token);
    if (!sesion) {
      return null;
    }

    if (!AuthAggregate.estaSesionValida(sesion)) {
      await this.authRepo.updateSesion(sesion.id, { activa: false });
      return null;
    }

    return await this.authRepo.findByIdWithDetails(sesion.idUsuario);
  }

  async refrescarToken(token: string): Promise<string> {
    const usuario = await this.validarToken(token);
    if (!usuario) {
      throw new Error('Token inválido');
    }

    // Cerrar sesión actual
    await this.logout(token);

    // Crear nuevo token
    const nuevoToken = this.generarToken(usuario);
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 24);

    const sesionData: CreateSesionData = {
      id_usuario: usuario.id,
      token: nuevoToken,
      fecha_creacion: new Date().toISOString(),
      fecha_expiracion: fechaExpiracion.toISOString(),
      activa: true
    };

    await this.authRepo.crearSesion({
      idUsuario: sesionData.id_usuario,
      token: sesionData.token,
      fechaExpiracion: new Date(sesionData.fecha_expiracion),
      activa: sesionData.activa
    });
    return nuevoToken;
  }

  async crearUsuario(usuarioData: CrearUsuarioRequest): Promise<Usuario> {
    // Validaciones de negocio
    const nombreUsuarioDisponible = await this.authRepo.nombreUsuarioDisponible(usuarioData.nombreUsuario);
    if (!nombreUsuarioDisponible) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    const personaValida = await this.authRepo.personaValida(usuarioData.idPersona);
    if (!personaValida) {
      throw new Error('La persona especificada no es válida');
    }

    const rolValido = await this.authRepo.rolValido(usuarioData.idRol);
    if (!rolValido) {
      throw new Error('El rol especificado no es válido');
    }

    // Transformar datos para el dominio
    const dominioData: DominioCrearUsuarioData = {
      idPersona: usuarioData.idPersona,
      nombreUsuario: usuarioData.nombreUsuario,
      contrasena: usuarioData.contrasena, // En producción, esto debería ser un hash
      idRol: usuarioData.idRol
    };

    // Usar el Aggregate Root para crear el usuario
    const usuario = AuthAggregate.crearUsuario(dominioData);

    // Guardar a través del repositorio
    const createData: CreateUsuarioData = {
      id_persona: usuario.idPersona,
      nombre_usuario: usuario.nombreUsuario,
      contrasena: usuario.contrasena,
      id_rol: usuario.idRol,
      fecha_creacion: usuario.fechaCreacion.toISOString(),
      ultimo_login: usuario.ultimoLogin?.toISOString(),
      activo: usuario.activo
    };

    return await this.authRepo.save(usuario);
  }

  async actualizarUsuario(id: number, usuarioData: Partial<ActualizarUsuarioRequest>): Promise<Usuario> {
    const existingUsuario = await this.authRepo.findById(id);
    if (!existingUsuario) {
      throw new Error('Usuario no encontrado');
    }

    // Validar nombre único si se está cambiando
    if (usuarioData.nombreUsuario && usuarioData.nombreUsuario !== existingUsuario.nombreUsuario) {
      const nombreDisponible = await this.authRepo.nombreUsuarioDisponible(usuarioData.nombreUsuario);
      if (!nombreDisponible) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    // Validar rol si se está cambiando
    if (usuarioData.idRol) {
      const rolValido = await this.authRepo.rolValido(usuarioData.idRol);
      if (!rolValido) {
        throw new Error('El rol especificado no es válido');
      }
    }

    return await this.authRepo.update(id, usuarioData);
  }

  async eliminarUsuario(id: number): Promise<void> {
    const existingUsuario = await this.authRepo.findById(id);
    if (!existingUsuario) {
      throw new Error('Usuario no encontrado');
    }

    // Cerrar todas las sesiones activas
    await this.authRepo.deleteSesionesByUsuario(id);

    await this.authRepo.delete(id);
  }

  async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
    return await this.authRepo.findById(id);
  }

  async obtenerUsuarioPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    return await this.authRepo.findByNombreUsuario(nombreUsuario);
  }

  async listarUsuarios(): Promise<UsuarioConDetalles[]> {
    return await this.authRepo.findAll();
  }

  async activarUsuario(id: number): Promise<Usuario> {
    const usuario = await this.authRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioActivado = AuthAggregate.activarUsuario(usuario);
    return await this.authRepo.update(id, { activo: usuarioActivado.activo });
  }

  async desactivarUsuario(id: number): Promise<Usuario> {
    const usuario = await this.authRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Cerrar todas las sesiones activas
    await this.authRepo.deleteSesionesByUsuario(id);

    const usuarioDesactivado = AuthAggregate.desactivarUsuario(usuario);
    return await this.authRepo.update(id, { activo: usuarioDesactivado.activo });
  }

  async cambiarContrasena(id: number, contrasenaActual: string, nuevaContrasena: string): Promise<void> {
    const usuario = await this.authRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Validar contraseña actual (en producción se usaría hash)
    if (usuario.contrasena !== contrasenaActual) {
      throw new Error('Contraseña actual incorrecta');
    }

    const usuarioActualizado = AuthAggregate.cambiarContrasena(usuario, nuevaContrasena);
    await this.authRepo.update(id, { contrasena: usuarioActualizado.contrasena });
  }

  async listarRoles(): Promise<Rol[]> {
    return await this.authRepo.findAllRoles();
  }

  async obtenerRolPorId(id: number): Promise<Rol | null> {
    return await this.authRepo.findRolById(id);
  }

  async listarSesionesActivas(idUsuario: number): Promise<Sesion[]> {
    return await this.authRepo.findSesionesActivasByUsuario(idUsuario);
  }

  async cerrarTodasLasSesiones(idUsuario: number): Promise<void> {
    await this.authRepo.deleteSesionesByUsuario(idUsuario);
  }

  // Métodos privados de ayuda
  private generarToken(usuario: UsuarioConDetalles): string {
    // En producción, se usaría JWT u otro sistema de tokens seguro
    const payload = {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol?.nombreRol,
      timestamp: Date.now()
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private getNombreCompleto(usuario: UsuarioConDetalles): string {
    if (!usuario.persona) {
      return usuario.nombreUsuario;
    }
    return `${usuario.persona.nombres} ${usuario.persona.apellidoPaterno} ${usuario.persona.apellidoMaterno}`.trim();
  }
}
