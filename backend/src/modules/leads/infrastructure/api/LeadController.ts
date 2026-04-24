/**
 * Adaptador Primario: LeadController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { ILeadUseCase } from '../../domain/ports/driving/ILeadUseCase';
import type { CrearLeadRequest, ActualizarLeadRequest } from '../../domain/ports/driving/ILeadUseCase';

export class LeadController {
  constructor(private readonly leadUseCase: ILeadUseCase) {}

  // Endpoint para listar leads de vendedor
  async listarLeadsVendedor(event: any): Promise<any> {
    try {
      const user = event.context.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: "Usuario no autenticado"
        });
      }

      const leads = await this.leadUseCase.listarLeadsVendedor(user.id);
      
      return {
        status: "success",
        message: "Leads listados exitosamente",
        data: leads
      };
    } catch (error) {
      console.error('Error al listar leads de vendedor:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener leads"
      });
    }
  }

  // Endpoint para listar leads de comprador
  async listarLeadsComprador(event: any): Promise<any> {
    try {
      const user = event.context.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: "Usuario no autenticado"
        });
      }

      const leads = await this.leadUseCase.listarLeadsComprador(user.id);
      
      return {
        status: "success",
        message: "Leads listados exitosamente",
        data: leads
      };
    } catch (error) {
      console.error('Error al listar leads de comprador:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener leads"
      });
    }
  }

  // Endpoint para crear lead
  async crearLead(event: any): Promise<any> {
    try {
      const body = await readBody<CrearLeadRequest>(event);
      
      // Validaciones básicas
      this.validarCrearLeadRequest(body);

      const lead = await this.leadUseCase.crearLead(body);
      
      return {
        status: "success",
        message: "Lead creado exitosamente",
        data: lead
      };
    } catch (error) {
      console.error('Error al crear lead:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al crear lead"
      });
    }
  }

  // Endpoint para actualizar lead
  async actualizarLead(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de lead inválido"
        });
      }

      const body = await readBody<Partial<ActualizarLeadRequest>>(event);
      
      const lead = await this.leadUseCase.actualizarLead(id, body);
      
      return {
        status: "success",
        message: "Lead actualizado exitosamente",
        data: lead
      };
    } catch (error) {
      console.error('Error al actualizar lead:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar lead"
      });
    }
  }

  // Endpoint para eliminar lead
  async eliminarLead(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de lead inválido"
        });
      }

      await this.leadUseCase.eliminarLead(id);
      
      return {
        status: "success",
        message: "Lead eliminado exitosamente"
      };
    } catch (error) {
      console.error('Error al eliminar lead:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al eliminar lead"
      });
    }
  }

  // Endpoint para obtener lead por ID
  async obtenerLeadPorId(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de lead inválido"
        });
      }

      const lead = await this.leadUseCase.obtenerLeadPorId(id);
      
      if (!lead) {
        throw createError({
          statusCode: 404,
          message: "Lead no encontrado"
        });
      }
      
      return {
        status: "success",
        message: "Lead obtenido exitosamente",
        data: lead
      };
    } catch (error) {
      console.error('Error al obtener lead:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al obtener lead"
      });
    }
  }

  // Endpoint para convertir lead
  async convertirLead(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de lead inválido"
        });
      }

      const body = await readBody<{ nuevoTipo: string }>(event);
      
      if (!body.nuevoTipo) {
        throw createError({
          statusCode: 400,
          message: "Tipo de conversión es requerido"
        });
      }

      await this.leadUseCase.convertirLead(id, body.nuevoTipo as any);
      
      return {
        status: "success",
        message: "Lead convertido exitosamente"
      };
    } catch (error) {
      console.error('Error al convertir lead:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al convertir lead"
      });
    }
  }

  // Métodos de validación
  private validarCrearLeadRequest(data: CrearLeadRequest): void {
    if (!data.nombres?.trim()) {
      throw new Error('Los nombres son requeridos');
    }
    if (!data.apellidoPaterno?.trim()) {
      throw new Error('El apellido paterno es requerido');
    }
    if (!data.numeroDocumento?.trim()) {
      throw new Error('El número de documento es requerido');
    }
    if (!data.telefono?.trim()) {
      throw new Error('El teléfono es requerido');
    }
    if (!data.tipoPersona?.trim()) {
      throw new Error('El tipo de persona es requerido');
    }
    if (!data.idUsuario || data.idUsuario <= 0) {
      throw new Error('El ID de usuario es requerido');
    }
  }
}
