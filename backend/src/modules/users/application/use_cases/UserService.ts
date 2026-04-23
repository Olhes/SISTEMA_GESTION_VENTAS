/**
 * Implementación del Caso de Uso de Usuarios
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  IUserUseCase, 
  CrearUsuarioRequest, 
  ActualizarUsuarioRequest,
  LoginRequest,
  LoginResponse,
  CambiarContrasenaRequest,
  ResetearContrasenaRequest,
  UserEstadisticas
} from '../../domain/ports/driving/IUserUseCase';
import type { IUserRepo, CreateUsuarioData } from '../../domain/ports/driven/IUserRepo';
import type { 
  Usuario,
  UsuarioConDetalles,
  EstadoUsuario,
  CrearUsuarioData as DominioCrearUsuarioData,
  ActualizarUsuarioData as DominioActualizarUsuarioData,
  CambiarContrasenaData as DominioCambiarContrasenaData,
  ResetearContrasenaData as DominioResetearContrasenaData
} from '../../domain/entities/User';
import { UserAggregate } from '../../domain/entities/User';

export class UserService implements IUserUseCase {
  constructor(private readonly userRepo: IUserRepo) {}

  async listarUsuarios(): Promise<Usuario[]> {
    return await this.userRepo.findAll();
  }

  async crearUsuario(usuarioData: CrearUsuarioRequest): Promise<Usuario> {
    // Validaciones de negocio
    const nombreUsuarioDisponible = await this.userRepo.nombreUsuarioDisponible(usuarioData.nombreUsuario);
    if (!nombreUsuarioDisponible) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    const personaValida = await this.userRepo.personaValida(usuarioData.idPersona);
    if (!personaValida) {
      throw new Error('La persona especificada no es válida');
    }

    const rolValido = await this.userRepo.rolValido(usuarioData.idRol);
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
    const usuario = UserAggregate.crearUsuario(dominioData);

    // Guardar a través del repositorio
    return await this.userRepo.save(usuario);
  }

  async actualizarUsuario(id: number, usuarioData: Partial<ActualizarUsuarioRequest>): Promise<Usuario> {
    const existingUsuario = await this.userRepo.findById(id);
    if (!existingUsuario) {
      throw new Error('Usuario no encontrado');
    }

    // Validar nombre único si se está cambiando
    if (usuarioData.nombreUsuario && usuarioData.nombreUsuario !== existingUsuario.nombreUsuario) {
      const nombreDisponible = await this.userRepo.nombreUsuarioDisponible(usuarioData.nombreUsuario, id);
      if (!nombreDisponible) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    // Validar rol si se está cambiando
    if (usuarioData.idRol) {
      const rolValido = await this.userRepo.rolValido(usuarioData.idRol);
      if (!rolValido) {
        throw new Error('El rol especificado no es válido');
      }
    }

    const dominioData: Partial<DominioActualizarUsuarioData> = {
      nombreUsuario: usuarioData.nombreUsuario,
      contrasena: usuarioData.contrasena,
      idRol: usuarioData.idRol
    };

    const usuarioActualizado = UserAggregate.actualizarUsuario(existingUsuario, dominioData);
    return await this.userRepo.update(id, usuarioActualizado);
  }

  async eliminarUsuario(id: number): Promise<void> {
    const existingUsuario = await this.userRepo.findById(id);
    if (!existingUsuario) {
      throw new Error('Usuario no encontrado');
    }

    if (!UserAggregate.puedeSerEliminado(existingUsuario)) {
      throw new Error('El usuario no puede ser eliminado debido a dependencias activas');
    }

    await this.userRepo.delete(id);
  }

  async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
    return await this.userRepo.findById(id);
  }

  async login(credenciales: LoginRequest): Promise<LoginResponse> {
    // Validar credenciales
    const usuario = await this.userRepo.findByNombreUsuarioWithDetails(credenciales.nombreUsuario);
    if (!usuario) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Validar contraseña (en producción se usaría hash)
    if (!UserAggregate.validarCredenciales(usuario, credenciales.nombreUsuario, credenciales.contrasena)) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    if (!UserAggregate.puedeIniciarSesion(usuario)) {
      throw new Error('Usuario inactivo o suspendido');
    }

    // Actualizar último login
    await this.actualizarUltimoLogin(usuario.id);

    // Generar token (en producción se usaría JWT)
    const token = this.generarToken(usuario);

    return {
      status: "success",
      message: "Login exitoso",
      user: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        nombreCompleto: this.getNombreCompleto(usuario),
        rol: usuario.rol?.nombreRol || 'Sin rol',
        estado: usuario.estado
      },
      token,
      expiresIn: 24 * 60 * 60 // 24 horas en segundos
    };
  }

  async cambiarContrasena(id: number, data: CambiarContrasenaRequest): Promise<void> {
    const usuario = await this.userRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const dominioData: DominioCambiarContrasenaData = {
      contrasenaActual: data.contrasenaActual,
      nuevaContrasena: data.nuevaContrasena
    };

    const usuarioActualizado = UserAggregate.cambiarContrasena(usuario, dominioData.contrasenaActual, dominioData.nuevaContrasena);
    await this.userRepo.update(id, { contrasena: usuarioActualizado.contrasena });
  }

  async resetearContrasena(id: number, data: ResetearContrasenaRequest): Promise<void> {
    const usuario = await this.userRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const dominioData: DominioResetearContrasenaData = {
      nuevaContrasena: data.nuevaContrasena
    };

    const usuarioActualizado = UserAggregate.resetearContrasena(usuario, dominioData.nuevaContrasena);
    await this.userRepo.update(id, { contrasena: usuarioActualizado.contrasena });
  }

  async actualizarUltimoLogin(id: number): Promise<void> {
    const usuario = await this.userRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioActualizado = UserAggregate.actualizarUltimoLogin(usuario);
    await this.userRepo.update(id, { ultimoLogin: usuarioActualizado.ultimoLogin });
  }

  async activarUsuario(id: number): Promise<Usuario> {
    const usuario = await this.userRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioActivado = UserAggregate.activarUsuario(usuario);
    return await this.userRepo.update(id, { 
      estado: usuarioActivado.estado,
      fechaModificacion: usuarioActivado.fechaModificacion
    });
  }

  async desactivarUsuario(id: number): Promise<Usuario> {
    const usuario = await this.userRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioDesactivado = UserAggregate.desactivarUsuario(usuario);
    return await this.userRepo.update(id, { 
      estado: usuarioDesactivado.estado,
      fechaModificacion: usuarioDesactivado.fechaModificacion
    });
  }

  async suspenderUsuario(id: number, motivo?: string): Promise<Usuario> {
    const usuario = await this.userRepo.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioSuspendido = UserAggregate.suspenderUsuario(usuario, motivo);
    return await this.userRepo.update(id, { 
      estado: usuarioSuspendido.estado,
      fechaModificacion: usuarioSuspendido.fechaModificacion
    });
  }

  async listarUsuariosConDetalles(): Promise<UsuarioConDetalles[]> {
    return await this.userRepo.findAllWithDetails();
  }

  async listarUsuariosPorEstado(estado: EstadoUsuario): Promise<Usuario[]> {
    return await this.userRepo.findByEstado(estado);
  }

  async listarUsuariosPorRol(idRol: number): Promise<UsuarioConDetalles[]> {
    return await this.userRepo.findByRol(idRol);
  }

  async obtenerUsuarioPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    return await this.userRepo.findByNombreUsuario(nombreUsuario);
  }

  async obtenerUsuarioPorNombreUsuarioConDetalles(nombreUsuario: string): Promise<UsuarioConDetalles | null> {
    return await this.userRepo.findByNombreUsuarioWithDetails(nombreUsuario);
  }

  async buscarUsuarios(termino: string): Promise<UsuarioConDetalles[]> {
    return await this.userRepo.searchByTerm(termino);
  }

  async listarUsuariosInactivos(diasLimite: number = 30): Promise<UsuarioConDetalles[]> {
    return await this.userRepo.findInactive(diasLimite);
  }

  async obtenerEstadisticas(): Promise<UserEstadisticas> {
    const [
      totalUsuarios,
      usuariosPorEstado,
      usuariosPorRol,
      usuariosInactivos,
      ultimoRegistro,
      promedioInactividad
    ] = await Promise.all([
      this.userRepo.getTotalCount(),
      this.userRepo.getCountByEstado(),
      this.userRepo.getCountByRol(),
      this.userRepo.getInactiveCount(30),
      this.userRepo.getLastRegistered(),
      this.userRepo.getAverageInactivityDays()
    ]);

    return {
      totalUsuarios,
      usuariosActivos: usuariosPorEstado['Activo'] || 0,
      usuariosInactivos: usuariosPorEstado['Inactivo'] || 0,
      usuariosSuspendidos: usuariosPorEstado['Suspendido'] || 0,
      usuariosPorRol: this.convertirRolesANombres(usuariosPorRol),
      usuariosInactivosPorDias: usuariosInactivos,
      ultimoRegistro: ultimoRegistro.toISOString(),
      promedioInactividad
    };
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

  private convertirRolesANombres(usuariosPorRol: Record<number, number>): Record<string, number> {
    // En un sistema real, se obtendrían los nombres de los roles desde la BD
    const nombresRol: Record<number, string> = {
      1: 'Administrador',
      2: 'Asesor'
    };

    const resultado: Record<string, number> = {};
    Object.entries(usuariosPorRol).forEach(([idRol, cantidad]) => {
      const nombreRol = nombresRol[parseInt(idRol)] || `Rol ${idRol}`;
      resultado[nombreRol] = cantidad;
    });

    return resultado;
  }
}
