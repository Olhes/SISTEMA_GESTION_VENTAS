/**
 * Caso de Uso para Gestión de Propiedades
 * Application Layer - Orquestación de dominio + infraestructura
 */

import type { 
  Propiedad, 
  CrearPropiedadData, 
  ActualizarPropiedadData 
} from '~/src/domain/entities/Propiedad';
import { PropiedadAggregate } from '~/src/domain/entities/Propiedad';
import { PropiedadLocalStorageRepository } from '~/src/infrastructure/repositories/propiedad.local-storage.repository';

export interface PropiedadUseCase {
  findAll(): Promise<Propiedad[]>;
  findById(id: number): Promise<Propiedad | null>;
  findByCodigo(codigo: string): Promise<Propiedad | null>;
  findByTipoPropiedad(tipoPropiedad: string): Promise<Propiedad[]>;
  findByEstado(estado: string): Promise<Propiedad[]>;
  findByCiudad(ciudad: string): Promise<Propiedad[]>;
  findByUsuarioCreador(idUsuario: number): Promise<Propiedad[]>;
  crearPropiedad(data: CrearPropiedadData): Promise<Propiedad>;
  actualizarPropiedad(id: number, data: ActualizarPropiedadData): Promise<Propiedad>;
  eliminarPropiedad(id: number): Promise<void>;
  buscarPropiedades(term: string): Promise<Propiedad[]>;
  obtenerDisponiblesParaVenta(): Promise<Propiedad[]>;
  obtenerDisponiblesParaAlquiler(): Promise<Propiedad[]>;
  buscarPorRangoPrecio(minPrecio?: number, maxPrecio?: number): Promise<Propiedad[]>;
  obtenerEstadisticas(): Promise<PropiedadEstadisticas>;
  cambiarEstado(id: number, nuevoEstado: string): Promise<Propiedad>;
}

export interface PropiedadEstadisticas {
  total: number;
  disponibles: number;
  enNegociacion: number;
  vendidas: number;
  arrendadas: number;
  porTipo: Record<string, number>;
  porCiudad: Record<string, number>;
  precioPromedioVenta: number;
  precioPromedioAlquiler: number;
}

export class PropiedadService implements PropiedadUseCase {
  private readonly repository: PropiedadLocalStorageRepository;

  constructor() {
    this.repository = new PropiedadLocalStorageRepository();
  }

  async findAll(): Promise<Propiedad[]> {
    return await this.repository.findAll();
  }

  async findById(id: number): Promise<Propiedad | null> {
    return await this.repository.findById(id);
  }

  async findByCodigo(codigo: string): Promise<Propiedad | null> {
    return await this.repository.findByCodigo(codigo);
  }

  async findByTipoPropiedad(tipoPropiedad: string): Promise<Propiedad[]> {
    return await this.repository.findByTipoPropiedad(tipoPropiedad);
  }

  async findByEstado(estado: string): Promise<Propiedad[]> {
    return await this.repository.findByEstado(estado);
  }

  async findByCiudad(ciudad: string): Promise<Propiedad[]> {
    return await this.repository.findByCiudad(ciudad);
  }

  async findByUsuarioCreador(idUsuario: number): Promise<Propiedad[]> {
    return await this.repository.findByUsuarioCreador(idUsuario);
  }

  async crearPropiedad(data: CrearPropiedadData): Promise<Propiedad> {
    // Validaciones de negocio adicionales
    const codigoExistente = await this.repository.findByCodigo(data.codigo);
    if (codigoExistente) {
      throw new Error('Ya existe una propiedad con ese código');
    }

    // Usar el Aggregate Root para crear la propiedad
    const propiedad = PropiedadAggregate.crearPropiedad(data);

    // Guardar a través del repositorio
    return await this.repository.save(propiedad);
  }

  async actualizarPropiedad(id: number, data: ActualizarPropiedadData): Promise<Propiedad> {
    // Obtener propiedad existente
    const propiedadExistente = await this.repository.findById(id);
    if (!propiedadExistente) {
      throw new Error('Propiedad no encontrada');
    }

    // Validaciones de negocio según tipo de oferta
    if (data.tipoOferta && data.precioVenta && data.precioAlquiler) {
      if (data.tipoOferta === 'Venta' && !data.precioVenta) {
        throw new Error('Para venta, el precio de venta es requerido');
      }
      if (data.tipoOferta === 'Alquiler' && !data.precioAlquiler) {
        throw new Error('Para alquiler, el precio de alquiler es requerido');
      }
      if (data.tipoOferta === 'Venta_y_Alquiler' && (!data.precioVenta || !data.precioAlquiler)) {
        throw new Error('Para venta y alquiler, ambos precios son requeridos');
      }
    }

    // Usar el Aggregate Root para actualizar
    const propiedadActualizada = PropiedadAggregate.actualizarPropiedad(propiedadExistente, data);

    // Guardar a través del repositorio
    return await this.repository.update(id, propiedadActualizada);
  }

