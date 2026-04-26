/**
 * Endpoint para listar Leads2
 * File-based routing: GET /api/leads2
 */

import type { Lead } from '~/src/modules/leads/domain/entities/Lead2';

export default defineEventHandler(async (event) => {
  try {
    // TODO: Implementar lógica real
    const leads: Lead[] = [
      {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan@example.com",
        telefono: "987654321",
        tipo: "Comprador",
        estado: "Nuevo",
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        id: 2, 
        nombre: "María García",
        email: "maria@example.com",
        telefono: "123456789",
        tipo: "Vendeor",
        estado: "Contactado",
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ];

    return {
      status: "success",
      message: "Leads2 listados exitosamente",
      data: leads
    };
  } catch (error) {
    console.error('Error al listar leads2:', error);
    throw createError({
      statusCode: 500,
      message: "Error al listar leads2"
    });
  }
});
