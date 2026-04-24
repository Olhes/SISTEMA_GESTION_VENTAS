/**
 * Mapper: AuthMapper
 * Traductor entre entidades de dominio y entidades de persistencia
 * Aísla el mapeo de datos del resto del sistema
 */

import type { Usuario, UsuarioConDetalles, Sesion, Rol, RolNombre } from '../../domain/entities/Auth';
import type { 
  UsuarioEntity, 
  RolEntity,
  SesionEntity,
  UsuarioWithDetailsEntity,
  UsuarioPersonaEntity,
  UsuarioRolEntity
} from '../persistence/AuthEntity';

export class AuthMapper {
  // Mapeo de entidad de persistencia a entidad de dominio
  static toUsuario(entity: UsuarioEntity): Usuario {
    return {
      id: entity.id_usuario,
      idPersona: entity.id_persona,
      nombreUsuario: entity.nombre_usuario,
      contrasena: entity.contrasena,
      idRol: entity.id_rol,
      fechaCreacion: new Date(entity.fecha_creacion),
      ultimoLogin: entity.ultimo_login ? new Date(entity.ultimo_login) : null,
      activo: entity.activo
    };
  }

  // Mapeo de entidad de dominio a entidad de persistencia
  static toUsuarioPersistence(usuario: Usuario): UsuarioEntity {
    return {
      id_usuario: usuario.id,
      id_persona: usuario.idPersona,
      nombre_usuario: usuario.nombreUsuario,
      contrasena: usuario.contrasena,
      id_rol: usuario.idRol,
      fecha_creacion: usuario.fechaCreacion.toISOString(),
      ultimo_login: usuario.ultimoLogin?.toISOString(),
      activo: usuario.activo
    };
  }

  // Mapeo para usuarios con detalles
  static toUsuarioConDetalles(row: UsuarioWithDetailsEntity): UsuarioConDetalles {
    const usuario = this.toUsuario(row);
    return {
      ...usuario,
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidoPaterno: row.persona_apellido_paterno,
        apellidoMaterno: row.persona_apellido_materno,
        tipoDocumento: row.persona_tipo_documento,
        numeroDocumento: row.persona_numero_documento
      },
      rol: {
        id: row.id_rol,
        nombreRol: row.rol_nombre as RolNombre
      }
    };
  }

  // Mapeo para sesiones
  static toSesion(entity: SesionEntity): Sesion {
    return {
      id: entity.id_sesion,
      idUsuario: entity.id_usuario,
      token: entity.token,
      fechaCreacion: new Date(entity.fecha_creacion),
      fechaExpiracion: new Date(entity.fecha_expiracion),
      activa: entity.activa
    };
  }

  static toSesionPersistence(sesion: Sesion): SesionEntity {
    return {
      id_sesion: sesion.id,
      id_usuario: sesion.idUsuario,
      token: sesion.token,
      fecha_creacion: sesion.fechaCreacion.toISOString(),
      fecha_expiracion: sesion.fechaExpiracion.toISOString(),
      activa: sesion.activa
    };
  }

  // Mapeo para roles
  static toRol(entity: RolEntity): Rol {
    return {
      id: entity.id_rol,
      nombreRol: entity.nombre_rol as RolNombre
    };
  }

  static toRolPersistence(rol: Rol): RolEntity {
    return {
      id_rol: rol.id,
      nombre_rol: rol.nombreRol
    };
  }

  // Mapeo para relaciones específicas
  static toUsuarioPersona(entity: UsuarioPersonaEntity): UsuarioConDetalles['persona'] {
    return {
      id: entity.id_persona,
      nombres: entity.nombres,
      apellidoPaterno: entity.apellido_paterno,
      apellidoMaterno: entity.apellido_materno,
      tipoDocumento: entity.tipo_documento,
      numeroDocumento: entity.numero_documento
    };
  }

  static toUsuarioRol(entity: UsuarioRolEntity): UsuarioConDetalles['rol'] {
    return {
      id: entity.id_rol,
      nombreRol: entity.nombre_rol as RolNombre
    };
  }

  // Validación de mapeo
  static isValidRol(rol: string): rol is RolNombre {
    const rolesValidos: RolNombre[] = ["Administrador", "Asesor"];
    return rolesValidos.includes(rol as RolNombre);
  }

  static isValidUsuario(usuario: Partial<Usuario>): boolean {
    if (!usuario.idPersona || usuario.idPersona <= 0) {
      return false;
    }
    if (!usuario.nombreUsuario?.trim()) {
      return false;
    }
    if (!usuario.contrasena?.trim()) {
      return false;
    }
    if (!usuario.idRol || usuario.idRol <= 0) {
      return false;
    }
    return true;
  }

  static isValidNombreUsuario(nombreUsuario: string): boolean {
    // Debe tener entre 3 y 50 caracteres, alfanumérico y guiones bajos
    const regex = /^[a-zA-Z0-9_]{3,50}$/;
    return regex.test(nombreUsuario);
  }

  static isValidContrasena(contrasena: string): boolean {
    // Debe tener al menos 6 caracteres
    return contrasena.length >= 6;
  }

  static formatNombreUsuario(nombreUsuario: string): string {
    return nombreUsuario.toLowerCase().trim();
  }

  static formatFecha(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (isNaN(fechaObj.getTime())) {
      throw new Error('Fecha inválida');
    }
    return fechaObj.toISOString();
  }

  static generarTokenSeguro(payload: any): string {
    // En producción, se usaría una librería como JWT
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = 'firma_segura'; // En producción, usar HMAC con clave secreta
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static validarTokenFormato(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }

  static estaTokenExpirado(fechaExpiracion: Date): boolean {
    return fechaExpiracion <= new Date();
  }
}
