/**
 * Adaptador Secundario: Implementación del repositorio de Reportes con SQLite
 * Conecta el dominio con la infraestructura de persistencia
 */

import DatabaseManager from '../../../../shared/database/connection';
import type { 
  IReportRepo, 
  CreateReporteData 
} from '../../domain/ports/driven/IReportRepo';
import type { 
  Reporte,
  ReporteConDetalles,
  TipoReporte
} from '../../domain/entities/Report';
import type { 
  ReporteEntity, 
  ReporteWithDetailsEntity
} from './ReportEntity';

export class ReportSqliteRepo implements IReportRepo {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance({
      type: 'sqlite',
      url: './database.sqlite'
    });
  }

  // Operaciones CRUD básicas
  async findById(id: number): Promise<Reporte | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM reportes WHERE id_reporte = ?',
          [id],
          (err: any, row: ReporteEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToReporte(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAll(): Promise<Reporte[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM reportes ORDER BY fecha_generacion DESC',
          [],
          (err: any, rows: ReporteEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToReporte(row)));
            }
          }
        );
      }
    });
  }

  async save(reporte: Reporte): Promise<Reporte> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO reportes (
            nombre, tipo, descripcion, parametros, fecha_generacion, 
            datos, formato, id_usuario_generador
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reporte.nombre,
            reporte.tipo,
            reporte.descripcion,
            JSON.stringify(reporte.parametros),
            reporte.fechaGeneracion.toISOString(),
            JSON.stringify(reporte.datos),
            reporte.formato,
            1 // TODO: Obtener del contexto de autenticación
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...reporte,
                id: this.lastID
              });
            }
          }
        );
      }
    });
  }

  async update(id: number, reporte: Partial<Reporte>): Promise<Reporte> {
    const database = this.db.getDatabase();
    const existingReporte = await this.findById(id);
    
    if (!existingReporte) {
      throw new Error('Reporte no encontrado');
    }

    const updatedReporte = { ...existingReporte, ...reporte };
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `UPDATE reportes SET 
            nombre = ?, descripcion = ?, parametros = ?, 
            datos = ?, formato = ?
          WHERE id_reporte = ?`,
          [
            updatedReporte.nombre,
            updatedReporte.descripcion,
            JSON.stringify(updatedReporte.parametros),
            JSON.stringify(updatedReporte.datos),
            updatedReporte.formato,
            id
          ],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedReporte);
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
          'DELETE FROM reportes WHERE id_reporte = ?',
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
  async findByIdWithDetails(id: number): Promise<ReporteConDetalles | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          `SELECT r.*, 
                  u.nombre_usuario as usuario_nombre_usuario,
                  rol.nombre_rol as usuario_rol
           FROM reportes r
           LEFT JOIN usuarios u ON r.id_usuario_generador = u.id_usuario
           LEFT JOIN roles rol ON u.id_rol = rol.id_rol
           WHERE r.id_reporte = ?`,
          [id],
          (err: any, row: ReporteWithDetailsEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToReporteConDetalles(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAllWithDetails(): Promise<ReporteConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT r.*, 
                  u.nombre_usuario as usuario_nombre_usuario,
                  rol.nombre_rol as usuario_rol
           FROM reportes r
           LEFT JOIN usuarios u ON r.id_usuario_generador = u.id_usuario
           LEFT JOIN roles rol ON u.id_rol = rol.id_rol
           ORDER BY r.fecha_generacion DESC`,
          [],
          (err: any, rows: ReporteWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToReporteConDetalles(row)));
            }
          }
        );
      }
    });
  }

  // Operaciones de consulta especializadas
  async findByTipo(tipo: TipoReporte): Promise<Reporte[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM reportes WHERE tipo = ? ORDER BY fecha_generacion DESC',
          [tipo],
          (err: any, rows: ReporteEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToReporte(row)));
            }
          }
        );
      }
    });
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Reporte[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM reportes WHERE fecha_generacion BETWEEN ? AND ? ORDER BY fecha_generacion DESC',
          [fechaInicio.toISOString(), fechaFin.toISOString()],
          (err: any, rows: ReporteEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToReporte(row)));
            }
          }
        );
      }
    });
  }

  async findRecent(limit: number): Promise<Reporte[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM reportes ORDER BY fecha_generacion DESC LIMIT ?',
          [limit],
          (err: any, rows: ReporteEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToReporte(row)));
            }
          }
        );
      }
    });
  }

  // Estadísticas y análisis
  async getTotalCount(): Promise<number> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM reportes',
          [],
          (err: any, row: { count: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.count);
            }
          }
        );
      }
    });
  }

  async getCountByTipo(): Promise<Record<TipoReporte, number>> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT tipo, COUNT(*) as count FROM reportes GROUP BY tipo',
          [],
          (err: any, rows: { tipo: string; count: number }[]) => {
            if (err) {
              reject(err);
            } else {
              const result: Record<string, number> = {};
              rows.forEach(row => {
                result[row.tipo] = row.count;
              });
              resolve(result as Record<TipoReporte, number>);
            }
          }
        );
      }
    });
  }

  async getCountByFecha(fecha: Date): Promise<number> {
    const database = this.db.getDatabase();
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM reportes WHERE fecha_generacion BETWEEN ? AND ?',
          [inicio.toISOString(), fin.toISOString()],
          (err: any, row: { count: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.count);
            }
          }
        );
      }
    });
  }

  async getCountByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<number> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM reportes WHERE fecha_generacion BETWEEN ? AND ?',
          [fechaInicio.toISOString(), fechaFin.toISOString()],
          (err: any, row: { count: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.count);
            }
          }
        );
      }
    });
  }

  async getAverageGenerationTime(): Promise<number> {
    // Simulación - en un sistema real se registraría el tiempo real
    return 2500; // 2.5 segundos promedio
  }

  // Operaciones de exportación
  async saveExportedData(idReporte: number, formato: string, datos: string | Buffer): Promise<void> {
    // En un sistema real, se guardaría en una tabla separada o en storage
    console.log(`Guardando datos exportados para reporte ${idReporte} en formato ${formato}`);
  }

  async getExportedData(idReporte: number, formato: string): Promise<string | Buffer | null> {
    // En un sistema real, se recuperaría desde la tabla o storage
    return null;
  }

  // Métodos de mapeo
  private mapToReporte(entity: ReporteEntity): Reporte {
    return {
      id: entity.id_reporte,
      nombre: entity.nombre,
      tipo: entity.tipo as TipoReporte,
      descripcion: entity.descripcion,
      parametros: JSON.parse(entity.parametros),
      fechaGeneracion: new Date(entity.fecha_generacion),
      datos: JSON.parse(entity.datos),
      formato: entity.formato as any
    };
  }

  private mapToReporteConDetalles(row: ReporteWithDetailsEntity): ReporteConDetalles {
    const reporte = this.mapToReporte(row);
    return {
      ...reporte,
      generador: row.usuario_nombre_usuario ? {
        id: row.id_usuario_generador || 0,
        nombreUsuario: row.usuario_nombre_usuario,
        rol: row.usuario_rol || 'Unknown'
      } : undefined,
      estadisticas: {
        tiempoGeneracion: 2500, // Simulado
        tamanoArchivo: Buffer.byteLength(JSON.stringify(reporte.datos), 'utf8'),
        descargas: 0 // Simulado
      }
    };
  }
}
