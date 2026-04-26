/**
 * Rutas explícitas para Leads
 * Alternativa a file-based routing de Nuxt
 */

import { LeadController } from '../Controllers/LeadController';

// Si quisieras usar routing explícito en lugar de file-based
export const leadRoutes = {
  // GET /api/leads
  'GET /api/leads': async (event: any) => {
    const controller = new LeadController(/* dependencies */);
    return controller.listarLeads(event);
  },
  
  // POST /api/leads
  'POST /api/leads': async (event: any) => {
    const controller = new LeadController(/* dependencies */);
    return controller.crearLead(event);
  },
  
  // GET /api/leads/:id
  'GET /api/leads/:id': async (event: any) => {
    const controller = new LeadController(/* dependencies */);
    return controller.obtenerLead(event);
  },
  
  // PUT /api/leads/:id
  'PUT /api/leads/:id': async (event: any) => {
    const controller = new LeadController(/* dependencies */);
    return controller.actualizarLead(event);
  },
  
  // DELETE /api/leads/:id
  'DELETE /api/leads/:id': async (event: any) => {
    const controller = new LeadController(/* dependencies */);
    return controller.eliminarLead(event);
  }
};

/**
 * Para usar esto en lugar de file-based routing:
 * 
 * 1. En nuxt.config.ts agregar:
 * serverHandlers: [
 *   { route: '/api/leads', handler: '~/src/modules/leads/infrastructure/api/routes/lead.routes.ts' }
 * ]
 * 
 * 2. O usar un router externo como Express
 */
