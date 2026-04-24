/**
 * Adaptador Secundario: Implementación del repositorio de Leads con SQLite
 * Conecta el dominio con la infraestructura de persistencia
 */

import DatabaseManager from '../../../../shared/database/connection';
import type { 
  ILeadRepo, 
  CreateLeadData 
} from '../../domain/ports/driven/ILeadRepo';
import type { 
  Lead, 
  LeadVendedor, 
  LeadComprador, 
  TipoPersona 
} from '../../domain/entities/Lead';
import type { 
  LeadEntity, 
  UsuarioVendedorEntity, 
  UsuarioCompradorEntity,
  LeadVendedorEntity,
  LeadCompradorEntity
} from './LeadEntity';

export class LeadSqliteRepo implements ILeadRepo {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance({
      type: 'sqlite',
      url: './database.sqlite'
    });
  }

  async findById(id: number): Promise<Lead | null> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).get(
          'SELECT * FROM personas WHERE id_persona = ?',
          [id],
          (err: any, row: LeadEntity) => {
            if (err) {
              reject(err);
            } else if (row) {
              resolve(this.mapToLead(row));
            } else {
              resolve(null);
            }
          }
        );
      }
    });
  }

  async save(lead: Lead): Promise<Lead> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `INSERT INTO personas (
            nombres, apellido_paterno, apellido_materno, tipo_documento, 
            numero_documento, telefono, correo, tipo_persona, fecha_creacion
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            lead.nombres,
            lead.apellidoPaterno,
            lead.apellidoMaterno,
            lead.tipoDocumento,
            lead.numeroDocumento,
            lead.telefono,
            lead.correo,
            lead.tipoPersona,
            lead.fechaCreacion.toISOString()
          ],
          function(err: any) {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...lead,
                id: this.lastID
              });
            }
          }
        );
      }
    });
  }

  async update(id: number, lead: Partial<Lead>): Promise<Lead> {
    const database = this.db.getDatabase();
    const existingLead = await this.findById(id);
    
    if (!existingLead) {
      throw new Error('Lead no encontrado');
    }

    const updatedLead = { ...existingLead, ...lead };
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          `UPDATE personas SET 
            nombres = ?, apellido_paterno = ?, apellido_materno = ?, 
            tipo_documento = ?, numero_documento = ?, telefono = ?, 
            correo = ?, tipo_persona = ?
          WHERE id_persona = ?`,
          [
            updatedLead.nombres,
            updatedLead.apellidoPaterno,
            updatedLead.apellidoMaterno,
            updatedLead.tipoDocumento,
            updatedLead.numeroDocumento,
            updatedLead.telefono,
            updatedLead.correo,
            updatedLead.tipoPersona,
            id
          ],
          (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedLead);
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
          'DELETE FROM personas WHERE id_persona = ?',
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

  async findLeadsVendedor(idUsuario: number): Promise<LeadVendedor[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT p.*, uv.estado_vendedor, uv.observacion as observacion_vendedor, uv.id_usuario
           FROM personas p
           INNER JOIN usuarios_vendedores uv ON p.id_persona = uv.id_persona
           WHERE uv.id_usuario = ?`,
          [idUsuario],
          (err: any, rows: LeadVendedorEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToLeadVendedor(row)));
            }
          }
        );
      }
    });
  }

  async findLeadsComprador(idUsuario: number): Promise<LeadComprador[]> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).all(
          `SELECT p.*, uc.estado_comprador, uc.observacion as observacion_comprador, uc.id_usuario
           FROM personas p
           INNER JOIN usuarios_compradores uc ON p.id_persona = uc.id_persona
           WHERE uc.id_usuario = ?`,
          [idUsuario],
          (err: any, rows: LeadCompradorEntity[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows.map(row => this.mapToLeadComprador(row)));
            }
          }
        );
      }
    });
  }

  async createLead(leadData: CreateLeadData): Promise<Lead> {
    // Crear persona primero
    const lead: Lead = {
      id: 0,
      nombres: leadData.nombres,
      apellidoPaterno: leadData.apellidoPaterno,
      apellidoMaterno: leadData.apellidoMaterno,
      tipoDocumento: leadData.tipoDocumento,
      numeroDocumento: leadData.numeroDocumento,
      telefono: leadData.telefono,
      correo: leadData.correo,
      tipoPersona: leadData.tipoPersona,
      fechaCreacion: new Date(),
      idUsuario: leadData.idUsuario,
      estadoVendedor: leadData.estadoVendedor as any,
      estadoComprador: leadData.estadoComprador as any,
      observacion: leadData.observacion
    };

    const savedLead = await this.save(lead);

    // Crear relación de vendedor o comprador según corresponda
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        if (leadData.estadoVendedor) {
          (database as any).run(
            'INSERT INTO usuarios_vendedores (id_persona, id_usuario, estado_vendedor, observacion) VALUES (?, ?, ?, ?)',
            [savedLead.id, leadData.idUsuario, leadData.estadoVendedor, leadData.observacion],
            (err: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(savedLead);
              }
            }
          );
        } else if (leadData.estadoComprador) {
          (database as any).run(
            'INSERT INTO usuarios_compradores (id_persona, id_usuario, estado_comprador, observacion) VALUES (?, ?, ?, ?)',
            [savedLead.id, leadData.idUsuario, leadData.estadoComprador, leadData.observacion],
            (err: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(savedLead);
              }
            }
          );
        } else {
          resolve(savedLead);
        }
      }
    });
  }

  async convertirLead(id: number, nuevoTipo: TipoPersona): Promise<void> {
    const database = this.db.getDatabase();
    
    return new Promise((resolve, reject) => {
      if (this.db.isSQLite()) {
        (database as any).run(
          'UPDATE personas SET tipo_persona = ? WHERE id_persona = ?',
          [nuevoTipo, id],
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
  private mapToLead(entity: LeadEntity): Lead {
    return {
      id: entity.id_persona,
      nombres: entity.nombres,
      apellidoPaterno: entity.apellido_paterno,
      apellidoMaterno: entity.apellido_materno,
      tipoDocumento: entity.tipo_documento,
      numeroDocumento: entity.numero_documento,
      telefono: entity.telefono,
      correo: entity.correo,
      tipoPersona: entity.tipo_persona as TipoPersona,
      fechaCreacion: new Date(entity.fecha_creacion),
      idUsuario: 0, // Se obtiene de las relaciones
      observacion: null
    };
  }

  private mapToLeadVendedor(row: LeadVendedorEntity): LeadVendedor {
    return {
      id: row.id_persona,
      nombres: row.nombres,
      apellidoPaterno: row.apellido_paterno,
      apellidoMaterno: row.apellido_materno,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      telefono: row.telefono,
      correo: row.correo,
      tipoPersona: row.tipo_persona as TipoPersona,
      fechaCreacion: new Date(row.fecha_creacion),
      estadoVendedor: row.estado_vendedor as any,
      observacion: row.observacion_vendedor,
      idUsuario: row.id_usuario
    };
  }

  private mapToLeadComprador(row: LeadCompradorEntity): LeadComprador {
    return {
      id: row.id_persona,
      nombres: row.nombres,
      apellidoPaterno: row.apellido_paterno,
      apellidoMaterno: row.apellido_materno,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      telefono: row.telefono,
      correo: row.correo,
      tipoPersona: row.tipo_persona as TipoPersona,
      fechaCreacion: new Date(row.fecha_creacion),
      estadoComprador: row.estado_comprador as any,
      observacion: row.observacion_comprador,
      idUsuario: row.id_usuario
    };
  }
}
