import type { 
  Usuario, 
  SesionUsuario, 
  AuditoriaLogin, 
  CambioContraseña, 
  RestablecimientoContraseña, 
  HistorialAcceso, 
  PermisoEspecial 
} from '../domain/entities/User2.js';
import { executeQuery, executeQueryOne, executeModify, transaction } from '../../../database/sqlite.js';

/**
 * SQLite Repository for Usuario entity and related entities
 */
export class UsuarioRepository {
  
  // ========================================
  // USUARIO OPERATIONS
  // ========================================

  /**
   * Create a new user
   */
  static async create(userData: any): Promise<Usuario> {
    const result = await executeModify(
      `INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento, 
                            correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
                            nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
                            id_externo_microsoft, estado_usuario, activo, intentos_fallidos, 
                            dosfactor_habilitado, fecha_creacion, ultima_modificacion, id_usuario_creador) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userData.nombres, userData.apellidoPaterno, userData.apellidoMaterno, userData.tipoDocumento, userData.numeroDocumento,
       userData.correoElectronico, userData.telefonoPrincipal, userData.telefonoSecundario, userData.tipoUsuario,
       userData.nombreUsuario, userData.contrasenaHash, userData.metodoAutenticacion || 'Usuario_Contraseña',
       userData.idExternoGoogle, userData.idExternoMicrosoft, userData.estadoUsuario || 'Activo', true, 0,
       userData.dosfactorHabilitado || false, new Date().toISOString(), new Date().toISOString(), userData.idUsuarioCreador]
    );

    const user = await this.findById(result.lastID!);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<Usuario | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToUsuario(row) : null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(nombreUsuario: string): Promise<Usuario | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios WHERE nombre_usuario = ?`,
      [nombreUsuario]
    );

    return row ? this.mapRowToUsuario(row) : null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(correoElectronico: string): Promise<Usuario | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios WHERE correo_electronico = ?`,
      [correoElectronico]
    );

    return row ? this.mapRowToUsuario(row) : null;
  }

  /**
   * Find user by username or email
   */
  static async findByUsernameOrEmail(usernameOrEmail: string): Promise<Usuario | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios WHERE nombre_usuario = ? OR correo_electronico = ?`,
      [usernameOrEmail, usernameOrEmail]
    );

