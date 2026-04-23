/**
 * Adaptador Secundario: Implementación del repositorio de Contratos con SQLite
 * Conecta el dominio con la infraestructura de persistencia
 */

import DatabaseManager from '../../../../shared/database/connection';
import type { 
  IContractRepo, 
  CreateContractData 
} from '../../domain/ports/driven/IContractRepo';
import type { 
  Contrato, 
  ContratoConDetalles,
  EstadoContrato 
} from '../../domain/entities/Contract';
import type { 
  ContractEntity, 
  ContractWithDetailsEntity 
} from './ContractEntity';

export class ContractSqliteRepo implements IContractRepo {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance({
      type: 'sqlite',
      url: './database.sqlite'
    });
  }

  async findById(id: number): Promise<Contrato | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM contratos WHERE id_contrato = ?',
          [id],
          (err: any, row: ContractEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToContrato(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async findAll(): Promise<Contrato[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM contratos ORDER BY fecha_emision DESC',
          [],
          (err: any, rows: ContractEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToContrato(row)));
            }
          }
        );
      }
    });
  }

  async save(contrato: Contrato): Promise<Contrato> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO contratos (
            fecha_emision, id_propiedad, id_persona, estado, 
            monto, condiciones, fecha_firma, observaciones
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            contrato.fechaEmision.toISOString(),
            contrato.idPropiedad,
            contrato.idPersona,
            contrato.estado,
            contrato.monto || null,
            contrato.condiciones || null,
            contrato.fechaFirma?.toISOString() || null,
            contrato.observaciones || null
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...contrato,
                id: this.lastID
              });
            }
          }
        );
      }
    });
  }

  async update(id: number, contrato: Partial<Contrato>): Promise<Contrato> {
    const database = this.db.getDatabase();
    const existingContrato = await this.findById(id);
    
    if (!existingContrato) {
      throw new Error('Contrato no encontrado');
    }

    const updatedContrato = { ...existingContrato, ...contrato };
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `UPDATE contratos SET 
            estado = ?, monto = ?, condiciones = ?, 
            fecha_firma = ?, observaciones = ?
          WHERE id_contrato = ?`,
          [
            updatedContrato.estado,
            updatedContrato.monto || null,
            updatedContrato.condiciones || null,
            updatedContrato.fechaFirma?.toISOString() || null,
            updatedContrato.observaciones || null,
            id
          ],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedContrato);
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
          'DELETE FROM contratos WHERE id_contrato = ?',
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

  async findByEstado(estado: EstadoContrato): Promise<Contrato[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          'SELECT * FROM contratos WHERE estado = ? ORDER BY fecha_emision DESC',
          [estado],
          (err: any, rows: ContractEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToContrato(row)));
            }
          }
        );
      }
    });
  }

  async findByPersona(idPersona: number): Promise<ContratoConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.direccion as propiedad_direccion, 
                  p.precio_negociable as propiedad_precio_negociable,
                  per.nombres as persona_nombres,
                  per.apellido_paterno as persona_apellido_paterno,
                  per.apellido_materno as persona_apellido_materno,
                  per.tipo_documento as persona_tipo_documento,
                  per.numero_documento as persona_numero_documento
           FROM contratos c
           INNER JOIN propiedades p ON c.id_propiedad = p.id_propiedad
           INNER JOIN personas per ON c.id_persona = per.id_persona
           WHERE c.id_persona = ?
           ORDER BY c.fecha_emision DESC`,
          [idPersona],
          (err: any, rows: ContractWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToContratoConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async findByPropiedad(idPropiedad: number): Promise<ContratoConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.direccion as propiedad_direccion, 
                  p.precio_negociable as propiedad_precio_negociable,
                  per.nombres as persona_nombres,
                  per.apellido_paterno as persona_apellido_paterno,
                  per.apellido_materno as persona_apellido_materno,
                  per.tipo_documento as persona_tipo_documento,
                  per.numero_documento as persona_numero_documento
           FROM contratos c
           INNER JOIN propiedades p ON c.id_propiedad = p.id_propiedad
           INNER JOIN personas per ON c.id_persona = per.id_persona
           WHERE c.id_propiedad = ?
           ORDER BY c.fecha_emision DESC`,
          [idPropiedad],
          (err: any, rows: ContractWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToContratoConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async findAllWithDetalles(): Promise<ContratoConDetalles[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT c.*, 
                  p.direccion as propiedad_direccion, 
                  p.precio_negociable as propiedad_precio_negociable,
                  per.nombres as persona_nombres,
                  per.apellido_paterno as persona_apellido_paterno,
                  per.apellido_materno as persona_apellido_materno,
                  per.tipo_documento as persona_tipo_documento,
                  per.numero_documento as persona_numero_documento
           FROM contratos c
           INNER JOIN propiedades p ON c.id_propiedad = p.id_propiedad
           INNER JOIN personas per ON c.id_persona = per.id_persona
           ORDER BY c.fecha_emision DESC`,
          [],
          (err: any, rows: ContractWithDetailsEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToContratoConDetalles(row)));
            }
          }
        );
      }
    });
  }

  async propiedadDisponible(idPropiedad: number): Promise<boolean> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT COUNT(*) as count FROM contratos WHERE id_propiedad = ? AND estado IN ("Firmado", "Completado")',
          [idPropiedad],
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

  // Métodos de mapeo entre entidades de persistencia y dominio
  private mapToContrato(entity: ContractEntity): Contrato {
    return {
      id: entity.id_contrato,
      fechaEmision: new Date(entity.fecha_emision),
      idPropiedad: entity.id_propiedad,
      idPersona: entity.id_persona,
      estado: entity.estado as EstadoContrato,
      monto: entity.monto || undefined,
      condiciones: entity.condiciones || undefined,
      fechaFirma: entity.fecha_firma ? new Date(entity.fecha_firma) : null,
      observaciones: entity.observaciones
    };
  }

  private mapToContratoConDetalles(row: ContractWithDetailsEntity): ContratoConDetalles {
    const contrato = this.mapToContrato(row);
    return {
      ...contrato,
      propiedad: {
        id: row.id_propiedad,
        direccion: row.propiedad_direccion,
        precioNegociable: row.propiedad_precio_negociable
      },
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidoPaterno: row.persona_apellido_paterno,
        apellidoMaterno: row.persona_apellido_materno,
        tipoDocumento: row.persona_tipo_documento,
        numeroDocumento: row.persona_numero_documento
      }
    };
  }
}
