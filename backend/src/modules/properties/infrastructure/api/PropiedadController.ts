/**
 * Adaptador Primario: PropiedadController
 * Recibe requests HTTP e invoca el caso de uso
 * No contiene lógica de negocio, solo orquestación HTTP
 */

import type { IPropiedadUseCase } from '../../domain/ports/driving/IPropiedadUseCase';
import type { CrearPropiedadRequest, ActualizarPropiedadRequest } from '../../domain/ports/driving/IPropiedadUseCase';

export class PropiedadController {
  constructor(private readonly propiedadUseCase: IPropiedadUseCase) {}

  // Endpoint para listar propiedades
  async listarPropiedades(event: any): Promise<any> {
    try {
      const propiedades = await this.propiedadUseCase.listarPropiedades();
      
      return {
        status: "success",
        message: "Propiedades listadas exitosamente",
        data: propiedades
      };
    } catch (error) {
      console.error('Error al listar propiedades:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener propiedades"
      });
    }
  }

  // Endpoint para crear propiedad
  async crearPropiedad(event: any): Promise<any> {
    try {
      const body = await readBody<CrearPropiedadRequest>(event);
      
      // Validaciones básicas
      this.validarCrearPropiedadRequest(body);

      const propiedad = await this.propiedadUseCase.crearPropiedad(body);
      
      return {
        status: "success",
        message: "Propiedad creada exitosamente",
        data: propiedad
      };
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al crear propiedad"
      });
    }
  }

  // Endpoint para actualizar propiedad
  async actualizarPropiedad(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de propiedad inválido"
        });
      }

      const body = await readBody<Partial<ActualizarPropiedadRequest>>(event);
      
      const propiedad = await this.propiedadUseCase.actualizarPropiedad(id, body);
      
      return {
        status: "success",
        message: "Propiedad actualizada exitosamente",
        data: propiedad
      };
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar propiedad"
      });
    }
  }

  // Endpoint para eliminar propiedad
  async eliminarPropiedad(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de propiedad inválido"
        });
      }

      await this.propiedadUseCase.eliminarPropiedad(id);
      
      return {
        status: "success",
        message: "Propiedad eliminada exitosamente"
      };
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al eliminar propiedad"
      });
    }
  }

  // Endpoint para obtener propiedad por ID
  async obtenerPropiedadPorId(event: any): Promise<any> {
    try {
      const id = parseInt(getRouterParam(event, 'id') || '0');
      if (id === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de propiedad inválido"
        });
      }

      const propiedad = await this.propiedadUseCase.obtenerPropiedadPorId(id);
      
      if (!propiedad) {
        throw createError({
          statusCode: 404,
          message: "Propiedad no encontrada"
        });
      }
      
      return {
        status: "success",
        message: "Propiedad obtenida exitosamente",
        data: propiedad
      };
    } catch (error) {
      console.error('Error al obtener propiedad:', error);
      throw createError({
        statusCode: 404,
        message: error instanceof Error ? error.message : "Error al obtener propiedad"
      });
    }
  }

  // Endpoint para registrar interés en propiedad
  async registrarInteres(event: any): Promise<any> {
    try {
      const body = await readBody<{ idPersona: number; idPropiedad: number }>(event);
      
      if (!body.idPersona || !body.idPropiedad) {
        throw createError({
          statusCode: 400,
          message: "ID de persona y propiedad son requeridos"
        });
      }

      await this.propiedadUseCase.registrarInteres(body.idPersona, body.idPropiedad);
      
      return {
        status: "success",
        message: "Interés registrado exitosamente"
      };
    } catch (error) {
      console.error('Error al registrar interés:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al registrar interés"
      });
    }
  }

  // Endpoint para listar propiedades interesadas por una persona
  async listarPropiedadesInteresadas(event: any): Promise<any> {
    try {
      const idPersona = parseInt(getRouterParam(event, 'idPersona') || '0');
      if (idPersona === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de persona inválido"
        });
      }

      const propiedades = await this.propiedadUseCase.listarPropiedadesInteresadas(idPersona);
      
      return {
        status: "success",
        message: "Propiedades interesadas listadas exitosamente",
        data: propiedades
      };
    } catch (error) {
      console.error('Error al listar propiedades interesadas:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : "Error al obtener propiedades interesadas"
      });
    }
  }

  // Endpoint para actualizar estado de propiedad
  async actualizarEstadoPropiedad(event: any): Promise<any> {
    try {
      const idPropiedad = parseInt(getRouterParam(event, 'id') || '0');
      if (idPropiedad === 0) {
        throw createError({
          statusCode: 400,
          message: "ID de propiedad inválido"
        });
      }

      const body = await readBody<{ vendido: boolean; separado: boolean }>(event);
      
      if (typeof body.vendido !== 'boolean' || typeof body.separado !== 'boolean') {
        throw createError({
          statusCode: 400,
          message: "Los campos vendido y separado son requeridos y deben ser booleanos"
        });
      }

      await this.propiedadUseCase.actualizarEstadoPropiedad(idPropiedad, body.vendido, body.separado);
      
      return {
        status: "success",
        message: "Estado de propiedad actualizado exitosamente"
      };
    } catch (error) {
      console.error('Error al actualizar estado de propiedad:', error);
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : "Error al actualizar estado de propiedad"
      });
    }
  }

  // Métodos de validación
  private validarCrearPropiedadRequest(data: CrearPropiedadRequest): void {
    if (!data.direccion?.trim()) {
      throw new Error('La dirección es requerida');
    }
    if (!data.precioNegociable || data.precioNegociable <= 0) {
      throw new Error('El precio negociable es requerido y debe ser mayor a 0');
    }
    if (data.precioNegociable > 10000000) {
      throw new Error('El precio negociable no puede exceder el límite permitido');
    }
  }
}
