/**
 * Aggregate Root: Propiedad
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export interface Propiedad {
  id: number;
  direccion: string;
  descripcion: string | null;
  medidas: string | null;
  serviciosBasicos: string | null;
  precioNegociable: number;
  partidaRegistral: string | null;
}

// Value Object para interés en propiedad
export interface Interesado {
  idPropiedad: number;
  idPersona: number;
  vendido: boolean;
  separado: boolean;
}

// Métodos de dominio
export class PropiedadAggregate {
  static crearPropiedad(data: CrearPropiedadData): Propiedad {
    // Validaciones de negocio
    if (!data.direccion?.trim()) {
      throw new Error('La dirección es requerida');
    }
    if (data.precioNegociable <= 0) {
      throw new Error('El precio negociable debe ser mayor a 0');
    }

    return {
      id: 0, // Se asignará en persistencia
      direccion: data.direccion,
      descripcion: data.descripcion || null,
      medidas: data.medidas || null,
      serviciosBasicos: data.serviciosBasicos || null,
      precioNegociable: data.precioNegociable,
      partidaRegistral: data.partidaRegistral || null
    };
  }

  static estaDisponible(propiedad: Propiedad): boolean {
    // Lógica de negocio para determinar si una propiedad está disponible
    return propiedad.precioNegociable > 0;
  }

  static puedeSerSeparada(propiedad: Propiedad): boolean {
    // Lógica de negocio para determinar si una propiedad puede ser separada
    return !propiedad.partidaRegistral?.includes('SEPARADO');
  }
}

// DTOs para operaciones del dominio
export interface CrearPropiedadData {
  direccion: string;
  descripcion?: string;
  medidas?: string;
  serviciosBasicos?: string;
  precioNegociable: number;
  partidaRegistral?: string;
}
