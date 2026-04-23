/**
 * Aggregate Root: Auth
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export type RolNombre = "Administrador" | "Asesor";

export interface Usuario {
  id: number;
  idPersona: number;
  nombreUsuario: string;
  contrasena: string; // Encriptada
  idRol: number;
  fechaCreacion: Date;
  ultimoLogin?: Date | null;
  activo: boolean;
}

export interface Rol {
  id: number;
  nombreRol: RolNombre;
}

export interface Sesion {
  id: number;
  idUsuario: number;
  token: string;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  activa: boolean;
}

// Value Objects para información extendida
export interface UsuarioConDetalles extends Usuario {
  persona?: {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
  rol?: Rol;
}

export interface Credenciales {
  nombreUsuario: string;
  contrasena: string;
}

// Métodos de dominio
export class AuthAggregate {
  static crearUsuario(data: CrearUsuarioData): Usuario {
    // Validaciones de negocio
    if (!data.nombreUsuario?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (!data.contrasena?.trim()) {
      throw new Error('La contraseña es requerida');
    }
    if (data.contrasena.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (!data.idPersona || data.idPersona <= 0) {
      throw new Error('El ID de persona es requerido');
    }
    if (!data.idRol || data.idRol <= 0) {
      throw new Error('El ID de rol es requerido');
    }

    return {
      id: 0, // Se asignará en persistencia
      idPersona: data.idPersona,
      nombreUsuario: data.nombreUsuario.toLowerCase(),
      contrasena: data.contrasena, // Debe venir encriptada
      idRol: data.idRol,
      fechaCreacion: new Date(),
      ultimoLogin: null,
      activo: true
    };
  }

  static crearSesion(data: CrearSesionData): Sesion {
    // Validaciones de negocio
    if (!data.idUsuario || data.idUsuario <= 0) {
      throw new Error('El ID de usuario es requerido');
    }
    if (!data.token?.trim()) {
      throw new Error('El token es requerido');
    }
    if (data.fechaExpiracion <= new Date()) {
      throw new Error('La fecha de expiración debe ser futura');
    }

    return {
      id: 0, // Se asignará en persistencia
      idUsuario: data.idUsuario,
      token: data.token,
      fechaCreacion: new Date(),
      fechaExpiracion: data.fechaExpiracion,
      activa: true
    };
  }

  static validarCredenciales(usuario: Usuario, credenciales: Credenciales): boolean {
    if (!usuario.activo) {
      throw new Error('Usuario inactivo');
    }
    
    if (usuario.nombreUsuario !== credenciales.nombreUsuario.toLowerCase()) {
      return false;
    }
    
    // La validación de contraseña se hace con hash en la capa de aplicación
    return usuario.contrasena === credenciales.contrasena;
  }

  static puedeIniciarSesion(usuario: Usuario): boolean {
    return usuario.activo;
  }

  static cerrarSesion(sesion: Sesion): Sesion {
    return {
      ...sesion,
      activa: false
    };
  }

  static estaSesionValida(sesion: Sesion): boolean {
    return sesion.activa && sesion.fechaExpiracion > new Date();
  }

  static actualizarUltimoLogin(usuario: Usuario): Usuario {
    return {
      ...usuario,
      ultimoLogin: new Date()
    };
  }

  static desactivarUsuario(usuario: Usuario): Usuario {
    return {
      ...usuario,
      activo: false
    };
  }

  static activarUsuario(usuario: Usuario): Usuario {
    return {
      ...usuario,
      activo: true
    };
  }

  static cambiarContrasena(usuario: Usuario, nuevaContrasena: string): Usuario {
    if (nuevaContrasena.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return {
      ...usuario,
      contrasena: nuevaContrasena
    };
  }
}

// DTOs para operaciones del dominio
export interface CrearUsuarioData {
  idPersona: number;
  nombreUsuario: string;
  contrasena: string;
  idRol: number;
}

export interface CrearSesionData {
  idUsuario: number;
  token: string;
  fechaExpiracion: Date;
}

export interface ActualizarUsuarioData {
  nombreUsuario?: string;
  contrasena?: string;
  idRol?: number;
  activo?: boolean;
}
