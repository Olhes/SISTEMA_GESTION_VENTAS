/**
 * Adaptador Secundario: Implementación del repositorio de Citas con SQLite
 * Conecta el dominio con la infraestructura de persistencia
 */

import DatabaseManager from '../../../../shared/database/connection';
import type { 
  IAppointmentRepo, 
  CreateCitaData 
} from '../../domain/ports/driven/IAppointmentRepo';
import type { 
  Cita,
  CitaConDetalles,
  EstadoVisitaGuiada
} from '../../domain/entities/Appointment';
import type { 
  CitaEntity, 
  CitaWithDetailsEntity
} from './AppointmentEntity';

export class AppointmentSqliteRepo implements IAppointmentRepo {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance({
      type: 'sqlite',
      url: './database.sqlite'
    });
  }

  // Operaciones CRUD básicas
  async findById(id: number): Promise<Cita | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM citas WHERE id_cita = ?',
          [id],
          (err: any, row: CitaEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToCita(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAll(): Promise<Cita[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM citas ORDER BY fecha_agendada DESC',
          [],
          (err: any, rows: CitaEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCita(row)));
            }
          }
        );
      }
    });
  }

  async save(cita: Cita): Promise<Cita> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO citas (
            fecha_agendada, observacion, estado_visita_guiada, 
            id_persona, id_usuario, fecha_creacion, fecha_modificacion
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            cita.fechaAgendada.toISOString(),
            cita.observacion,
            cita.estadoVisitaGuiada,
            cita.idPersona,
            cita.idUsuario,
            cita.fechaCreacion.toISOString(),
            cita.fechaModificacion?.toISOString()
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...cita,
                id: this.lastID
              });
            }
          }
        );
      }
    });
  }

  async update(id: number, cita: Partial<Cita>): Promise<Cita> {
    const database = this.db.getDatabase();
    const existingCita = await this.findById(id);
    
    if (!existingCita) {
      throw new Error('Cita no encontrada');
    }

    const updatedCita = { ...existingCita, ...cita };
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `UPDATE citas SET 
            fecha_agendada = ?, observacion = ?, estado_visita_guiada = ?, 
            fecha_modificacion = ?
          WHERE id_cita = ?`,
          [
            updatedCita.fechaAgendada.toISOString(),
            updatedCita.observacion,
            updatedCita.estadoVisitaGuiada,
            updatedCita.fechaModificacion?.toISOString(),
            id
          ],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedCita);
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
          'DELETE FROM citas WHERE id_cita = ?',
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
  async findByIdWithDetails(id: number): Promise<CitaConDetalles | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          `SELECT c.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.telefono as persona_telefono,
                  p.correo as persona_correo,
                  u.nombre_usuario as usuario_nombre_usuario,
                  r.nombre_rol as usuario_rol
           FROM citas c
           INNER JOIN personas p ON c.id_persona = p.id_persona
           INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE c.id_cita = ?`,
          [id],
          (err: any, row: CitaWithDetailsEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToCitaConDetalles(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAllWithDetails(): Promise<CitaConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.telefono as persona_telefono,
                  p.correo as persona_correo,
                  u.nombre_usuario as usuario_nombre_usuario,
                  r.nombre_rol as usuario_rol
           FROM citas c
           INNER JOIN personas p ON c.id_persona = p.id_persona
           INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
           INNER JOIN roles r ON u.id_rol = r.id_rol
           ORDER BY c.fecha_agendada DESC`,
          [],
          (err: any, rows: CitaWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCitaConDetalles(row)));
            }
          }
        );
      }
    });
  }

  // Operaciones de consulta especializadas
  async findByPersona(idPersona: number): Promise<CitaConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.telefono as persona_telefono,
                  p.correo as persona_correo,
                  u.nombre_usuario as usuario_nombre_usuario,
                  r.nombre_rol as usuario_rol
           FROM citas c
           INNER JOIN personas p ON c.id_persona = p.id_persona
           INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE c.id_persona = ?
           ORDER BY c.fecha_agendada DESC`,
          [idPersona],
          (err: any, rows: CitaWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCitaConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async findByUsuario(idUsuario: number): Promise<CitaConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.telefono as persona_telefono,
                  p.correo as persona_correo,
                  u.nombre_usuario as usuario_nombre_usuario,
                  r.nombre_rol as usuario_rol
           FROM citas c
           INNER JOIN personas p ON c.id_persona = p.id_persona
           INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE c.id_usuario = ?
           ORDER BY c.fecha_agendada DESC`,
          [idUsuario],
          (err: any, rows: CitaWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCitaConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async findByEstado(estado: EstadoVisitaGuiada): Promise<Cita[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM citas WHERE estado_visita_guiada = ? ORDER BY fecha_agendada DESC',
          [estado],
          (err: any, rows: CitaEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCita(row)));
            }
          }
        );
      }
    });
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Cita[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM citas WHERE fecha_agendada BETWEEN ? AND ? ORDER BY fecha_agendada ASC',
          [fechaInicio.toISOString(), fechaFin.toISOString()],
          (err: any, rows: CitaEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCita(row)));
            }
          }
        );
      }
    });
  }

  async findProximas(horasAnticipacion: number): Promise<CitaConDetalles[]> {
    const database = this.db.getDatabase();
    const limite = new Date();
    limite.setHours(limite.getHours() + horasAnticipacion);
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.telefono as persona_telefono,
                  p.correo as persona_correo,
                  u.nombre_usuario as usuario_nombre_usuario,
                  r.nombre_rol as usuario_rol
           FROM citas c
           INNER JOIN personas p ON c.id_persona = p.id_persona
           INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE c.fecha_agendada BETWEEN ? AND ? 
           AND c.estado_visita_guiada = 'Realizó visita'
           ORDER BY c.fecha_agendada ASC`,
          [new Date().toISOString(), limite.toISOString()],
          (err: any, rows: CitaWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCitaConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async findVencidas(): Promise<CitaConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.nombres as persona_nombres,
                  p.apellido_paterno as persona_apellido_paterno,
                  p.apellido_materno as persona_apellido_materno,
                  p.telefono as persona_telefono,
                  p.correo as persona_correo,
                  u.nombre_usuario as usuario_nombre_usuario,
                  r.nombre_rol as usuario_rol
           FROM citas c
           INNER JOIN personas p ON c.id_persona = p.id_persona
           INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
           INNER JOIN roles r ON u.id_rol = r.id_rol
           WHERE c.fecha_agendada < ? 
           AND c.estado_visita_guiada = 'Realizó visita'
           ORDER BY c.fecha_agendada DESC`,
          [new Date().toISOString()],
          (err: any, rows: CitaWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCitaConDetalles(row)));
            }
          }
        );
      }
    });
  }

  // Validaciones de negocio
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

  async usuarioValido(idUsuario: number): Promise<boolean> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM usuarios WHERE id_usuario = ?',
          [idUsuario],
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

  async verificarDisponibilidad(fecha: Date, idUsuario: number): Promise<boolean> {
    const database = this.db.getDatabase();
    const duracionCita = 60 * 60 * 1000; // 1 hora en milisegundos
    const inicio = new Date(fecha);
    const fin = new Date(inicio.getTime() + duracionCita);
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          `SELECT COUNT(*) as count 
           FROM citas 
           WHERE id_usuario = ? 
           AND estado_visita_guiada != 'Canceló'
           AND (
             (fecha_agendada < ? AND datetime(fecha_agendada, '+1 hour') > ?) OR
             (fecha_agendada > ? AND fecha_agendada < datetime(?, '+1 hour'))
           )`,
          [idUsuario, inicio.toISOString(), inicio.toISOString(), inicio.toISOString(), inicio.toISOString()],
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

  async obtenerCitasDelDia(fecha: Date, idUsuario: number): Promise<Cita[]> {
    const database = this.db.getDatabase();
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM citas WHERE id_usuario = ? AND fecha_agendada BETWEEN ? AND ? ORDER BY fecha_agendada ASC',
          [idUsuario, inicioDia.toISOString(), finDia.toISOString()],
          (err: any, rows: CitaEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToCita(row)));
            }
          }
        );
      }
    });
  }

  // Métodos de mapeo
  private mapToCita(entity: CitaEntity): Cita {
    return {
      id: entity.id_cita,
      fechaAgendada: new Date(entity.fecha_agendada),
      observacion: entity.observacion,
      estadoVisitaGuiada: entity.estado_visita_guiada as EstadoVisitaGuiada,
      idPersona: entity.id_persona,
      idUsuario: entity.id_usuario,
      fechaCreacion: new Date(entity.fecha_creacion),
      fechaModificacion: entity.fecha_modificacion ? new Date(entity.fecha_modificacion) : null
    };
  }

  private mapToCitaConDetalles(row: CitaWithDetailsEntity): CitaConDetalles {
    const cita = this.mapToCita(row);
    return {
      ...cita,
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidoPaterno: row.persona_apellido_paterno,
        apellidoMaterno: row.persona_apellido_materno,
        telefono: row.persona_telefono,
        correo: row.persona_correo
      },
      usuario: {
        id: row.id_usuario,
        nombreUsuario: row.usuario_nombre_usuario,
        rol: row.usuario_rol
      }
    };
  }
}
