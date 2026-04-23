/**
 * Adaptador Primario: ContractController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { IContractUseCase } from '../../domain/ports/driving/IContractUseCase';
import type { 
  CrearContratoRequest, 
  ActualizarContratoRequest,
  FirmarContratoRequest,
  CancelarContratoRequest
} from '../../domain/ports/driving/IContractUseCase';

export class ContractController {
  constructor(private readonly contractUseCase: IContractUseCase) {}

  // Endpoint para listar contratos
  async listarContratos(event: any): Promise<any> {
    try {
      const contratos = await this.contractUseCase.listarContratos();
      
      return {
        status: "success",
        message: "Contratos listados exitosamente",
        data: contratos
      };
    } catch (error) {
      console.error('Error al listar contratos:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener contratos"
      });
    }
  }

  // Endpoint para crear contrato
  async crearContrato(event: any): Promise<any> {
    try {
      const body = await readBody<CrearContratoRequest>(event);
      
      // Validaciones básicas
      this.validarCrearContratoRequest(body);

      const contrato = await this.contractUseCase.crearContrato(body);
      
      return {
        status: "success",
        message: "Contrato creado exitosamente",
        data: contrato
      };
    } catch (error) {
      console.error('Error al crear contrato:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al crear contrato"
      });
    }
  }

  // Endpoint para actualizar contrato
  async actualizarContrato(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de contrato inválido"
        });
      }

      const body = await readBody<Partial<ActualizarContratoRequest>>(event);
      
      const contrato = await this.contractUseCase.actualizarContrato(id, body);
      
      return {
        status: "success",
        message: "Contrato actualizado exitosamente",
        data: contrato
      };
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar contrato"
      });
    }
  }

  // Endpoint para eliminar contrato
  async eliminarContrato(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de contrato inválido"
        });
      }

      await this.contractUseCase.eliminarContrato(id);
      
      return {
        status: "success",
        message: "Contrato eliminado exitosamente"
      };
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al eliminar contrato"
      });
    }
  }

  // Endpoint para obtener contrato por ID
  async obtenerContratoPorId(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de contrato inválido"
        });
      }

      const contrato = await this.contractUseCase.obtenerContratoPorId(id);
      
      if (!contrato) {
        throw createError({
          statusCode: 404,
          message: "Contrato no encontrado"
        });
      }
      
      return {
        status: "success",
        message: "Contrato obtenido exitosamente",
        data: contrato
      };
    } catch (error) {
      console.error('Error al obtener contrato:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al obtener contrato"
      });
    }
  }

  // Endpoint para firmar contrato
  async firmarContrato(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de contrato inválido"
        });
      }

      const body = await readBody<FirmarContratoRequest>(event);
      
      const contrato = await this.contractUseCase.firmarContrato(id, body.fechaFirma);
      
      return {
        status: "success",
        message: "Contrato firmado exitosamente",
        data: contrato
      };
    } catch (error) {
      console.error('Error al firmar contrato:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al firmar contrato"
      });
    }
  }

  // Endpoint para cancelar contrato
  async cancelarContrato(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de contrato inválido"
        });
      }

      const body = await readBody<CancelarContratoRequest>(event);
      
      const contrato = await this.contractUseCase.cancelarContrato(id, body.motivo);
      
      return {
        status: "success",
        message: "Contrato cancelado exitosamente",
        data: contrato
      };
    } catch (error) {
      console.error('Error al cancelar contrato:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al cancelar contrato"
      });
    }
  }

  // Endpoint para completar contrato
  async completarContrato(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de contrato inválido"
        });
      }

      const contrato = await this.contractUseCase.completarContrato(id);
      
      return {
        status: "success",
        message: "Contrato completado exitosamente",
        data: contrato
      };
    } catch (error) {
      console.error('Error al completar contrato:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al completar contrato"
      });
    }
  }

  // Endpoint para listar contratos por estado
  async listarContratosPorEstado(event: any): Promise<any> {
    try {
      const estado = getRouterParam(event, 'estado') as string;
      
      if (!estado) {
        throw createError({
          statusCode: 400,
          message: "Estado es requerido"
        });
      }

      const contratos = await this.contractUseCase.listarContratosPorEstado(estado as any);
      
      return {
        status: "success",
        message: "Contratos listados exitosamente",
        data: contratos
      };
    } catch (error) {
      console.error('Error al listar contratos por estado:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener contratos por estado"
      });
    }
  }

  // Endpoint para listar contratos por persona
  async listarContratosPorPersona(event: any): Promise<any> {
    try {
      const idPersona = parseInt(getRouterParam(event, 'idPersona') || '0');
      if (idPersona === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de persona inválido"
        });
      }

      const contratos = await this.contractUseCase.listarContratosPorPersona(idPersona);
      
      return {
        status: "success",
        message: "Contratos listados exitosamente",
        data: contratos
      };
    } catch (error) {
      console.error('Error al listar contratos por persona:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener contratos por persona"
      });
    }
  }

  // Endpoint para listar contratos por propiedad
  async listarContratosPorPropiedad(event: any): Promise<any> {
    try {
      const idPropiedad = parseInt(getRouterParam(event, 'idPropiedad') || '0');
      if (idPropiedad === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de propiedad inválido"
        });
      }

      const contratos = await this.contractUseCase.listarContratosPorPropiedad(idPropiedad);
      
      return {
        status: "success",
        message: "Contratos listados exitosamente",
        data: contratos
      };
    } catch (error) {
      console.error('Error al listar contratos por propiedad:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener contratos por propiedad"
      });
    }
  }

  // Endpoint para obtener contratos con detalles
  async obtenerContratosConDetalles(event: any): Promise<any> {
    try {
      const contratos = await this.contractUseCase.obtenerContratosConDetalles();
      
      return {
        status: "success",
        message: "Contratos con detalles listados exitosamente",
        data: contratos
      };
    } catch (error) {
      console.error('Error al obtener contratos con detalles:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener contratos con detalles"
      });
    }
  }

  // Métodos de validación
  private validarCrearContratoRequest(data: CrearContratoRequest): void {
    if (!data.idPropiedad || data.idPropiedad <= 0) {
      throw new Error('El ID de propiedad es requerido');
    }
    if (!data.idPersona || data.idPersona <= 0) {
      throw new Error('El ID de persona es requerido');
    }
    if (data.monto !== undefined && data.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    if (data.monto !== undefined && data.monto > 10000000) {
      throw new Error('El monto no puede exceder el límite permitido');
    }
  }
}
