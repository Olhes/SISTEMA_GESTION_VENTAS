/**
 * Endpoint para crear Lead2
 * File-based routing: POST /api/leads2
 */

import type { Lead } from '~/src/modules/leads/domain/entities/Lead2';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validaciones básicas
    if (!body.nombre || !body.email || !body.telefono || !body.tipo) {
      throw createError({
        statusCode: 400,
        message: "Faltan campos requeridos: nombre, email, telefono, tipo"
      });
    }

    // TODO: Implementar lógica real con Use Case
    const newLead: Lead = {
      id: Date.now(), // Simulación de ID auto-increment
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono,
      tipo: body.tipo,
      estado: "Nuevo", // Estado inicial
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    return {
      status: "success",
      message: "Lead2 creado exitosamente",
      data: newLead
    };
  } catch (error) {
    console.error('Error al crear lead2:', error);
    throw createError({
      statusCode: 500,
      message: "Error al crear lead2"
    });
  }
});