  async eliminarPropiedad(id: number): Promise<void> {
    const propiedadExistente = await this.repository.findById(id);
    if (!propiedadExistente) {
      throw new Error('Propiedad no encontrada');
    }

    // Validación de negocio: no se pueden eliminar propiedades vendidas
    if (propiedadExistente.estado === 'Vendida') {
      throw new Error('No se puede eliminar una propiedad vendida');
    }

    // Borrado lógico a través del repositorio
    await this.repository.delete(id);
  }

  async buscarPropiedades(term: string): Promise<Propiedad[]> {
    return await this.repository.search(term);
  }

  async obtenerDisponiblesParaVenta(): Promise<Propiedad[]> {
    return await this.repository.findDisponiblesParaVenta();
  }

  async obtenerDisponiblesParaAlquiler(): Promise<Propiedad[]> {
    return await this.repository.findDisponiblesParaAlquiler();
  }

  async buscarPorRangoPrecio(minPrecio?: number, maxPrecio?: number): Promise<Propiedad[]> {
    return await this.repository.findByRangoPrecio(minPrecio, maxPrecio);
  }

  async obtenerEstadisticas(): Promise<PropiedadEstadisticas> {
    const todas = await this.repository.findAll();
    const counts = await this.repository.countByEstado();
    
    // Calcular estadísticas por tipo
    const porTipo: Record<string, number> = {};
    todas.forEach(propiedad => {
      porTipo[propiedad.tipoPropiedad] = (porTipo[propiedad.tipoPropiedad] || 0) + 1;
    });

    // Calcular estadísticas por ciudad
    const porCiudad: Record<string, number> = {};
    todas.forEach(propiedad => {
      porCiudad[propiedad.ciudad] = (porCiudad[propiedad.ciudad] || 0) + 1;
    });

    // Calcular precios promedio
    const propiedadesVenta = todas.filter(p => p.precioVenta);
    const propiedadesAlquiler = todas.filter(p => p.precioAlquiler);
    
    const precioPromedioVenta = propiedadesVenta.length > 0 
      ? propiedadesVenta.reduce((sum, p) => sum + (p.precioVenta || 0), 0) / propiedadesVenta.length
      : 0;

    const precioPromedioAlquiler = propiedadesAlquiler.length > 0
      ? propiedadesAlquiler.reduce((sum, p) => sum + (p.precioAlquiler || 0), 0) / propiedadesAlquiler.length
      : 0;

    return {
      total: todas.length,
      disponibles: counts['Disponible'] || 0,
      enNegociacion: counts['En_Negociacion'] || 0,
      vendidas: counts['Vendida'] || 0,
      arrendadas: counts['Arrendada'] || 0,
      porTipo,
      porCiudad,
      precioPromedioVenta: Math.round(precioPromedioVenta),
      precioPromedioAlquiler: Math.round(precioPromedioAlquiler)
    };
  }

  async cambiarEstado(id: number, nuevoEstado: string): Promise<Propiedad> {
    const propiedadExistente = await this.repository.findById(id);
    if (!propiedadExistente) {
      throw new Error('Propiedad no encontrada');
    }

    // Usar el Aggregate Root para cambiar estado
    const propiedadActualizada = PropiedadAggregate.cambiarEstado(
      propiedadExistente, 
      nuevoEstado as any
    );

    // Guardar a través del repositorio
    return await this.repository.update(id, propiedadActualizada);
  }

  // Métodos de ayuda para el frontend
  async generarCodigoUnico(): Promise<string> {
    let codigo: string;
    let intentos = 0;
    const maxIntentos = 10;

    do {
      codigo = PropiedadAggregate.generarCodigoUnico();
      const existente = await this.repository.findByCodigo(codigo);
      
      if (!existente) {
        return codigo;
      }
      
      intentos++;
    } while (intentos < maxIntentos);

    throw new Error('No se pudo generar un código único después de varios intentos');
  }

  async validarPropiedadParaVenta(id: number): Promise<boolean> {
    const propiedad = await this.repository.findById(id);
    if (!propiedad) return false;

    return PropiedadAggregate.estaDisponibleParaVenta(propiedad);
  }

  async validarPropiedadParaAlquiler(id: number): Promise<boolean> {
    const propiedad = await this.repository.findById(id);
    if (!propiedad) return false;

    return PropiedadAggregate.estaDisponibleParaAlquiler(propiedad);
  }

  async calcularPrecioPorMetroCuadrado(id: number): Promise<number | null> {
    const propiedad = await this.repository.findById(id);
    if (!propiedad) return null;

    return PropiedadAggregate.calcularPrecioPorMetroCuadrado(propiedad);
  }
}
