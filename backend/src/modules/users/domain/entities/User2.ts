export type TipoUsuario = "Administrador" | "Asesor";
export type EstadoUsuario = "Activo" | "Inactivo" | "Bloqueado";
export type MetodoAutenticacion = "Usuario_Contraseña" | "Google" | "Microsoft";

// ============= ENTIDADES PRINCIPALES =============

/**
 * ENTIDAD: Usuario
 * Usuario único del sistema (Administrador o Asesor)
 */
export interface Usuario {
  id: number;
  
  // Datos personales
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  
  // Contacto
  correoElectronico: string;
  telefonoPrincipal: string;
  telefonoSecundario?: string | null;
  
  // Autenticación
  tipoUsuario: TipoUsuario;
  nombreUsuario: string;
  contrasenaHash: string;    // Hash seguro de la contraseña
  metodoAutenticacion: MetodoAutenticacion;
  idExternoGoogle?: string | null;    // Para autenticación con Google
  idExternoMicrosoft?: string | null; // Para autenticación con Microsoft
  
  // Estado
  estadoUsuario: EstadoUsuario;
  activo: boolean;
  
  // Seguridad
  intentosFallidos: number;  // Contador de intentos fallidos de login
  bloqueadoHasta?: Date | null;
  dosfactorHabilitado: boolean;
  
  // Información de sesión
  ultimoLogin?: Date | null;
  ultimaActividad?: Date | null;
  
  // Auditoría
  fechaCreacion: Date;
  ultimaModificacion: Date;
  idUsuarioCreador: number;  // Quién creó este usuario
}

/**
 * ENTIDAD: SesionUsuario
 * Sesión activa del usuario en el sistema
 */
export interface SesionUsuario {
  id: number;
  idUsuario: number;
  
  // Token y sesión
  token: string;            // Token JWT o sesión
  tokenRefresh?: string | null;
  
  // Dispositivo
  dispositivo: string;      // Navegador, dispositivo móvil, etc.
  direccionIP: string;
  userAgent?: string | null;
  
  // Fechas
  fechaInicio: Date;
  fechaExpiracion: Date;
  fechaUltimaActividad: Date;
  
  // Estado
  activa: boolean;
  cerradaManualmente?: Date | null;
}

/**
 * ENTIDAD: VerificacionDosFactor
 * Códigos 2FA para mayor seguridad
 */
export interface VerificacionDosFactor {
  id: number;
  idUsuario: number;
  
  // Código
  codigo: string;           // Código de 6 dígitos
  tipoVerificacion: "Email" | "SMS" | "Autenticador";
  
  // Control
  intentos: number;
  maximoIntentos: number;
  utilizado: boolean;
  
  // Fechas
  fechaGeneracion: Date;
  fechaExpiracion: Date;
  fechaUtilizacion?: Date | null;
}

/**
 * ENTIDAD: AuditoriaLogin
 * Registro de intentos de login (exitosos y fallidos)
 */
export interface AuditoriaLogin {
  id: number;
  idUsuario: number;
  
  // Intento
  nombreUsuario: string;
  exitoso: boolean;
  razonFallo?: string | null; // "Contraseña incorrecta", "Usuario no existe", etc.
  
  // Dispositivo
  direccionIP: string;
  dispositivo: string;
  userAgent?: string | null;
  
  // Auditoría
  fechaIntento: Date;
}

/**
 * ENTIDAD: CambioContraseña
 * Historial de cambios de contraseña
 */
export interface CambioContraseña {
  id: number;
  idUsuario: number;
  
  // Contraseña
  contrasenaAntigua: string;  // Hash de la contraseña anterior
  contrasenaNew: string;      // Hash de la nueva contraseña
  razonCambio: "Manual" | "Expiración" | "Recuperación" | "Administrador";
  
  // Auditoría
  fechaCambio: Date;
  direccionIP: string;
  idUsuarioModificador?: number | null;  // Si fue cambiada por admin
}

/**
 * ENTIDAD: RestablecimientoContraseña
 * Solicitudes de restablecimiento de contraseña
 */
export interface RestablecimientoContraseña {
  id: number;
  idUsuario: number;
  
  // Token
  token: string;            // Token único para restablecimiento
  tokenHash: string;        // Hash del token
  
  // Control
  utilizado: boolean;
  
  // Auditoría
  fechaSolicitud: Date;
  fechaExpiracion: Date;
  fechaUtilizacion?: Date | null;
  direccionIP: string;
}

/**
 * ENTIDAD: HistorialAcceso
 * Auditoría de acciones y accesos del usuario
 */
export interface HistorialAcceso {
  id: number;
  idUsuario: number;
  
  // Acción
  modulo: string;           // "Leads", "Properties", "Users", etc.
  accion: string;           // "Crear", "Actualizar", "Eliminar", "Ver", etc.
  descripcion: string;
  
  // Recursos afectados
  idRecurso?: number | null;     // ID del recurso modificado
  tipoRecurso?: string | null;   // "Lead", "Propiedad", "Usuario"
  
  // Detalles
  datosAntes?: string | null;    // JSON con estado anterior
  datosDespues?: string | null;  // JSON con estado nuevo
  
  // Auditoría
  fechaAcceso: Date;
  direccionIP: string;
  sesionId?: number | null;
}

/**
 * ENTIDAD: PermisoEspecial
 * Permisos temporales o excepcionales para asesores
 */
export interface PermisoEspecial {
  id: number;
  idUsuario: number;
  
  // Permiso
  modulo: string;           // "Leads", "Properties", "Reports", etc.
  accion: string;           // "Crear", "Actualizar", "Eliminar", "Exportar"
  descripcion: string;
  
  // Vigencia
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
  
  // Auditoría
  idUsuarioOtorgador: number;  // Admin que lo otorgó
  razonOtorgamiento: string;
  fechaCreacion: Date;
}