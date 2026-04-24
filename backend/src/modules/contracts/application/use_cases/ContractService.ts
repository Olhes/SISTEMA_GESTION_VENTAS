/**
 * Implementación del Caso de Uso de Contratos
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  IContractUseCase, 
  CrearContratoRequest, 
  ActualizarContratoRequest,
  FirmarContratoRequest,
  CancelarContratoRequest
} from '../../domain/ports/driving/IContractUseCase';
import type { IContractRepo, CreateContractData } from '../../domain/ports/driven/IContractRepo';
import type { 
  Contrato,
  ContratoConDetalles,
  EstadoContrato,
  CrearContratoData as DominioCrearContratoData,
  ActualizarContratoData as DominioActualizarContratoData
} from '../../domain/entities/Contract';
import { ContractAggregate } from '../../domain/entities/Contract';

export class ContractService implements IContractUseCase {
  constructor(private readonly contractRepo: IContractRepo) {}

  async listarContratos(): Promise<Contrato[]> {
    return await this.contractRepo.findAll();
  }

  async crearContrato(contratoData: CrearContratoRequest): Promise<Contrato> {
    // Validaciones de negocio
    const propiedadDisponible = await this.contractRepo.propiedadDisponible(contratoData.idPropiedad);
    if (!propiedadDisponible) {
      throw new Error('La propiedad no está disponible para contratos');
    }

    const personaValida = await this.contractRepo.personaValida(contratoData.idPersona);
    if (!personaValida) {
      throw new Error('La persona no es válida para contratos');
    }

    // Transformar datos para el dominio
    const dominioData: DominioCrearContratoData = {
      idPropiedad: contratoData.idPropiedad,
      idPersona: contratoData.idPersona,
      monto: contratoData.monto,
      condiciones: contratoData.condiciones,
      observaciones: contratoData.observaciones
    };

    // Usar el Aggregate Root para crear el contrato
    const contrato = ContractAggregate.crearContrato(dominioData);

    // Guardar a través del repositorio
    const createData: CreateContractData = {
      fecha_emision: contrato.fechaEmision.toISOString(),
      id_propiedad: contrato.idPropiedad,
      id_persona: contrato.idPersona,
      estado: contrato.estado,
      monto: contrato.monto,
      condiciones: contrato.condiciones,
      fecha_firma: contrato.fechaFirma?.toISOString(),
      observaciones: contrato.observaciones
    };

    return await this.contractRepo.save(contrato);
  }

  async actualizarContrato(id: number, contratoData: Partial<ActualizarContratoRequest>): Promise<Contrato> {
    // Validar que el contrato exista y pueda ser modificado
    const existingContrato = await this.contractRepo.findById(id);
    if (!existingContrato) {
      throw new Error('Contrato no encontrado');
    }

    if (!ContractAggregate.puedeSerModificado(existingContrato)) {
      throw new Error('El contrato no puede ser modificado en su estado actual');
    }

    const dominioData: Partial<DominioActualizarContratoData> = {
      monto: contratoData.monto,
      condiciones: contratoData.condiciones,
      observaciones: contratoData.observaciones
    };

    return await this.contractRepo.update(id, dominioData);
  }

  async eliminarContrato(id: number): Promise<void> {
    const existingContrato = await this.contractRepo.findById(id);
    if (!existingContrato) {
      throw new Error('Contrato no encontrado');
    }

    if (!ContractAggregate.puedeSerModificado(existingContrato)) {
      throw new Error('No se puede eliminar un contrato que no está en estado Pendiente');
    }

    await this.contractRepo.delete(id);
  }

  async obtenerContratoPorId(id: number): Promise<Contrato | null> {
    return await this.contractRepo.findById(id);
  }

  async firmarContrato(id: number, fechaFirma?: Date): Promise<Contrato> {
    const contrato = await this.contractRepo.findById(id);
    if (!contrato) {
      throw new Error('Contrato no encontrado');
    }

    const contratoFirmado = ContractAggregate.firmarContrato(contrato, fechaFirma);
    return await this.contractRepo.update(id, { 
      estado: contratoFirmado.estado,
      fechaFirma: contratoFirmado.fechaFirma
    });
  }

  async cancelarContrato(id: number, motivo?: string): Promise<Contrato> {
    const contrato = await this.contractRepo.findById(id);
    if (!contrato) {
      throw new Error('Contrato no encontrado');
    }

    const contratoCancelado = ContractAggregate.cancelarContrato(contrato, motivo);
    return await this.contractRepo.update(id, { 
      estado: contratoCancelado.estado,
      observaciones: contratoCancelado.observaciones
    });
  }

  async completarContrato(id: number): Promise<Contrato> {
    const contrato = await this.contractRepo.findById(id);
    if (!contrato) {
      throw new Error('Contrato no encontrado');
    }

    const contratoCompletado = ContractAggregate.completarContrato(contrato);
    return await this.contractRepo.update(id, { 
      estado: contratoCompletado.estado
    });
  }

  async listarContratosPorEstado(estado: EstadoContrato): Promise<Contrato[]> {
    return await this.contractRepo.findByEstado(estado);
  }

  async listarContratosPorPersona(idPersona: number): Promise<ContratoConDetalles[]> {
    return await this.contractRepo.findByPersona(idPersona);
  }

  async listarContratosPorPropiedad(idPropiedad: number): Promise<ContratoConDetalles[]> {
    return await this.contractRepo.findByPropiedad(idPropiedad);
  }

  async obtenerContratosConDetalles(): Promise<ContratoConDetalles[]> {
    return await this.contractRepo.findAllWithDetalles();
  }
}
