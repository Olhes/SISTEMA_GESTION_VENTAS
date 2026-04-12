// API Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: 'success' | 'error';
  message: string;
  user?: UserSession;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

// User Types
export interface UserSession {
  id_usuario: number;
  nombre_usuario: string;
  nombre_completo: string;
  rol: 'Administrador' | 'Asesor';
}

export interface User {
  id_usuario: number;
  id_persona: number;
  nombre_usuario: string;
  contrasena: string;
  id_rol: number;
  fecha_creacion: string;
}

// Person Types
export interface Persona {
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
  correo: string | null;
  tipo_persona: string;
  fecha_creacion: string;
}

// Lead Types
export interface LeadVendedor extends Persona {
  estado_vendedor: string;
  observacion: string;
  id_usuario: number;
}

export interface LeadComprador extends Persona {
  estado_comprador: string;
  observacion: string;
  id_usuario: number;
}

// Property Types
export interface Propiedad {
  id_propiedad: number;
  direccion: string;
  descripcion: string | null;
  medidas: string | null;
  servicios_basicos: string | null;
  precio_negociable: number;
  partida_registral: string | null;
}

export interface Interesado {
  id_propiedad: number;
  id_persona: number;
  vendido: boolean;
  separado: boolean;
}

// Appointment Types
export interface Cita {
  id_cita: number;
  fecha_agendada: string;
  observacion: string | null;
  estado_visita_guiada: string;
  id_persona: number;
  id_usuario: number;
}

export interface CitaExpandida extends Cita {
  persona: Persona;
  usuario: User;
}

// Contract Types
export interface Contrato {
  id_contrato: number;
  fecha_emision: string;
  id_propiedad: number;
  id_persona: number;
}

// Utility Types
export type EstadoVendedor = 'Seguimiento' | 'No responde' | 'No interesado' | 'Convertido';
export type EstadoComprador = 'Agendó visita guiada' | 'Realizó visita' | 'No asistió' | 'Interesado';
export type EstadoVisitaGuiada = 'Reprogramó' | 'No asistió' | 'Realizó visita' | 'Canceló';
export type RolNombre = 'Administrador' | 'Asesor';
