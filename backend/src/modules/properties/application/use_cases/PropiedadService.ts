/**
 * Implementación del Caso de Uso de Propiedades
 * Contiene lógica de orquestación, inyectando puertos secundarios
 */

import type { 
  IPropiedadUseCase, 
  CrearPropiedadRequest, 
  ActualizarPropiedadRequest 
} from '../../domain/ports/driving/IPropiedadUseCase';
import type { IPropiedadRepo, CreatePropiedadData } from '../../domain/ports/driven/IPropiedadRepo';
import type { 
  Propiedad,
  CrearPropiedadData as DominioCrearPropiedadData
} from '../../domain/entities/Propiedad';
import { PropiedadAggregate } from '../../domain/entities/Propiedad';

export class PropiedadService implements IPropiedadUseCase {
  constructor(private readonly propiedadRepo: IPropiedadRepo) {}

  async listarPropiedades(): Promise<Propiedad[]> {
    return await this.propiedadRepo.findAll();
  }

  async crearPropiedad(propiedadData: CrearPropiedadRequest): Promise<Propiedad> {
    // Validaciones y transformaciones de negocio
    const dominioData: DominioCrearPropiedadData = {
      direccion: propiedadData.direccion,
      descripcion: propiedadData.descripcion,
      medidas: propiedadData.medidas,
      serviciosBasicos: propiedadData.serviciosBasicos,
      precioNegociable: propiedadData.precioNegociable,
      partidaRegistral: propiedadData.partidaRegistral
    };

    // Usar el Aggregate Root para crear la propiedad
    const propiedad = PropiedadAggregate.crearPropiedad(dominioData);

    // Guardar a través del repositorio
    const createData: CreatePropiedadData = {
      direccion: propiedad.direccion,
      descripcion: propiedad.descripcion,
      medidas: propiedad.medidas,
      serviciosBasicos: propiedad.serviciosBasicos,
      precioNegociable: propiedad.precioNegociable,
      partidaRegistral: propiedad.partidaRegistral
    };

    return await this.propiedadRepo.save({
      id: 0, // Se asignará en persistencia
      ...createData
    } as Propiedad);
  }

  async actualizarPropiedad(id: number, propiedadData: Partial<ActualizarPropiedadRequest>): Promise<Propiedad> {
    // Validar que la propiedad exista
    const existingPropiedad = await this.propiedadRepo.findById(id);
    if (!existingPropiedad) {
      throw new Error('Propiedad no encontrada');
    }

    return await this.propiedadRepo.update(id, propiedadData);
  }

  async eliminarPropiedad(id: number): Promise<void> {
    const existingPropiedad = await this.propiedadRepo.findById(id);
    if (!existingPropiedad) {
      throw new Error('Propiedad no encontrada');
    }

    await this.propiedadRepo.delete(id);
  }

  async obtenerPropiedadPorId(id: number): Promise<Propiedad | null> {
    return await this.propiedadRepo.findById(id);
  }

  async registrarInteres(idPersona: number, idPropiedad: number): Promise<void> {
    // Validar que la propiedad exista
    const propiedad = await this.propiedadRepo.findById(idPropiedad);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    // Validar reglas de negocio
    if (!PropiedadAggregate.estaDisponible(propiedad)) {
      throw new Error('La propiedad no está disponible para registrar interés');
    }

    await this.propiedadRepo.registrarInteres(idPersona, idPropiedad);
  }

  async listarPropiedadesInteresadas(idPersona: number): Promise<Propiedad[]> {
    return await this.propiedadRepo.findPropiedadesInteresadas(idPersona);
  }

  async actualizarEstadoPropiedad(idPropiedad: number, vendido: boolean, separado: boolean): Promise<void> {
    const propiedad = await this.propiedadRepo.findById(idPropiedad);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    // Validar reglas de negocio
    if (separado && !PropiedadAggregate.puedeSerSeparada(propiedad)) {
      throw new Error('La propiedad no puede ser separada');
    }

    await this.propiedadRepo.actualizarEstadoPropiedad(idPropiedad, vendido, separado);
  }
}
