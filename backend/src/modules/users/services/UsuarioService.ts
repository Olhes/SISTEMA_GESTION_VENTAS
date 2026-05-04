import type { 
  Usuario, 
  SesionUsuario, 
  AuditoriaLogin, 
  CambioContraseña, 
  RestablecimientoContraseña, 
  HistorialAcceso, 
  PermisoEspecial 
} from '../domain/entities/User2.js';
import { UsuarioRepository } from '../infrastructure/UsuarioRepository.js';

// DTOs para operaciones del dominio
export interface CrearUsuarioData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correoElectronico: string;
  telefonoPrincipal: string;
  telefonoSecundario?: string | null;
  tipoUsuario: "Administrador" | "Asesor";
  nombreUsuario: string;
  contrasenaHash: string;
  metodoAutenticacion?: "Usuario_Contraseña" | "Google" | "Microsoft";
  idExternoGoogle?: string | null;
  idExternoMicrosoft?: string | null;
  dosfactorHabilitado?: boolean;
  idUsuarioCreador: number;
}

export interface ActualizarUsuarioData {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  correoElectronico?: string;
  telefonoPrincipal?: string;
  telefonoSecundario?: string | null;
  tipoUsuario?: "Administrador" | "Asesor";
  nombreUsuario?: string;
  contrasenaHash?: string;
  metodoAutenticacion?: "Usuario_Contraseña" | "Google" | "Microsoft";
  idExternoGoogle?: string | null;
  idExternoMicrosoft?: string | null;
  estadoUsuario?: "Activo" | "Inactivo" | "Bloqueado";
  activo?: boolean;
  dosfactorHabilitado?: boolean;
}

export interface CambiarContrasenaData {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface CrearSesionData {
  idUsuario: number;
  token: string;
  tokenRefresh?: string | null;
  dispositivo: string;
  direccionIP: string;
  userAgent?: string | null;
  fechaExpiracion: Date;
}

export interface RegistrarLoginData {
  idUsuario: number;
  nombreUsuario: string;
  exitoso: boolean;
  razonFallo?: string | null;
  direccionIP: string;
  dispositivo: string;
  userAgent?: string | null;
}

export interface SolicitarRestablecimientoData {
  idUsuario: number;
  token: string;
  tokenHash: string;
  fechaExpiracion: Date;
  direccionIP: string;
}

export interface RegistrarAccesoData {
  idUsuario: number;
  modulo: string;
  accion: string;
  descripcion: string;
  idRecurso?: number | null;
  tipoRecurso?: string | null;
  datosAntes?: string | null;
  datosDespues?: string | null;
  direccionIP: string;
  sesionId?: number | null;
}

export interface CrearPermisoEspecialData {
  idUsuario: number;
  modulo: string;
  accion: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  idUsuarioOtorgador: number;
  razonOtorgamiento: string;
}

/**
 * Service layer for Usuario operations
 */
export class UsuarioService {
  
  // ========================================
  // USUARIO OPERATIONS
  // ========================================

  /**
   * Create a new user
   */
  static async createUsuario(userData: CrearUsuarioData): Promise<Usuario> {
    // Check if username, email or document already exists
    const existingUser = await UsuarioRepository.findByUsernameOrEmail(userData.nombreUsuario);
    if (existingUser) {
      if (existingUser.nombreUsuario === userData.nombreUsuario.toLowerCase()) {
        throw new Error('Username already exists');
      }
      if (existingUser.correoElectronico === userData.correoElectronico.toLowerCase()) {
        throw new Error('Email already exists');
      }
    }

    const documentExists = await UsuarioRepository.documentExists(userData.numeroDocumento);
    if (documentExists) {
      throw new Error('Document number already exists');
    }

    // Create user
    return await UsuarioRepository.create(userData);
  }

  /**
   * Get user by ID
   */
  static async getUsuarioById(id: number): Promise<Usuario | null> {
    return await UsuarioRepository.findById(id);
  }

  /**
   * Get user by username
   */
  static async getUsuarioByUsername(nombreUsuario: string): Promise<Usuario | null> {
    return await UsuarioRepository.findByUsername(nombreUsuario);
  }

  /**
   * Get user by email
   */
  static async getUsuarioByEmail(correoElectronico: string): Promise<Usuario | null> {
    return await UsuarioRepository.findByEmail(correoElectronico);
  }

