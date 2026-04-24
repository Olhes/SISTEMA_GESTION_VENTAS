/**
 * Adaptador Secundario: Implementación del repositorio de Autenticación con SQLite
 * Conecta el dominio con la infraestructura de persistencia
 */

import DatabaseManager from '../../../../shared/database/connection';
import type { 
  IAuthRepo, 
  CreateUsuarioData, 
  CreateSesionData 
} from '../../domain/ports/driven/IAuthRepo';
import type { 
  Usuario,
  UsuarioConDetalles,
  Sesion,
  Rol,
  Credenciales
} from '../../domain/entities/Auth';
import type { 
  UsuarioEntity, 
  RolEntity,
  SesionEntity,
  UsuarioWithDetailsEntity
} from './AuthEntity';

export class AuthSqliteRepo implements IAuthRepo {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance({
      type: 'sqlite',
      url: './database.sqlite'
    });
  }

  // Operaciones de usuarios
  async findById(id: number): Promise<Usuario | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM usuarios WHERE id_usuario = ?',
          [id],
          (err: any, row: UsuarioEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToUsuario(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findByNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM usuarios WHERE nombre_usuario = ?',
          [nombreUsuario.toLowerCase()],
          (err: any, row: UsuarioEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToUsuario(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAll(): Promise<UsuarioConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT u.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.tipo_documento as persona_tipo_documento,
                  p.numero_documento as persona_numero_documento,
                  r.nombre_rol as rol_nombre
           FROM usuarios u
           INNER JOIN personas p ON u.id_persona = p.id_persona
           INNER JOIN roles r ON u.id_rol = r.id_rol
           ORDER BY u.fecha_creacion DESC`,
          [],
          (err: any, rows: UsuarioWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToUsuarioConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async save(usuario: Usuario): Promise<Usuario> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO usuarios (
            id_persona, nombre_usuario, contrasena, id_rol, 
            fecha_creacion, ultimo_login, activo
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            usuario.idPersona,
            usuario.nombreUsuario,
            usuario.contrasena,
            usuario.idRol,
            usuario.fechaCreacion.toISOString(),
            usuario.ultimoLogin?.toISOString(),
            usuario.activo
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...usuario,
                id: this.lastID
              });
            }
          }
        );
      }
    });
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const database = this.db.getDatabase();
    const existingUsuario = await this.findById(id);
    
    if (!existingUsuario) {
      throw new Error('Usuario no encontrado');
    }

    const updatedUsuario = { ...existingUsuario, ...usuario };
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `UPDATE usuarios SET 
            nombre_usuario = ?, contrasena = ?, id_rol = ?, 
            ultimo_login = ?, activo = ?
          WHERE id_usuario = ?`,
          [
            updatedUsuario.nombreUsuario,
            updatedUsuario.contrasena,
            updatedUsuario.idRol,
            updatedUsuario.ultimoLogin?.toISOString(),
            updatedUsuario.activo,
            id
          ],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedUsuario);
            }
          }
        );
      }
    });
  }

  async delete(id: number): Promise<void> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'DELETE FROM usuarios WHERE id_usuario = ?',
          [id],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      }
    });
  }

  // Operaciones con detalles
  async findByIdWithDetails(id: number): Promise<UsuarioConDetalles | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          `SELECT u.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.tipo_documento as persona_tipo_documento,
                  p.numero_documento as persona_numero_documento,
                  r.nombre_rol as rol_nombre
           FROM usuarios u
           INNER JOIN personas p ON u.id_persona = p.id_persona
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE u.id_usuario = ?`,
          [id],
          (err: any, row: UsuarioWithDetailsEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToUsuarioConDetalles(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findByNombreUsuarioWithDetails(nombreUsuario: string): Promise<UsuarioConDetalles | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          `SELECT u.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.tipo_documento as persona_tipo_documento,
                  p.numero_documento as persona_numero_documento,
                  r.nombre_rol as rol_nombre
           FROM usuarios u
           INNER JOIN personas p ON u.id_persona = p.id_persona
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE u.nombre_usuario = ?`,
          [nombreUsuario.toLowerCase()],
          (err: any, row: UsuarioWithDetailsEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToUsuarioConDetalles(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  // Validaciones de negocio
  async nombreUsuarioDisponible(nombreUsuario: string): Promise<boolean> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM usuarios WHERE nombre_usuario = ?',
          [nombreUsuario.toLowerCase()],
          (err: any, row: { count: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.count === 0);
            }
          }
        );
      }
    });
  }

  async personaValida(idPersona: number): Promise<boolean> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM personas WHERE id_persona = ?',
          [idPersona],
          (err: any, row: { count: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.count > 0);
            }
          }
        );
      }
    });
  }

  async rolValido(idRol: number): Promise<boolean> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM roles WHERE id_rol = ?',
          [idRol],
          (err: any, row: { count: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.count > 0);
            }
          }
        );
      }
    });
  }

  // Operaciones de sesiones
  async crearSesion(sesion: Omit<Sesion, 'id' | 'fechaCreacion'>): Promise<Sesion> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO sesiones (
            id_usuario, token, fecha_creacion, fecha_expiracion, activa
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            sesion.idUsuario,
            sesion.token,
            new Date().toISOString(),
            sesion.fechaExpiracion.toISOString(),
            sesion.activa
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: this.lastID,
                ...sesion,
                fechaCreacion: new Date()
              });
            }
          }
        );
      }
    });
  }

  async findByToken(token: string): Promise<Sesion | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM sesiones WHERE token = ?',
          [token],
          (err: any, row: SesionEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToSesion(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async updateSesion(id: number, sesion: Partial<Sesion>): Promise<Sesion> {
    const database = this.db.getDatabase();
    const existingSesion = await this.findByToken('');
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'UPDATE sesiones SET activa = ?, fecha_expiracion = ? WHERE id_sesion = ?',
          [sesion.activa, sesion.fechaExpiracion?.toISOString(), id],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve({} as Sesion);
            }
          }
        );
      }
    });
  }

  async deleteSesion(id: number): Promise<void> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'DELETE FROM sesiones WHERE id_sesion = ?',
          [id],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      }
    });
  }

  async findSesionesActivasByUsuario(idUsuario: number): Promise<Sesion[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM sesiones WHERE id_usuario = ? AND activa = true',
          [idUsuario],
          (err: any, rows: SesionEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToSesion(row)));
            }
          }
        );
      }
    });
  }

  async deleteSesionesByUsuario(idUsuario: number): Promise<void> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'DELETE FROM sesiones WHERE id_usuario = ?',
          [idUsuario],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      }
    });
  }

  // Operaciones de roles
  async findAllRoles(): Promise<Rol[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM roles ORDER BY nombre_rol',
          [],
          (err: any, rows: RolEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToRol(row)));
            }
          }
        );
      }
    });
  }

  async findRolById(id: number): Promise<Rol | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM roles WHERE id_rol = ?',
          [id],
          (err: any, row: RolEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToRol(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  // Métodos de mapeo
  private mapToUsuario(entity: UsuarioEntity): Usuario {
    return {
      id: entity.id_usuario,
      idPersona: entity.id_persona,
      nombreUsuario: entity.nombre_usuario,
      contrasena: entity.contrasena,
      idRol: entity.id_rol,
      fechaCreacion: new Date(entity.fecha_creacion),
      ultimoLogin: entity.ultimo_login ? new Date(entity.ultimo_login) : null,
      activo: entity.activo
    };
  }

  private mapToUsuarioConDetalles(row: UsuarioWithDetailsEntity): UsuarioConDetalles {
    const usuario = this.mapToUsuario(row);
    return {
      ...usuario,
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidoPaterno: row.persona_apellido_paterno,
        apellidoMaterno: row.persona_apellido_materno,
        tipoDocumento: row.persona_tipo_documento,
        numeroDocumento: row.persona_numero_documento
      },
      rol: {
        id: row.id_rol,
        nombreRol: row.rol_nombre as any
      }
    };
  }

  private mapToSesion(entity: SesionEntity): Sesion {
    return {
      id: entity.id_sesion,
      idUsuario: entity.id_usuario,
      token: entity.token,
      fechaCreacion: new Date(entity.fecha_creacion),
      fechaExpiracion: new Date(entity.fecha_expiracion),
      activa: entity.activa
    };
  }

  private mapToRol(entity: RolEntity): Rol {
    return {
      id: entity.id_rol,
      nombreRol: entity.nombre_rol as any
    };
  }
}
