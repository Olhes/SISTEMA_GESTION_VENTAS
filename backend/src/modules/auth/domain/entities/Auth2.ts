/**
 * Aggregate Root: Auth
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export type RolNombre = "Administrador" | "Asesor";

//verificacion 2 pasos?
//guardar ip?
export type EstadoUsuario = "Activo" | "Inactivo";

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

export interface SesionUsuario {
  id: number;
  idUsuario: number;
  token: string;
  refreshToken?: string;
  fechaInicio: Date;
  fechaExpiracion: Date;
  fechaCierre?: Date | null;
  activa: boolean;
}

export interface CambioContraseña {
  id: number;
  idUsuario: number;
  contrasenaAnterior: string;
  contrasenaNueva: string;
  motivo: "Cambio_Voluntario" | "Restablecimiento";
  fechaCambio: Date;
  activa: boolean;
}

export interface HistorialAcceso {
  id: number;
  idUsuario: number;
  accion: string; //"Crear Lead","Actualizar_propiedad","Generar Reporte"
  modulo: string; //"Leads","Propiedades","Reportes"
  fechaAcceso: Date;
  activa: boolean;
}

export interface Credenciales {
  nombreUsuario: string;
  contrasena: string;
}

// Métodos de dominio
export class AuthAggregate {
  static validarCredenciales(
    usuario: Usuario,
    credenciales: Credenciales,
  ): boolean {
    if (!usuario.activo) {
      throw new Error("Usuario inactivo");
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
      activa: false,
    };
  }

  static estaSesionValida(sesion: Sesion): boolean {
    return sesion.activa && sesion.fechaExpiracion > new Date();
  }

  static actualizarUltimoLogin(usuario: Usuario): Usuario {
    return {
      ...usuario,
      ultimoLogin: new Date(),
    };
  }

  static desactivarUsuario(usuario: Usuario): Usuario {
    return {
      ...usuario,
      activo: false,
    };
  }

  static activarUsuario(usuario: Usuario): Usuario {
    return {
      ...usuario,
      activo: true,
    };
  }

  static cambiarContrasena(usuario: Usuario, nuevaContrasena: string): Usuario {
    if (nuevaContrasena.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    return {
      ...usuario,
      contrasena: nuevaContrasena,
    };
  }
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
