/**
 * Aggregate Root: User
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export type EstadoUsuario = "Activo" | "Inactivo" | "Suspendido";

export interface Usuario {
  id: number;
  idPersona: number;
  nombreUsuario: string;
  contrasena: string; // Encriptada
  idRol: number;
  estado: EstadoUsuario;
  fechaCreacion: Date;
  ultimoLogin?: Date | null;
  fechaModificacion?: Date | null;
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
    telefono: string;
    correo?: string;
  };
  rol?: {
    id: number;
    nombreRol: string;
  };
  estadisticas?: {
    totalLeadsGestionados: number;
    totalCitasAgendadas: number;
    totalVentasRealizadas: number;
    ultimaActividad?: Date;
  };
}

// Métodos de dominio
export class UserAggregate {
  static crearUsuario(data: CrearUsuarioData): Usuario {
    // Validaciones de negocio
    if (!data.nombreUsuario?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (!UserAggregate.esNombreUsuarioValido(data.nombreUsuario)) {
      throw new Error('El nombre de usuario debe tener entre 3 y 50 caracteres alfanuméricos');
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
      estado: 'Activo',
      fechaCreacion: new Date(),
      ultimoLogin: null,
      fechaModificacion: null
    };
  }

  static actualizarUsuario(usuario: Usuario, data: ActualizarUsuarioData): Usuario {
    // Validaciones de negocio
    if (data.nombreUsuario && !UserAggregate.esNombreUsuarioValido(data.nombreUsuario)) {
      throw new Error('El nombre de usuario debe tener entre 3 y 50 caracteres alfanuméricos');
    }
    if (data.contrasena && data.contrasena.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (data.idRol && data.idRol <= 0) {
      throw new Error('El ID de rol debe ser mayor a 0');
    }

    return {
      ...usuario,
      nombreUsuario: data.nombreUsuario ? data.nombreUsuario.toLowerCase() : usuario.nombreUsuario,
      contrasena: data.contrasena || usuario.contrasena,
      idRol: data.idRol || usuario.idRol,
      fechaModificacion: new Date()
    };
  }

  static activarUsuario(usuario: Usuario): Usuario {
    if (usuario.estado === 'Activo') {
      throw new Error('El usuario ya está activo');
    }

    return {
      ...usuario,
      estado: 'Activo',
      fechaModificacion: new Date()
    };
  }

  static desactivarUsuario(usuario: Usuario): Usuario {
    if (usuario.estado === 'Inactivo') {
      throw new Error('El usuario ya está inactivo');
    }

    return {
      ...usuario,
      estado: 'Inactivo',
      fechaModificacion: new Date()
    };
  }

  static suspenderUsuario(usuario: Usuario, motivo?: string): Usuario {
    if (usuario.estado === 'Suspendido') {
      throw new Error('El usuario ya está suspendido');
    }

    return {
      ...usuario,
      estado: 'Suspendido',
      fechaModificacion: new Date()
    };
  }

  static puedeIniciarSesion(usuario: Usuario): boolean {
    return usuario.estado === 'Activo';
  }

  static puedeSerModificado(usuario: Usuario): boolean {
    return true; // Todos los usuarios pueden ser modificados
  }

  static puedeSerEliminado(usuario: Usuario): boolean {
    // No se puede eliminar si tiene datos asociados
    // En un sistema real, se verificarían dependencias
    return true;
  }

  static actualizarUltimoLogin(usuario: Usuario): Usuario {
    return {
      ...usuario,
      ultimoLogin: new Date()
    };
  }

  static cambiarContrasena(usuario: Usuario, contrasenaActual: string, nuevaContrasena: string): Usuario {
    if (!UserAggregate.validarContrasena(contrasenaActual, usuario.contrasena)) {
      throw new Error('La contraseña actual es incorrecta');
    }
    if (nuevaContrasena.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    return {
      ...usuario,
      contrasena: nuevaContrasena,
      fechaModificacion: new Date()
    };
  }

  static resetearContrasena(usuario: Usuario, nuevaContrasena: string): Usuario {
    if (nuevaContrasena.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    return {
      ...usuario,
      contrasena: nuevaContrasena,
      fechaModificacion: new Date()
    };
  }

  static validarCredenciales(usuario: Usuario, nombreUsuario: string, contrasena: string): boolean {
    if (!UserAggregate.puedeIniciarSesion(usuario)) {
      return false;
    }
    
    if (usuario.nombreUsuario !== nombreUsuario.toLowerCase()) {
      return false;
    }
    
    // En un sistema real, se usaría hash
    return usuario.contrasena === contrasena;
  }

  static obtenerTiempoInactivo(usuario: Usuario): number {
    if (!usuario.ultimoLogin) {
      return Infinity; // Nunca ha iniciado sesión
    }
    
    return Date.now() - usuario.ultimoLogin.getTime();
  }

  static estaInactivo(usuario: Usuario, diasLimite: number = 30): boolean {
    const tiempoInactivo = UserAggregate.obtenerTiempoInactivo(usuario);
    return tiempoInactivo > (diasLimite * 24 * 60 * 60 * 1000);
  }

  // Métodos de validación
  static esNombreUsuarioValido(nombreUsuario: string): boolean {
    // Debe tener entre 3 y 50 caracteres, alfanumérico y guiones bajos
    const regex = /^[a-zA-Z0-9_]{3,50}$/;
    return regex.test(nombreUsuario);
  }

  static esContrasenaSegura(contrasena: string): boolean {
    // Al menos 6 caracteres, una letra y un número
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return regex.test(contrasena);
  }

  static esCorreoValido(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  static validarContrasena(contrasenaIngresada: string, contrasenaAlmacenada: string): boolean {
    // En un sistema real, se usaría bcrypt o similar
    return contrasenaIngresada === contrasenaAlmacenada;
  }

  static generarNombreUsuario(nombres: string, apellidos: string): string {
    const nombreLimpio = nombres.toLowerCase().replace(/\s+/g, '');
    const apellidoLimpio = apellidos.toLowerCase().replace(/\s+/g, '');
    const base = `${nombreLimpio}.${apellidoLimpio}`;
    
    // Limitar longitud y remover caracteres no válidos
    let nombreUsuario = base.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 20);
    
    // Asegurar que cumpla con la longitud mínima
    if (nombreUsuario.length < 3) {
      nombreUsuario = nombreUsuario.padEnd(3, '1');
    }
    
    return nombreUsuario;
  }

  static generarContrasenaTemporal(): string {
    // Generar contraseña temporal de 8 caracteres
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 8; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contrasena;
  }

  static obtenerResumenUsuario(usuario: UsuarioConDetalles): string {
    const nombreCompleto = usuario.persona 
      ? `${usuario.persona.nombres} ${usuario.persona.apellidoPaterno}`.trim()
      : usuario.nombreUsuario;
    
    return `${nombreCompleto} (${usuario.rol?.nombreRol || 'Sin rol'}) - ${usuario.estado}`;
  }
}

// DTOs para operaciones del dominio
export interface CrearUsuarioData {
  idPersona: number;
  nombreUsuario: string;
  contrasena: string;
  idRol: number;
}

export interface ActualizarUsuarioData {
  nombreUsuario?: string;
  contrasena?: string;
  idRol?: number;
}

export interface CambiarContrasenaData {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface ResetearContrasenaData {
  nuevaContrasena: string;
}
