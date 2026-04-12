import type { Contrato, Propiedad, Persona, ApiResponse } from '~/src/shared/types';

export class ContractsService {
  async generarContrato(idPersona: number, idPropiedad: number): Promise<Contrato> {
    const newContrato: Contrato = {
      id_contrato: Date.now(),
      fecha_emision: new Date().toISOString(),
      id_propiedad: idPropiedad,
      id_persona: idPersona
    };
    return newContrato;
  }

  async listarContratos(): Promise<Contrato[]> {
    return [];
  }

  async obtenerContratoPorId(id: number): Promise<Contrato | null> {
    return null;
  }
}

export const contractsService = new ContractsService();
