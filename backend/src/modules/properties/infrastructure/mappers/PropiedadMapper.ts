/**
 * Mapper: PropiedadMapper
 * Traductor entre entidades de dominio y entidades de persistencia
 * Aísla el mapeo de datos del resto del sistema
 */

import type { Propiedad } from '../../domain/entities/Propiedad';
import type { 
  PropiedadEntity, 
  InteresadoEntity,
  PropiedadConInteresadosEntity
} from '../persistence/PropiedadEntity';

export class PropiedadMapper {
  // Mapeo de entidad de persistencia a entidad de dominio
  static toDomain(entity: PropiedadEntity): Propiedad {
    return {
      id: entity.id_propiedad,
      direccion: entity.direccion,
      descripcion: entity.descripcion,
      medidas: entity.medidas,
      serviciosBasicos: entity.servicios_basicos,
      precioNegociable: entity.precio_negociable,
      partidaRegistral: entity.partida_registral
    };
  }

  // Mapeo de entidad de dominio a entidad de persistencia
  static toPersistence(propiedad: Propiedad): PropiedadEntity {
    return {
      id_propiedad: propiedad.id,
      direccion: propiedad.direccion,
      descripcion: propiedad.descripcion,
      medidas: propiedad.medidas,
      servicios_basicos: propiedad.serviciosBasicos,
      precio_negociable: propiedad.precioNegociable,
      partida_registral: propiedad.partidaRegistral
    };
  }

  // Mapeo para propiedades con datos de interesados
  static toDomainWithInteresados(row: PropiedadConInteresadosEntity): Propiedad & {
    totalInteresados?: number;
    vendido?: boolean;
    separado?: boolean;
  } {
    const propiedad = this.toDomain(row);
    return {
      ...propiedad,
      totalInteresados: row.total_interesados,
      vendido: row.vendido,
      separado: row.separado
    };
  }

  // Mapeo para creación de relaciones de interés
  static toInteresadoPersistence(idPropiedad: number, idPersona: number): InteresadoEntity {
    return {
      id_propiedad: idPropiedad,
      id_persona: idPersona,
      vendido: false,
      separado: false
    };
  }

  // Validación de mapeo
  static isValidPropiedad(propiedad: Partial<Propiedad>): boolean {
    if (!propiedad.direccion?.trim()) {
      return false;
    }
    if (propiedad.precioNegociable !== undefined && propiedad.precioNegociable <= 0) {
      return false;
    }
    return true;
  }

  static isValidPrecio(precio: number): boolean {
    return precio > 0 && precio <= 10000000; // Límite razonable
  }

  static formatDireccion(direccion: string): string {
    return direccion.trim().replace(/\s+/g, ' ');
  }

  static formatMedidas(medidas: string): string {
    return medidas.trim().toUpperCase();
  }
}