  /**
   * Get all users
   */
  static async getAllUsuarios(): Promise<Usuario[]> {
    return await UsuarioRepository.findAll();
  }

  /**
   * Update user
   */
  static async updateUsuario(id: number, updateData: ActualizarUsuarioData): Promise<Usuario | null> {
    const existingUser = await UsuarioRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if updating username/email/document and if they already exist
    if (updateData.nombreUsuario || updateData.correoElectronico || updateData.numeroDocumento) {
      const checkUsername = updateData.nombreUsuario?.toLowerCase();
      const checkEmail = updateData.correoElectronico?.toLowerCase();
      const checkDocument = updateData.numeroDocumento;
      
      if (checkUsername && checkUsername !== existingUser.nombreUsuario) {
        const usernameExists = await UsuarioRepository.usernameExists(checkUsername);
        if (usernameExists) {
          throw new Error('Username already exists');
        }
      }
      
      if (checkEmail && checkEmail !== existingUser.correoElectronico) {
        const emailExists = await UsuarioRepository.emailExists(checkEmail);
        if (emailExists) {
          throw new Error('Email already exists');
        }
      }
      
      if (checkDocument && checkDocument !== existingUser.numeroDocumento) {
        const documentExists = await UsuarioRepository.documentExists(checkDocument);
        if (documentExists) {
          throw new Error('Document number already exists');
        }
      }
    }

    return await UsuarioRepository.update(id, updateData);
  }

  /**
   * Activate user
   */
  static async activateUsuario(id: number): Promise<Usuario | null> {
    const user = await UsuarioRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.estadoUsuario === 'Activo') {
      throw new Error('User is already active');
    }

    return await UsuarioRepository.updateStatus(id, 'Activo');
  }

  /**
   * Deactivate user
   */
  static async deactivateUsuario(id: number): Promise<Usuario | null> {
    const user = await UsuarioRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.estadoUsuario === 'Inactivo') {
      throw new Error('User is already inactive');
    }

