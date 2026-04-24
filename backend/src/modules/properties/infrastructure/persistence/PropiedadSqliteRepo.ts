/**
 * Adaptador Secundario: Implementación del repositorio de Propiedades con SQLite
 * Conecta el dominio con la infraestructura de persistencia
 */

import DatabaseManager from '../../../../shared/database/connection';
import type { 
  IPropiedadRepo, 
  CreatePropiedadData 
} from '../../domain/ports/driven/IPropiedadRepo';
import type { Propiedad } from '../../domain/entities/Propiedad';
import type { 
  PropiedadEntity, 
  InteresadoEntity 
} from './PropiedadEntity';

export class PropiedadSqliteRepo implements IPropiedadRepo {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance({
      type: 'sqlite',
      url: './database.sqlite'
    });
  }

  async findById(id: number): Promise<Propiedad | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM propiedades WHERE id_propiedad = ?',
          [id],
          (err: any, row: PropiedadEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToPropiedad(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAll(): Promise<Propiedad[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM propiedades ORDER BY direccion',
          [],
          (err: any, rows: PropiedadEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToPropiedad(row)));
            }
          }
        );
      }
    });
  }

  async save(propiedad: Propiedad): Promise<Propiedad> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO propiedades (
            direccion, descripcion, medidas, servicios_basicos, 
            precio_negociable, partida_registral
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            propiedad.direccion,
            propiedad.descripcion,
            propiedad.medidas,
            propiedad.serviciosBasicos,
            propiedad.precioNegociable,
            propiedad.partidaRegistral
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...propiedad,
                id: this.lastID
              });
            }
          }
        );
      }
    });
  }

  async update(id: number, propiedad: Partial<Propiedad>): Promise<Propiedad> {
    const database = this.db.getDatabase();
    const existingPropiedad = await this.findById(id);
    
    if (!existingPropiedad) {
      throw new Error('Propiedad no encontrada');
    }

    const updatedPropiedad = { ...existingPropiedad, ...propiedad };
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `UPDATE propiedades SET 
            direccion = ?, descripcion = ?, medidas = ?, 
            servicios_basicos = ?, precio_negociable = ?, partida_registral = ?
          WHERE id_propiedad = ?`,
          [
            updatedPropiedad.direccion,
            updatedPropiedad.descripcion,
            updatedPropiedad.medidas,
            updatedPropiedad.serviciosBasicos,
            updatedPropiedad.precioNegociable,
            updatedPropiedad.partidaRegistral,
            id
          ],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedPropiedad);
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
          'DELETE FROM propiedades WHERE id_propiedad = ?',
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

  async registrarInteres(idPersona: number, idPropiedad: number): Promise<void> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'INSERT OR REPLACE INTO interesados (id_propiedad, id_persona, vendido, separado) VALUES (?, ?, ?, ?)',
          [idPropiedad, idPersona, false, false],
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

  async findPropiedadesInteresadas(idPersona: number): Promise<Propiedad[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT p.* FROM propiedades p
           INNER JOIN interesados i ON p.id_propiedad = i.id_propiedad
           WHERE i.id_persona = ?
           ORDER BY p.direccion`,
          [idPersona],
          (err: any, rows: PropiedadEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToPropiedad(row)));
            }
          }
        );
      }
    });
  }

  async actualizarEstadoPropiedad(idPropiedad: number, vendido: boolean, separado: boolean): Promise<void> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'UPDATE interesados SET vendido = ?, separado = ? WHERE id_propiedad = ?',
          [vendido, separado, idPropiedad],
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

  // Métodos de mapeo entre entidades de persistencia y dominio
  private mapToPropiedad(entity: PropiedadEntity): Propiedad {
    return {
      id: entity.id_propiedad,
      direccion: entity.direccion,
      descripcion: entity.descripcion,
      medidas: entity.medidas,
      serviciosBasicos: entity.servicios_basicos,
      precioNegociable: entity.precio_negociable,
      partidaRegistral: entity.partida_registral
    };
  }

  private mapToPersistence(propiedad: Propiedad): PropiedadEntity {
    return {
      id_propiedad: propiedad.id,
      direccion: propiedad.direccion,
      descripcion: propiedad.descripcion,
      medidas: propiedad.medidas,
      servicios_basicos: propiedad.serviciosBasicos,
      precio_negociable: propiedad.precioNegociable,
      partida_registral: propiedad.partidaRegistral
    };
  }
}
