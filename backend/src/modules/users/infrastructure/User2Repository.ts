import type { User2, CrearUsuarioData, ActualizarUsuarioData } from '../domain/entities/User2.js';
import { executeQuery, executeQueryOne, executeModify, transaction } from '../../../database/sqlite.js';

/**
 * SQLite Repository for User2 entity
 */
export class User2Repository {
  /**
   * Create a new user
   */
  static async create(userData: CrearUsuarioData): Promise<User2> {
    const result = await executeModify(
      `INSERT INTO users2 (nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento, 
                        email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado, 
                        departamento, nombre_usuario, contrasena, estado_usuario, activo, fecha_creacion, ultima_modificacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userData.nombres, userData.apellidoPaterno, userData.apellidoMaterno, userData.tipoDocumento, userData.numeroDocumento,
       userData.email, userData.telefono, userData.telefonoSecundario, userData.tipoUsuario, userData.nivelAcceso,
       userData.codigoEmpleado, userData.departamento, userData.nombreUsuario, userData.contrasena, 'Activo', true,
       new Date().toISOString(), new Date().toISOString()]
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
  static async findById(id: number): Promise<User2 | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 WHERE id = ?`,
      [id]
    );

    return row ? this.mapRowToUser(row) : null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User2 | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 WHERE nombre_usuario = ?`,
      [username]
    );

    return row ? this.mapRowToUser(row) : null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User2 | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 WHERE email = ?`,
      [email]
    );

    return row ? this.mapRowToUser(row) : null;
  }

  /**
   * Find user by username or email
   */
  static async findByUsernameOrEmail(usernameOrEmail: string): Promise<User2 | null> {
    const row = await executeQueryOne<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 WHERE nombre_usuario = ? OR email = ?`,
      [usernameOrEmail, usernameOrEmail]
    );

    return row ? this.mapRowToUser(row) : null;
  }

  /**
   * Get all users
   */
  static async findAll(): Promise<User2[]> {
    const rows = await executeQuery<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 ORDER BY fecha_creacion DESC`
    );

    return rows.map(row => this.mapRowToUser(row));
  }

  /**
   * Get users by status
   */
  static async findByStatus(status: string): Promise<User2[]> {
    const rows = await executeQuery<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 WHERE estado_usuario = ? ORDER BY fecha_creacion DESC`,
      [status]
    );

    return rows.map(row => this.mapRowToUser(row));
  }

  /**
   * Update user
   */
  static async update(id: number, updateData: ActualizarUsuarioData): Promise<User2 | null> {
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
    if (updateData.email) {
      fields.push('email = ?');
      values.push(updateData.email);
    }
    if (updateData.telefono) {
      fields.push('telefono = ?');
      values.push(updateData.telefono);
    }
    if (updateData.telefonoSecundario !== undefined) {
      fields.push('telefono_secundario = ?');
      values.push(updateData.telefonoSecundario);
    }
    if (updateData.tipoUsuario) {
      fields.push('tipo_usuario = ?');
      values.push(updateData.tipoUsuario);
    }
    if (updateData.nivelAcceso) {
      fields.push('nivel_acceso = ?');
      values.push(updateData.nivelAcceso);
    }
    if (updateData.codigoEmpleado !== undefined) {
      fields.push('codigo_empleado = ?');
      values.push(updateData.codigoEmpleado);
    }
    if (updateData.departamento !== undefined) {
      fields.push('departamento = ?');
      values.push(updateData.departamento);
    }
    if (updateData.nombreUsuario) {
      fields.push('nombre_usuario = ?');
      values.push(updateData.nombreUsuario);
    }
    if (updateData.contrasena) {
      fields.push('contrasena = ?');
      values.push(updateData.contrasena);
    }
    if (updateData.estadoUsuario) {
      fields.push('estado_usuario = ?');
      values.push(updateData.estadoUsuario);
    }
    if (updateData.activo !== undefined) {
      fields.push('activo = ?');
      values.push(updateData.activo);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('ultima_modificacion = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await executeModify(
      `UPDATE users2 SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Update user status
   */
  static async updateStatus(id: number, status: string): Promise<User2 | null> {
    await executeModify(
      'UPDATE users2 SET estado_usuario = ?, ultima_modificacion = ? WHERE id = ?',
      [status, new Date().toISOString(), id]
    );

    return this.findById(id);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id: number): Promise<void> {
    await executeModify(
      'UPDATE users2 SET ultimo_login = ?, ultima_modificacion = ? WHERE id = ?',
      [new Date().toISOString(), new Date().toISOString(), id]
    );
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<boolean> {
    const result = await executeModify('DELETE FROM users2 WHERE id = ?', [id]);
    return (result.changes ?? 0) > 0;
  }

  /**
   * Check if username exists
   */
  static async usernameExists(username: string): Promise<boolean> {
    const row = await executeQueryOne('SELECT 1 FROM users2 WHERE nombre_usuario = ?', [username]);
    return !!row;
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const row = await executeQueryOne('SELECT 1 FROM users2 WHERE email = ?', [email]);
    return !!row;
  }

  /**
   * Get user count by status
   */
  static async getCountByStatus(): Promise<{ status: string; count: number }[]> {
    const rows = await executeQuery<any>(
      'SELECT status, COUNT(*) as count FROM users2 GROUP BY status'
    );

    return rows.map(row => ({
      status: row.status,
      count: row.count
    }));
  }

  /**
   * Search users by username or email
   */
  static async search(query: string, limit: number = 50): Promise<User2[]> {
    const rows = await executeQuery<any>(
      `SELECT id, nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento,
              email, telefono, telefono_secundario, tipo_usuario, nivel_acceso, codigo_empleado,
              departamento, nombre_usuario, contrasena, estado_usuario, activo,
              fecha_creacion as fechaCreacion, 
              ultima_modificacion as ultimaModificacion, 
              ultimo_login as ultimoLogin,
              id_creador as idCreador
       FROM users2 
       WHERE nombre_usuario LIKE ? OR email LIKE ? 
       ORDER BY nombre_usuario ASC 
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, limit]
    );

    return rows.map(row => this.mapRowToUser(row));
  }

  /**
   * Map database row to User entity
   */
  private static mapRowToUser(row: any): User2 {
    return {
      id: row.id,
      nombres: row.nombres,
      apellidoPaterno: row.apellido_paterno,
      apellidoMaterno: row.apellido_materno,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      email: row.email,
      telefono: row.telefono,
      telefonoSecundario: row.telefono_secundario,
      tipoUsuario: row.tipo_usuario,
      nivelAcceso: row.nivel_acceso,
      codigoEmpleado: row.codigo_empleado,
      departamento: row.departamento,
      nombreUsuario: row.nombre_usuario,
      contrasena: row.contrasena,
      estadoUsuario: row.estado_usuario,
      activo: row.activo,
      fechaCreacion: new Date(row.fechaCreacion),
      ultimaModificacion: new Date(row.ultimaModificacion),
      ultimoLogin: row.ultimoLogin ? new Date(row.ultimoLogin) : undefined,
      idCreador: row.idCreador
    };
  }
}