    return await UsuarioRepository.updateStatus(id, 'Inactivo');
  }

  /**
   * Block user
   */
  static async blockUsuario(id: number, blockedUntil: Date): Promise<Usuario | null> {
    const user = await UsuarioRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await UsuarioRepository.blockUser(id, blockedUntil);
    return await UsuarioRepository.findById(id);
  }

  /**
   * Delete user
   */
  static async deleteUsuario(id: number): Promise<boolean> {
    const user = await UsuarioRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await UsuarioRepository.delete(id);
  }

  /**
   * Search users
   */
  static async searchUsuarios(query: string, limit: number = 50): Promise<Usuario[]> {
    return await UsuarioRepository.search(query, limit);
  }

  /**
   * Get users by status
   */
  static async getUsuariosByStatus(estadoUsuario: string): Promise<Usuario[]> {
    return await UsuarioRepository.findByStatus(estadoUsuario);
  }

  /**
   * Get user statistics
   */
  static async getUsuarioStatistics(): Promise<{ total: number; activos: number; inactivos: number; bloqueados: number }> {
    const statusCounts = await UsuarioRepository.getCountByStatus();
    
    const stats = {
      total: 0,
      activos: 0,
      inactivos: 0,
      bloqueados: 0
    };

    statusCounts.forEach(count => {
      stats.total += count.count;
      if (count.estadoUsuario === 'Activo') stats.activos = count.count;
      if (count.estadoUsuario === 'Inactivo') stats.inactivos = count.count;
      if (count.estadoUsuario === 'Bloqueado') stats.bloqueados = count.count;
    });

    return stats;
  }

  // ========================================
  // AUTHENTICATION OPERATIONS
  // ========================================

  /**
   * Authenticate user
   */
  static async authenticateUsuario(nombreUsuario: string, contrasena: string, direccionIP: string, dispositivo: string, userAgent?: string): Promise<Usuario | null> {
    const user = await UsuarioRepository.findByUsername(nombreUsuario);
    if (!user) {
      // Register failed login attempt
      await this.registrarLogin({
        idUsuario: 0,
        nombreUsuario,
        exitoso: false,
        razonFallo: 'Usuario no existe',
        direccionIP,
        dispositivo,
        userAgent
      });
      return null;
    }

    // Check if user is blocked
    if (user.estadoUsuario === 'Bloqueado' || (user.bloqueadoHasta && user.bloqueadoHasta > new Date())) {
      await this.registrarLogin({
        idUsuario: user.id,
        nombreUsuario,
        exitoso: false,
        razonFallo: 'Usuario bloqueado',
        direccionIP,
        dispositivo,
        userAgent
      });
      return null;
    }

    // Check if user is inactive
    if (!user.activo || user.estadoUsuario === 'Inactivo') {
      await this.registrarLogin({
        idUsuario: user.id,
        nombreUsuario,
        exitoso: false,
        razonFallo: 'Usuario inactivo',
        direccionIP,
        dispositivo,
        userAgent
      });
      return null;
    }

    // Validate password (in real app, use bcrypt)
    const isValidPassword = user.contrasenaHash === contrasena;
    
    if (!isValidPassword) {
      // Increment failed attempts
      await UsuarioRepository.incrementFailedAttempts(user.id);
      
      // Check if should block user
      const updatedUser = await UsuarioRepository.findById(user.id);
      if (updatedUser && updatedUser.intentosFallidos >= 5) {
        const blockedUntil = new Date();
        blockedUntil.setHours(blockedUntil.getHours() + 1); // Block for 1 hour
        await UsuarioRepository.blockUser(user.id, blockedUntil);
      }

      await this.registrarLogin({
        idUsuario: user.id,
        nombreUsuario,
        exitoso: false,
        razonFallo: 'Contraseña incorrecta',
        direccionIP,
        dispositivo,
        userAgent
      });
      
      return null;
    }

    // Reset failed attempts and update last login
    await UsuarioRepository.resetFailedAttempts(user.id);
    await UsuarioRepository.updateLastLogin(user.id);

    // Register successful login
    await this.registrarLogin({
      idUsuario: user.id,
      nombreUsuario,
      exitoso: true,
      direccionIP,
      dispositivo,
      userAgent
    });

    return await UsuarioRepository.findById(user.id);
  }

  /**
   * Change password
   */
  static async cambiarContrasena(id: number, contrasenaActual: string, nuevaContrasena: string, direccionIP: string, idUsuarioModificador?: number): Promise<Usuario | null> {
    const user = await UsuarioRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate current password
    const isValidPassword = user.contrasenaHash === contrasenaActual;
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Create password change record
    await UsuarioRepository.createPasswordChange({
      idUsuario: id,
      contrasenaAntigua: user.contrasenaHash,
      contrasenaNew: nuevaContrasena,
      razonCambio: 'Manual',
      direccionIP,
      idUsuarioModificador
    });

    // Update password
    return await UsuarioRepository.update(id, { contrasenaHash: nuevaContrasena });
  }

  /**
   * Request password reset
   */
  static async solicitarRestablecimientoContrasena(correoElectronico: string, token: string, tokenHash: string, direccionIP: string): Promise<RestablecimientoContraseña | null> {
    const user = await UsuarioRepository.findByEmail(correoElectronico);
    if (!user) {
      throw new Error('User not found');
    }

    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 1); // Expire in 1 hour

    return await UsuarioRepository.createPasswordReset({
      idUsuario: user.id,
      token,
      tokenHash,
      fechaExpiracion,
      direccionIP
    });
  }

  /**
   * Reset password using token
   */
  static async restablecerContrasena(token: string, nuevaContrasena: string, direccionIP: string): Promise<Usuario | null> {
    const reset = await UsuarioRepository.findPasswordResetByToken(token);
    if (!reset) {
      throw new Error('Invalid reset token');
    }

    if (reset.utilizado) {
      throw new Error('Reset token already used');
    }

    if (reset.fechaExpiracion < new Date()) {
      throw new Error('Reset token expired');
    }

    // Mark token as used
    await UsuarioRepository.markPasswordResetAsUsed(reset.id);

    // Create password change record
    await UsuarioRepository.createPasswordChange({
      idUsuario: reset.idUsuario,
      contrasenaAntigua: '', // We don't have the old password hash
      contrasenaNew: nuevaContrasena,
      razonCambio: 'Recuperación',
      direccionIP
    });

    // Update password
    return await UsuarioRepository.update(reset.idUsuario, { contrasenaHash: nuevaContrasena });
  }

  // ========================================
  // SESSION OPERATIONS
  // ========================================

  /**
   * Create user session
   */
  static async crearSesion(sessionData: CrearSesionData): Promise<SesionUsuario> {
    return await UsuarioRepository.createSession(sessionData);
  }

  /**
   * Get session by token
   */
  static async getSesionByToken(token: string): Promise<SesionUsuario | null> {
    const session = await UsuarioRepository.findSessionByToken(token);
    
    if (session && session.fechaExpiracion < new Date()) {
      // Session expired, close it
      await UsuarioRepository.closeSession(session.id);
      return null;
    }

    return session;
  }

  /**
   * Get active sessions for user
   */
  static async getSesionesActivas(idUsuario: number): Promise<SesionUsuario[]> {
    return await UsuarioRepository.getActiveSessionsForUser(idUsuario);
  }

  /**
   * Close session
   */
  static async cerrarSesion(id: number): Promise<void> {
    await UsuarioRepository.closeSession(id);
  }

  /**
   * Close all sessions for user
   */
  static async cerrarTodasSesiones(idUsuario: number): Promise<void> {
    await UsuarioRepository.closeAllSessionsForUser(idUsuario);
  }

  /**
   * Update session activity
   */
  static async actualizarActividadSesion(id: number): Promise<void> {
    await UsuarioRepository.updateSessionActivity(id);
    await UsuarioRepository.updateLastActivity(id);
  }

  // ========================================
  // AUDIT OPERATIONS
  // ========================================

  /**
   * Register login attempt
   */
  static async registrarLogin(loginData: RegistrarLoginData): Promise<AuditoriaLogin> {
    return await UsuarioRepository.createLoginAudit(loginData);
  }

  /**
   * Get recent login attempts for user
   */
  static async getIntentosRecientes(idUsuario: number, limit: number = 10): Promise<AuditoriaLogin[]> {
    return await UsuarioRepository.getRecentLoginAttempts(idUsuario, limit);
  }

  /**
   * Register access/activity
   */
  static async registrarAcceso(accessData: RegistrarAccesoData): Promise<HistorialAcceso> {
    return await UsuarioRepository.createAccessHistory(accessData);
  }

  /**
   * Get access history for user
   */
  static async getHistorialAcceso(idUsuario: number, limit: number = 50): Promise<HistorialAcceso[]> {
    return await UsuarioRepository.getAccessHistoryForUser(idUsuario, limit);
  }

  // ========================================
  // SPECIAL PERMISSIONS OPERATIONS
  // ========================================

  /**
   * Create special permission
   */
  static async crearPermisoEspecial(permissionData: CrearPermisoEspecialData): Promise<PermisoEspecial> {
    return await UsuarioRepository.createSpecialPermission(permissionData);
  }

  /**
   * Get active special permissions for user
   */
  static async getPermisosEspecialesActivos(idUsuario: number): Promise<PermisoEspecial[]> {
    return await UsuarioRepository.getActiveSpecialPermissionsForUser(idUsuario);
  }

  /**
   * Check if user has special permission for module/action
   */
  static async tienePermisoEspecial(idUsuario: number, modulo: string, accion: string): Promise<boolean> {
    const permissions = await this.getPermisosEspecialesActivos(idUsuario);
    return permissions.some(p => p.modulo === modulo && p.accion === accion);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Check if user can perform action based on role and special permissions
   */
  static async puedeRealizarAccion(idUsuario: number, modulo: string, accion: string): Promise<boolean> {
    const user = await UsuarioRepository.findById(idUsuario);
    if (!user || !user.activo || user.estadoUsuario !== 'Activo') {
      return false;
    }

    // Administrators can do everything
    if (user.tipoUsuario === 'Administrador') {
      return true;
    }

    // Check special permissions
    return await this.tienePermisoEspecial(idUsuario, modulo, accion);
  }

  /**
   * Get user full profile with permissions
   */
  static async getPerfilCompleto(id: number): Promise<{
    usuario: Usuario;
    sesionesActivas: SesionUsuario[];
    permisosEspeciales: PermisoEspecial[];
    intentosRecientes: AuditoriaLogin[];
  } | null> {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) {
      return null;
    }

    const [sesionesActivas, permisosEspeciales, intentosRecientes] = await Promise.all([
      this.getSesionesActivas(id),
      this.getPermisosEspecialesActivos(id),
      this.getIntentosRecientes(id, 5)
    ]);

    return {
      usuario,
      sesionesActivas,
      permisosEspeciales,
      intentosRecientes
    };
  }
}