    return row ? this.mapRowToUsuario(row) : null;
  }

  /**
   * Get all users
   */
  static async findAll(): Promise<Usuario[]> {
    const rows = await executeQuery<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios ORDER BY fecha_creacion DESC`
    );

    return rows.map(row => this.mapRowToUsuario(row));
  }

  /**
   * Get users by status
   */
  static async findByStatus(estadoUsuario: string): Promise<Usuario[]> {
    const rows = await executeQuery<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios WHERE estado_usuario = ? ORDER BY fecha_creacion DESC`,
      [estadoUsuario]
    );

    return rows.map(row => this.mapRowToUsuario(row));
  }

  /**
   * Update user
   */
  static async update(id: number, updateData: any): Promise<Usuario | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updateData.nombres) {
      fields.push('nombres = ?');
      values.push(updateData.nombres);
    }
    if (updateData.apellidoPaterno) {
      fields.push('apellido_paterno = ?');
      values.push(updateData.apellidoPaterno);
    }
    if (updateData.apellidoMaterno !== undefined) {
      fields.push('apellido_materno = ?');
      values.push(updateData.apellidoMaterno);
    }
    if (updateData.tipoDocumento) {
      fields.push('tipo_documento = ?');
      values.push(updateData.tipoDocumento);
    }
    if (updateData.numeroDocumento) {
      fields.push('numero_documento = ?');
      values.push(updateData.numeroDocumento);
    }
    if (updateData.correoElectronico) {
      fields.push('correo_electronico = ?');
      values.push(updateData.correoElectronico);
    }
    if (updateData.telefonoPrincipal) {
      fields.push('telefono_principal = ?');
      values.push(updateData.telefonoPrincipal);
    }
    if (updateData.telefonoSecundario !== undefined) {
      fields.push('telefono_secundario = ?');
      values.push(updateData.telefonoSecundario);
    }
    if (updateData.tipoUsuario) {
      fields.push('tipo_usuario = ?');
      values.push(updateData.tipoUsuario);
    }
    if (updateData.nombreUsuario) {
      fields.push('nombre_usuario = ?');
      values.push(updateData.nombreUsuario);
    }
    if (updateData.contrasenaHash) {
      fields.push('contrasena_hash = ?');
      values.push(updateData.contrasenaHash);
    }
    if (updateData.metodoAutenticacion) {
      fields.push('metodo_autenticacion = ?');
      values.push(updateData.metodoAutenticacion);
    }
    if (updateData.idExternoGoogle !== undefined) {
      fields.push('id_externo_google = ?');
      values.push(updateData.idExternoGoogle);
    }
    if (updateData.idExternoMicrosoft !== undefined) {
      fields.push('id_externo_microsoft = ?');
      values.push(updateData.idExternoMicrosoft);
    }
    if (updateData.estadoUsuario) {
      fields.push('estado_usuario = ?');
      values.push(updateData.estadoUsuario);
    }
    if (updateData.activo !== undefined) {
      fields.push('activo = ?');
      values.push(updateData.activo);
    }
    if (updateData.intentosFallidos !== undefined) {
      fields.push('intentos_fallidos = ?');
      values.push(updateData.intentosFallidos);
    }
    if (updateData.bloqueadoHasta !== undefined) {
      fields.push('bloqueado_hasta = ?');
      values.push(updateData.bloqueadoHasta ? updateData.bloqueadoHasta.toISOString() : null);
    }
    if (updateData.dosfactorHabilitado !== undefined) {
      fields.push('dosfactor_habilitado = ?');
      values.push(updateData.dosfactorHabilitado);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('ultima_modificacion = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await executeModify(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Update user status
   */
  static async updateStatus(id: number, estadoUsuario: string): Promise<Usuario | null> {
    await executeModify(
      'UPDATE usuarios SET estado_usuario = ?, ultima_modificacion = ? WHERE id = ?',
      [estadoUsuario, new Date().toISOString(), id]
    );

    return this.findById(id);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id: number): Promise<void> {
    await executeModify(
      'UPDATE usuarios SET ultimo_login = ?, ultima_actividad = ?, ultima_modificacion = ?, intentos_fallidos = 0 WHERE id = ?',
      [new Date().toISOString(), new Date().toISOString(), new Date().toISOString(), id]
    );
  }

  /**
   * Update last activity
   */
  static async updateLastActivity(id: number): Promise<void> {
    await executeModify(
      'UPDATE usuarios SET ultima_actividad = ?, ultima_modificacion = ? WHERE id = ?',
      [new Date().toISOString(), new Date().toISOString(), id]
    );
  }

  /**
   * Increment failed login attempts
   */
  static async incrementFailedAttempts(id: number): Promise<void> {
    await executeModify(
      'UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1, ultima_modificacion = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  /**
   * Reset failed attempts
   */
  static async resetFailedAttempts(id: number): Promise<void> {
    await executeModify(
      'UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultima_modificacion = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  /**
   * Block user until specified date
   */
  static async blockUser(id: number, blockedUntil: Date): Promise<void> {
    await executeModify(
      'UPDATE usuarios SET bloqueado_hasta = ?, estado_usuario = ?, ultima_modificacion = ? WHERE id = ?',
      [blockedUntil.toISOString(), 'Bloqueado', new Date().toISOString(), id]
    );
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<boolean> {
    const result = await executeModify('DELETE FROM usuarios WHERE id = ?', [id]);
    return (result.changes ?? 0) > 0;
  }

  /**
   * Check if username exists
   */
  static async usernameExists(nombreUsuario: string): Promise<boolean> {
    const row = await executeQueryOne('SELECT 1 FROM usuarios WHERE nombre_usuario = ?', [nombreUsuario]);
    return !!row;
  }

  /**
   * Check if email exists
   */
  static async emailExists(correoElectronico: string): Promise<boolean> {
    const row = await executeQueryOne('SELECT 1 FROM usuarios WHERE correo_electronico = ?', [correoElectronico]);
    return !!row;
  }

  /**
   * Check if document number exists
   */
  static async documentExists(numeroDocumento: string): Promise<boolean> {
    const row = await executeQueryOne('SELECT 1 FROM usuarios WHERE numero_documento = ?', [numeroDocumento]);
    return !!row;
  }

  /**
   * Get user count by status
   */
  static async getCountByStatus(): Promise<{ estadoUsuario: string; count: number }[]> {
    const rows = await executeQuery<any>(
      'SELECT estado_usuario, COUNT(*) as count FROM usuarios GROUP BY estado_usuario'
    );

    return rows.map(row => ({
      estadoUsuario: row.estado_usuario,
      count: row.count
    }));
  }

  /**
   * Search users by username, email or name
   */
  static async search(query: string, limit: number = 50): Promise<Usuario[]> {
    const rows = await executeQuery<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              correo_electronico, telefono_principal, telefono_secundario, tipo_usuario, 
              nombre_usuario, contrasena_hash, metodo_autenticacion, id_externo_google, 
              id_externo_microsoft, estado_usuario, activo, intentos_fallidos, bloqueado_hasta,
              dosfactor_habilitado, ultimo_login, ultima_actividad, fecha_creacion, 
              ultima_modificacion, id_usuario_creador
       FROM usuarios 
       WHERE nombre_usuario LIKE ? OR correo_electronico LIKE ? OR nombres LIKE ? OR apellido_paterno LIKE ?
       ORDER BY nombre_usuario ASC 
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, limit]
    );

    return rows.map(row => this.mapRowToUsuario(row));
  }

  // ========================================
  // SESION OPERATIONS
  // ========================================

  /**
   * Create user session
   */
  static async createSession(sessionData: any): Promise<SesionUsuario> {
    const result = await executeModify(
      `INSERT INTO sesiones_usuarios (id_usuario, token, token_refresh, dispositivo, direccion_ip, 
                                     user_agent, fecha_inicio, fecha_expiracion, fecha_ultima_actividad) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sessionData.idUsuario, sessionData.token, sessionData.tokenRefresh, sessionData.dispositivo,
       sessionData.direccionIP, sessionData.userAgent, new Date().toISOString(),
       sessionData.fechaExpiracion.toISOString(), new Date().toISOString()]
    );

    const session = await this.findSessionById(result.lastID!);
    if (!session) {
      throw new Error('Failed to create session');
    }

    return session;
  }

  /**
   * Find session by ID
   */
  static async findSessionById(id: number): Promise<SesionUsuario | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, token, token_refresh, dispositivo, direccion_ip, user_agent,
              fecha_inicio, fecha_expiracion, fecha_ultima_actividad, activa, cerrada_manualmente
       FROM sesiones_usuarios WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToSesionUsuario(row) : null;
  }

  /**
   * Find session by token
   */
  static async findSessionByToken(token: string): Promise<SesionUsuario | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, token, token_refresh, dispositivo, direccion_ip, user_agent,
              fecha_inicio, fecha_expiracion, fecha_ultima_actividad, activa, cerrada_manualmente
       FROM sesiones_usuarios WHERE token = ?`,
      [token]
    );

    return row ? this.mapRowToSesionUsuario(row) : null;
  }

  /**
   * Get active sessions for user
   */
  static async getActiveSessionsForUser(idUsuario: number): Promise<SesionUsuario[]> {
    const rows = await executeQuery<any>(
      `SELECT id, id_usuario, token, token_refresh, dispositivo, direccion_ip, user_agent,
              fecha_inicio, fecha_expiracion, fecha_ultima_actividad, activa, cerrada_manualmente
       FROM sesiones_usuarios WHERE id_usuario = ? AND activa = 1 ORDER BY fecha_inicio DESC`,
      [idUsuario]
    );

    return rows.map(row => this.mapRowToSesionUsuario(row));
  }

  /**
   * Update session activity
   */
  static async updateSessionActivity(id: number): Promise<void> {
    await executeModify(
      'UPDATE sesiones_usuarios SET fecha_ultima_actividad = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  /**
   * Close session
   */
  static async closeSession(id: number): Promise<void> {
    await executeModify(
      'UPDATE sesiones_usuarios SET activa = 0, cerrada_manualmente = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  /**
   * Close all sessions for user
   */
  static async closeAllSessionsForUser(idUsuario: number): Promise<void> {
    await executeModify(
      'UPDATE sesiones_usuarios SET activa = 0, cerrada_manualmente = ? WHERE id_usuario = ?',
      [new Date().toISOString(), idUsuario]
    );
  }

  // ========================================
  // AUDIT OPERATIONS
  // ========================================

  /**
   * Create login audit record
   */
  static async createLoginAudit(auditData: any): Promise<AuditoriaLogin> {
    const result = await executeModify(
      `INSERT INTO auditoria_login (id_usuario, nombre_usuario, exitoso, razon_fallo, direccion_ip, 
                                   dispositivo, user_agent, fecha_intento) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [auditData.idUsuario, auditData.nombreUsuario, auditData.exitoso, auditData.razonFallo,
       auditData.direccionIP, auditData.dispositivo, auditData.userAgent, new Date().toISOString()]
    );

    const audit = await this.findLoginAuditById(result.lastID!);
    if (!audit) {
      throw new Error('Failed to create login audit');
    }

    return audit;
  }

  /**
   * Find login audit by ID
   */
  static async findLoginAuditById(id: number): Promise<AuditoriaLogin | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, nombre_usuario, exitoso, razon_fallo, direccion_ip, dispositivo, user_agent, fecha_intento
       FROM auditoria_login WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToAuditoriaLogin(row) : null;
  }

  /**
   * Get recent login attempts for user
   */
  static async getRecentLoginAttempts(idUsuario: number, limit: number = 10): Promise<AuditoriaLogin[]> {
    const rows = await executeQuery<any>(
      `SELECT id, id_usuario, nombre_usuario, exitoso, razon_fallo, direccion_ip, dispositivo, user_agent, fecha_intento
       FROM auditoria_login WHERE id_usuario = ? ORDER BY fecha_intento DESC LIMIT ?`,
      [idUsuario, limit]
    );

    return rows.map(row => this.mapRowToAuditoriaLogin(row));
  }

  // ========================================
  // PASSWORD OPERATIONS
  // ========================================

  /**
   * Create password change record
   */
  static async createPasswordChange(changeData: any): Promise<CambioContraseña> {
    const result = await executeModify(
      `INSERT INTO cambio_contrasena (id_usuario, contrasena_antigua, contrasena_new, razon_cambio, 
                                      fecha_cambio, direccion_ip, id_usuario_modificador) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [changeData.idUsuario, changeData.contrasenaAntigua, changeData.contrasenaNew,
       changeData.razonCambio, new Date().toISOString(), changeData.direccionIP, changeData.idUsuarioModificador]
    );

    const change = await this.findPasswordChangeById(result.lastID!);
    if (!change) {
      throw new Error('Failed to create password change record');
    }

    return change;
  }

  /**
   * Find password change by ID
   */
  static async findPasswordChangeById(id: number): Promise<CambioContraseña | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, contrasena_antigua, contrasena_new, razon_cambio, fecha_cambio, direccion_ip, id_usuario_modificador
       FROM cambio_contrasena WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToCambioContraseña(row) : null;
  }

  /**
   * Create password reset request
   */
  static async createPasswordReset(resetData: any): Promise<RestablecimientoContraseña> {
    const result = await executeModify(
      `INSERT INTO restablecimiento_contrasena (id_usuario, token, token_hash, utilizado, 
                                                fecha_solicitud, fecha_expiracion, direccion_ip) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [resetData.idUsuario, resetData.token, resetData.tokenHash, false,
       new Date().toISOString(), resetData.fechaExpiracion.toISOString(), resetData.direccionIP]
    );

    const reset = await this.findPasswordResetByToken(resetData.token);
    if (!reset) {
      throw new Error('Failed to create password reset request');
    }

    return reset;
  }

  /**
   * Find password reset by token
   */
  static async findPasswordResetByToken(token: string): Promise<RestablecimientoContraseña | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, token, token_hash, utilizado, fecha_solicitud, fecha_expiracion, fecha_utilizacion, direccion_ip
       FROM restablecimiento_contrasena WHERE token = ?`,
      [token]
    );

    return row ? this.mapRowToRestablecimientoContraseña(row) : null;
  }

  /**
   * Mark password reset as used
   */
  static async markPasswordResetAsUsed(id: number): Promise<void> {
    await executeModify(
      'UPDATE restablecimiento_contrasena SET utilizado = 1, fecha_utilizacion = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  // ========================================
  // ACCESS HISTORY OPERATIONS
  // ========================================

  /**
   * Create access history record
   */
  static async createAccessHistory(historyData: any): Promise<HistorialAcceso> {
    const result = await executeModify(
      `INSERT INTO historial_acceso (id_usuario, modulo, accion, descripcion, id_recurso, tipo_recurso, 
                                     datos_antes, datos_despues, fecha_acceso, direccion_ip, sesion_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [historyData.idUsuario, historyData.modulo, historyData.accion, historyData.descripcion,
       historyData.idRecurso, historyData.tipoRecurso, historyData.datosAntes,
       historyData.datosDespues, new Date().toISOString(), historyData.direccionIP, historyData.sesionId]
    );

    const history = await this.findAccessHistoryById(result.lastID!);
    if (!history) {
      throw new Error('Failed to create access history record');
    }

    return history;
  }

  /**
   * Find access history by ID
   */
  static async findAccessHistoryById(id: number): Promise<HistorialAcceso | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, modulo, accion, descripcion, id_recurso, tipo_recurso, datos_antes, datos_despues, fecha_acceso, direccion_ip, sesion_id
       FROM historial_acceso WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToHistorialAcceso(row) : null;
  }

  /**
   * Get access history for user
   */
  static async getAccessHistoryForUser(idUsuario: number, limit: number = 50): Promise<HistorialAcceso[]> {
    const rows = await executeQuery<any>(
      `SELECT id, id_usuario, modulo, accion, descripcion, id_recurso, tipo_recurso, datos_antes, datos_despues, fecha_acceso, direccion_ip, sesion_id
       FROM historial_acceso WHERE id_usuario = ? ORDER BY fecha_acceso DESC LIMIT ?`,
      [idUsuario, limit]
    );

    return rows.map(row => this.mapRowToHistorialAcceso(row));
  }

  // ========================================
  // SPECIAL PERMISSIONS OPERATIONS
  // ========================================

  /**
   * Create special permission
   */
  static async createSpecialPermission(permissionData: any): Promise<PermisoEspecial> {
    const result = await executeModify(
      `INSERT INTO permisos_especiales (id_usuario, modulo, accion, descripcion, fecha_inicio, fecha_fin, 
                                        activo, id_usuario_otorgador, razon_otorgamiento, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [permissionData.idUsuario, permissionData.modulo, permissionData.accion, permissionData.descripcion,
       permissionData.fechaInicio.toISOString(), permissionData.fechaFin.toISOString(), true,
       permissionData.idUsuarioOtorgador, permissionData.razonOtorgamiento, new Date().toISOString()]
    );

    const permission = await this.findSpecialPermissionById(result.lastID!);
    if (!permission) {
      throw new Error('Failed to create special permission');
    }

    return permission;
  }

  /**
   * Find special permission by ID
   */
  static async findSpecialPermissionById(id: number): Promise<PermisoEspecial | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, id_usuario, modulo, accion, descripcion, fecha_inicio, fecha_fin, activo, id_usuario_otorgador, razon_otorgamiento, fecha_creacion
       FROM permisos_especiales WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToPermisoEspecial(row) : null;
  }

  /**
   * Get active special permissions for user
   */
  static async getActiveSpecialPermissionsForUser(idUsuario: number): Promise<PermisoEspecial[]> {
    const rows = await executeQuery<any>(
      `SELECT id, id_usuario, modulo, accion, descripcion, fecha_inicio, fecha_fin, activo, id_usuario_otorgador, razon_otorgamiento, fecha_creacion
       FROM permisos_especiales WHERE id_usuario = ? AND activo = 1 AND fecha_fin > ? ORDER BY fecha_fin ASC`,
      [idUsuario, new Date().toISOString()]
    );

    return rows.map(row => this.mapRowToPermisoEspecial(row));
  }

  // ========================================
  // MAPPING METHODS
  // ========================================

  private static mapRowToUsuario(row: any): Usuario {
    return {
      id: row.id,
      nombres: row.nombres,
      apellidoPaterno: row.apellido_paterno,
      apellidoMaterno: row.apellido_materno,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      correoElectronico: row.correo_electronico,
      telefonoPrincipal: row.telefono_principal,
      telefonoSecundario: row.telefono_secundario,
      tipoUsuario: row.tipo_usuario,
      nombreUsuario: row.nombre_usuario,
      contrasenaHash: row.contrasena_hash,
      metodoAutenticacion: row.metodo_autenticacion,
      idExternoGoogle: row.id_externo_google,
      idExternoMicrosoft: row.id_externo_microsoft,
      estadoUsuario: row.estado_usuario,
      activo: Boolean(row.activo),
      intentosFallidos: row.intentos_fallidos,
      bloqueadoHasta: row.bloqueado_hasta ? new Date(row.bloqueado_hasta) : null,
      dosfactorHabilitado: Boolean(row.dosfactor_habilitado),
      ultimoLogin: row.ultimo_login ? new Date(row.ultimo_login) : null,
      ultimaActividad: row.ultima_actividad ? new Date(row.ultima_actividad) : null,
      fechaCreacion: new Date(row.fecha_creacion),
      ultimaModificacion: new Date(row.ultima_modificacion),
      idUsuarioCreador: row.id_usuario_creador
    };
  }

  private static mapRowToSesionUsuario(row: any): SesionUsuario {
    return {
      id: row.id,
      idUsuario: row.id_usuario,
      token: row.token,
      tokenRefresh: row.token_refresh,
      dispositivo: row.dispositivo,
      direccionIP: row.direccion_ip,
      userAgent: row.user_agent,
      fechaInicio: new Date(row.fecha_inicio),
      fechaExpiracion: new Date(row.fecha_expiracion),
      fechaUltimaActividad: new Date(row.fecha_ultima_actividad),
      activa: Boolean(row.activa),
      cerradaManualmente: row.cerrada_manualmente ? new Date(row.cerrada_manualmente) : null
    };
  }

  private static mapRowToAuditoriaLogin(row: any): AuditoriaLogin {
    return {
      id: row.id,
      idUsuario: row.id_usuario,
      nombreUsuario: row.nombre_usuario,
      exitoso: Boolean(row.exitoso),
      razonFallo: row.razon_fallo,
      direccionIP: row.direccion_ip,
      dispositivo: row.dispositivo,
      userAgent: row.user_agent,
      fechaIntento: new Date(row.fecha_intento)
    };
  }

  private static mapRowToCambioContraseña(row: any): CambioContraseña {
    return {
      id: row.id,
      idUsuario: row.id_usuario,
      contrasenaAntigua: row.contrasena_antigua,
      contrasenaNew: row.contrasena_new,
      razonCambio: row.razon_cambio,
      fechaCambio: new Date(row.fecha_cambio),
      direccionIP: row.direccion_ip,
      idUsuarioModificador: row.id_usuario_modificador
    };
  }

  private static mapRowToRestablecimientoContraseña(row: any): RestablecimientoContraseña {
    return {
      id: row.id,
      idUsuario: row.id_usuario,
      token: row.token,
      tokenHash: row.token_hash,
      utilizado: Boolean(row.utilizado),
      fechaSolicitud: new Date(row.fecha_solicitud),
      fechaExpiracion: new Date(row.fecha_expiracion),
      fechaUtilizacion: row.fecha_utilizacion ? new Date(row.fecha_utilizacion) : null,
      direccionIP: row.direccion_ip
    };
  }

  private static mapRowToHistorialAcceso(row: any): HistorialAcceso {
    return {
      id: row.id,
      idUsuario: row.id_usuario,
      modulo: row.modulo,
      accion: row.accion,
      descripcion: row.descripcion,
      idRecurso: row.id_recurso,
      tipoRecurso: row.tipo_recurso,
      datosAntes: row.datos_antes,
      datosDespues: row.datos_despues,
      fechaAcceso: new Date(row.fecha_acceso),
      direccionIP: row.direccion_ip,
      sesionId: row.sesion_id
    };
  }

  private static mapRowToPermisoEspecial(row: any): PermisoEspecial {
    return {
      id: row.id,
      idUsuario: row.id_usuario,
      modulo: row.modulo,
      accion: row.accion,
      descripcion: row.descripcion,
      fechaInicio: new Date(row.fecha_inicio),
      fechaFin: new Date(row.fecha_fin),
      activo: Boolean(row.activo),
      idUsuarioOtorgador: row.id_usuario_otorgador,
      razonOtorgamiento: row.razon_otorgamiento,
      fechaCreacion: new Date(row.fecha_creacion)
    };
  }
}
