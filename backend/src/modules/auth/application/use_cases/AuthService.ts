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
import type { IAuthRepo, CreateSesionData } from '../../domain/ports/driven/IAuthRepo';
import type { 
  Usuario,
  UsuarioConDetalles,
  Sesion,
  Rol,
  Credenciales,
  CrearUsuarioData as DominioCrearUsuarioData,
} from '../../domain/entities/Auth';
import { AuthAggregate } from '../../domain/entities/Auth';
import { signJWT, verifyJWT } from '../../../../shared/utils/jwt';
import { hash, verify } from '../../../../shared/utils/hash';

const JWT_SECRET = process.env.NUXT_JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 h in seconds

if (process.env.NODE_ENV === 'production' && !process.env.NUXT_JWT_SECRET) {
  throw new Error('[AuthService] NUXT_JWT_SECRET must be set in production');
}

export class AuthService implements IAuthUseCase {
  constructor(private readonly authRepo: IAuthRepo) {}

  async login(credenciales: LoginRequest): Promise<LoginResponse> {
    // Validar credenciales
    const usuario = await this.authRepo.findByNombreUsuarioWithDetails(credenciales.nombreUsuario);
    if (!usuario) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    if (!AuthAggregate.puedeIniciarSesion(usuario)) {
      throw new Error('Usuario inactivo');
    }

    // Verificar contraseña con hash seguro
    if (!verify(credenciales.contrasena, usuario.contrasena)) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Actualizar último login
    const usuarioActualizado = AuthAggregate.actualizarUltimoLogin(usuario);
    await this.authRepo.update(usuario.id, { ultimoLogin: usuarioActualizado.ultimoLogin });

    // Crear JWT
    const token = this.generarToken(usuario);
    const fechaExpiracion = new Date(Date.now() + JWT_EXPIRES_IN * 1000);

    await this.authRepo.crearSesion({
      idUsuario: usuario.id,
      token,
      fechaExpiracion,
      activa: true,
    });

    return {
      status: "success",
      message: "Login exitoso",
      user: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        nombreCompleto: this.getNombreCompleto(usuario),
        rol: usuario.rol?.nombreRol || 'Sin rol',
      },
      token,
      expiresIn: JWT_EXPIRES_IN,
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

    // Crear nuevo JWT
    const nuevoToken = this.generarToken(usuario);
    const fechaExpiracion = new Date(Date.now() + JWT_EXPIRES_IN * 1000);

    await this.authRepo.crearSesion({
      idUsuario: usuario.id,
      token: nuevoToken,
      fechaExpiracion,
      activa: true,
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

    // Hashear contraseña antes de guardar
    const dominioData: DominioCrearUsuarioData = {
      idPersona: usuarioData.idPersona,
      nombreUsuario: usuarioData.nombreUsuario,
      contrasena: hash(usuarioData.contrasena),
      idRol: usuarioData.idRol,
    };

    const usuario = AuthAggregate.crearUsuario(dominioData);
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

    // Verificar contraseña actual con hash seguro
    if (!verify(contrasenaActual, usuario.contrasena)) {
      throw new Error('Contraseña actual incorrecta');
    }

    const usuarioActualizado = AuthAggregate.cambiarContrasena(usuario, nuevaContrasena);
    await this.authRepo.update(id, { contrasena: hash(usuarioActualizado.contrasena) });
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
    return signJWT(
      {
        sub: usuario.id,
        username: usuario.nombreUsuario,
        rol: usuario.rol?.nombreRol ?? 'Sin rol',
      },
      JWT_SECRET,
      JWT_EXPIRES_IN,
    );
  }

  private getNombreCompleto(usuario: UsuarioConDetalles): string {
    if (!usuario.persona) {
      return usuario.nombreUsuario;
    }
    return `${usuario.persona.nombres} ${usuario.persona.apellidoPaterno} ${usuario.persona.apellidoMaterno}`.trim();
  }
}
