/**
 * Tipos basados en el schema SQL de la base de datos
 */

// Tipos de persona según el schema
export type TipoPersona = "Cliente" | "Referido" | "Lead Alvas" | "Lead Propio";

// Roles del sistema
export type RolNombre = "Administrador" | "Asesor";

export interface Rol {
  id_rol: number;
  nombre_rol: RolNombre;
}

// Categorías de persona
export type NombreCategoria = "Vendedor" | "Comprador";

export interface Categoria {
  id_categoria: number;
  nombre_categoria: NombreCategoria;
}

export interface CategoriaPersona {
  id_persona: number;
  id_categoria: number;
}

// Propiedad
export interface Propiedad {
  id_propiedad: number;
  direccion: string;
  descripcion: string | null;
  medidas: string | null;
  servicios_basicos: string | null;
  precio_negociable: number;
  partida_registral: string | null;
}

// Contrato
export interface Contrato {
  id_contrato: number;
  fecha_emision: string;
  id_propiedad: number;
  id_persona: number;
}

// Estados de visita guiada
export type EstadoVisitaGuiada = "Reprogramó" | "Canceló" | "No realizó visita" | "Realizó visita";

export interface Cita {
  id_cita: number;
  fecha_agendada: string;
  observacion: string | null;
  estado_visita_guiada: EstadoVisitaGuiada;
  id_persona: number;
  id_usuario: number;
}

// Interesados en propiedades
export interface Interesado {
  id_propiedad: number;
  id_persona: number;
  vendido: boolean;
  separado: boolean;
}

// Estados de comprador
export type EstadoComprador =
  | "Aún no se ha contactado"
  | "Esperando respuesta"
  | "Agendó visita guiada"
  | "Venta concretada"
  | "No está interesado";

export interface UsuarioComprador {
  id_usuario: number;
  id_persona: number;
  estado_comprador: EstadoComprador;
  observacion: string | null;
}

// Estados de vendedor
export type EstadoVendedor = "Seguimiento" | "Cierre" | "No responde";

export interface UsuarioVendedor {
  id_usuario: number;
  id_persona: number;
  estado_vendedor: EstadoVendedor;
  observacion: string | null;
}

// Conversiones
export interface Conversion {
  id_conversion: number;
  id_persona: number;
  id_usuario: number;
  fecha_conversion: string;
  tipo_anterior: TipoPersona | null;
  tipo_nuevo: TipoPersona | null;
}

// ============================================================
// TIPOS PARA VISTAS COMBINADAS (usados en componentes)
// ============================================================

// Persona base
export interface Persona {
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
  correo: string | null;
  tipo_persona: TipoPersona;
  fecha_creacion: string;
}

// Usuario base
export interface Usuario {
  id_usuario: number;
  id_persona: number;
  nombre_usuario: string;
  contrasena: string;
  id_rol: number;
  fecha_creacion: string;
}

// Lead para la tabla de captación (vendedores)
export interface LeadVendedor extends Persona {
  estado_vendedor: EstadoVendedor;
  observacion: string | null;
  id_usuario: number;
  propiedad?: Propiedad | null;
  cita?: Cita | null;
}

// Lead para la tabla de captación (compradores)
export interface LeadComprador extends Persona {
  estado_comprador: EstadoComprador;
  observacion: string | null;
  id_usuario: number;
  propiedades_interes?: Propiedad[];
  citas?: Cita[];
}

// Cliente con contrato y propiedad
export interface ClienteConContrato extends Persona {
  contrato?: Contrato;
  propiedad?: Propiedad;
  conversiones?: Conversion[];
}

// Cita con datos expandidos
export interface CitaExpandida extends Cita {
  persona: Persona;
  usuario: Usuario;
  propiedad?: Propiedad;
}

// ============================================================
// TIPOS PARA API REQUESTS/RESPONSES
// ============================================================

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id: number;
    nombre_usuario: string;
    nombre_completo: string;
    rol: string;
  };
}

export interface UserSession {
  id: number;
  nombre_usuario: string;
  nombre_completo: string;
  rol: string;
}
