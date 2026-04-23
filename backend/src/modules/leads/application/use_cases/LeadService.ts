/**
 * Implementación del Caso de Uso de Leads
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  ILeadUseCase, 
  CrearLeadRequest, 
  ActualizarLeadRequest 
} from '../../domain/ports/driving/ILeadUseCase';
import type { ILeadRepo, CreateLeadData } from '../../domain/ports/driven/ILeadRepo';
import type { 
  Lead, 
  LeadVendedor, 
  LeadComprador, 
  TipoPersona,
  LeadAggregate,
  CrearLeadData as DominioCrearLeadData
} from '../../domain/entities/Lead';

export class LeadService implements ILeadUseCase {
  constructor(private readonly leadRepo: ILeadRepo) {}

  async listarLeadsVendedor(idUsuario: number): Promise<LeadVendedor[]> {
    return await this.leadRepo.findLeadsVendedor(idUsuario);
  }

  async listarLeadsComprador(idUsuario: number): Promise<LeadComprador[]> {
    return await this.leadRepo.findLeadsComprador(idUsuario);
  }

  async crearLead(leadData: CrearLeadRequest): Promise<Lead> {
    // Validaciones y transformaciones de negocio
    const dominioData: DominioCrearLeadData = {
      nombres: leadData.nombres,
      apellidoPaterno: leadData.apellidoPaterno,
      apellidoMaterno: leadData.apellidoMaterno,
      tipoDocumento: leadData.tipoDocumento || 'DNI',
      numeroDocumento: leadData.numeroDocumento,
      telefono: leadData.telefono,
      correo: leadData.correo,
      tipoPersona: leadData.tipoPersona as TipoPersona,
      idUsuario: leadData.idUsuario,
      estadoVendedor: leadData.estadoVendedor as any,
      estadoComprador: leadData.estadoComprador as any,
      observacion: leadData.observacion
    };

    // Usar el Aggregate Root para crear el lead
    const lead = LeadAggregate.crearLead(dominioData);

    // Guardar a través del repositorio
    const createData: CreateLeadData = {
      nombres: lead.nombres,
      apellidoPaterno: lead.apellidoPaterno,
      apellidoMaterno: lead.apellidoMaterno,
      tipoDocumento: lead.tipoDocumento,
      numeroDocumento: lead.numeroDocumento,
      telefono: lead.telefono,
      correo: lead.correo,
      tipoPersona: lead.tipoPersona,
      idUsuario: lead.idUsuario,
      estadoVendedor: lead.estadoVendedor,
      estadoComprador: lead.estadoComprador,
      observacion: lead.observacion
    };

    return await this.leadRepo.createLead(createData);
  }

  async actualizarLead(id: number, leadData: Partial<ActualizarLeadRequest>): Promise<Lead> {
    // Validar que el lead exista
    const existingLead = await this.leadRepo.findById(id);
    if (!existingLead) {
      throw new Error('Lead no encontrado');
    }

    return await this.leadRepo.update(id, leadData);
  }

  async eliminarLead(id: number): Promise<void> {
    const existingLead = await this.leadRepo.findById(id);
    if (!existingLead) {
      throw new Error('Lead no encontrado');
    }

    await this.leadRepo.delete(id);
  }

  async obtenerLeadPorId(id: number): Promise<Lead | null> {
    return await this.leadRepo.findById(id);
  }

  async convertirLead(id: number, nuevoTipo: TipoPersona): Promise<void> {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new Error('Lead no encontrado');
    }

    // Validar reglas de negocio para conversión
    if (!LeadAggregate.esValidoParaConversion(lead)) {
      throw new Error('El lead no cumple las condiciones para ser convertido');
    }

    await this.leadRepo.convertirLead(id, nuevoTipo);
  }
}
