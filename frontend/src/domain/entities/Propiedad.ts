/**
 * Entidades de Dominio - Propiedades
 * Corresponden a las entidades del backend pero adaptadas para frontend
 */

export type TiposPropiedad = "Casa" | "Apartamento" | "Terreno" | "Oficina" | "Local_Comercial";
export type EstadosPropiedad = "Disponible" | "En_Negociacion" | "Reservada" | "Vendida" | "Arrendada" | "Retirada" | "Inactiva";
export type EstadoPropiedad_Fisica = "Excelente" | "Buena" | "Regular" | "Mala" | "Dañada" | "En construcción";
export type TipoOferta = "Venta" | "Alquiler" | "Venta_y_Alquiler";
export type TipoTransaccion = "Compraventa" | "Arrendamiento" | "Opcion_Compra";
export type MetodoPago = "Efectivo" | "Transferencia" | "Cheque" | "Tarjeta" | "Financiamiento" | "Mixto";
export type TipoDocumentoPropiedad = "Titulo_Propiedad" | "Escritura" | "Certificado_Propiedad" | "Contrato_Promesa";
export type TipoImpuesto = "Predial" | "Impuesto_Municipal" | "Impuesto_Transferencia" | "Seguro_Propiedad";

export interface Propiedad {
  id: number;

  // Información básica
  codigo: string;              // Código único de propiedad (ej: PROP-2025-001)
  nombre: string;              // Nombre/descripción corta
  tipoPropiedad: TiposPropiedad;
  descripcionDetallada?: string | null;

  // Ubicación
  direccion: string;
  ciudad: string;
  departamento?: string | null;
  codigoPostal?: string | null;
  latitud?: number | null;
  longitud?: number | null;

  // Características físicas
  areaTotal: number;           // en metros cuadrados
  areaUsable?: number | null;
  numeroHabitaciones?: number | null;
  numeroBanos?: number | null;
  numeroPisos?: number | null;

  // Servicios y características
  tieneGaraje: boolean;
  numeroGarajes?: number | null;
  tienePatio: boolean;
  tieneJardin: boolean;
  tienePiscina: boolean;
  tieneAsensor: boolean;
  tieneAireAcondicionado: boolean;
  tieneGasNatural: boolean;

  // Información financiera
  precioVenta?: number | null;
  precioAlquiler?: number | null;
  moneda: "PEN" | "USD";
  
  // Estados
  estado: EstadosPropiedad;
  estadoFisico: EstadoPropiedad_Fisica;
  tipoOferta: TipoOferta;
  
  // Fechas
  fechaCreacion: Date;
  fechaActualizacion?: Date | null;
  
  // Metadatos
  activo: boolean;
  idUsuarioCreador: number;
}

// DTOs para operaciones del dominio
export interface CrearPropiedadData {
  codigo: string;
  nombre: string;
  tipoPropiedad: TiposPropiedad;
  descripcionDetallada?: string;
  direccion: string;
  ciudad: string;
  departamento?: string;
  codigoPostal?: string;
  areaTotal: number;
  areaUsable?: number;
  numeroHabitaciones?: number;
  numeroBanos?: number;
  numeroPisos?: number;
  tieneGaraje: boolean;
  numeroGarajes?: number;
  tienePatio: boolean;
  tieneJardin: boolean;
  tienePiscina: boolean;
  tieneAsensor: boolean;
  tieneAireAcondicionado: boolean;
  tieneGasNatural: boolean;
  precioVenta?: number;
  precioAlquiler?: number;
  moneda: "PEN" | "USD";
  estado: EstadosPropiedad;
  estadoFisico: EstadoPropiedad_Fisica;
  tipoOferta: TipoOferta;
  idUsuarioCreador: number;
}

export interface ActualizarPropiedadData {
  nombre?: string;
  descripcionDetallada?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  codigoPostal?: string;
  areaTotal?: number;
  areaUsable?: number;
  numeroHabitaciones?: number;
  numeroBanos?: number;
  numeroPisos?: number;
  tieneGaraje?: boolean;
  numeroGarajes?: number;
  tienePatio?: boolean;
  tieneJardin?: boolean;
  tienePiscina?: boolean;
  tieneAsensor?: boolean;
  tieneAireAcondicionado?: boolean;
  tieneGasNatural?: boolean;
  precioVenta?: number;
  precioAlquiler?: number;
  moneda?: "PEN" | "USD";
  estado?: EstadosPropiedad;
  estadoFisico?: EstadoPropiedad_Fisica;
  tipoOferta?: TipoOferta;
  activo?: boolean;
}

// Aggregate Root para lógica de dominio
export class PropiedadAggregate {
  
  static crearPropiedad(data: CrearPropiedadData): Propiedad {
    // Validaciones de negocio
    if (!data.codigo?.trim()) {
      throw new Error('El código de propiedad es requerido');
    }
    if (!data.nombre?.trim()) {
      throw new Error('El nombre de propiedad es requerido');
    }
    if (!data.direccion?.trim()) {
      throw new Error('La dirección es requerida');
    }
    if (!data.ciudad?.trim()) {
      throw new Error('La ciudad es requerida');
    }
    if (data.areaTotal <= 0) {
      throw new Error('El área total debe ser mayor a 0');
    }
    if (data.numeroHabitaciones && data.numeroHabitaciones < 0) {
      throw new Error('El número de habitaciones no puede ser negativo');
    }
    if (data.numeroBanos && data.numeroBanos < 0) {
      throw new Error('El número de baños no puede ser negativo');
    }
    if (data.tieneGaraje && data.numeroGarajes && data.numeroGarajes <= 0) {
      throw new Error('Si tiene garaje, debe especificar al menos 1');
    }
    
    // Validación de precios según tipo de oferta
    if (data.tipoOferta === 'Venta' && !data.precioVenta) {
      throw new Error('Para venta, el precio de venta es requerido');
    }
    if (data.tipoOferta === 'Alquiler' && !data.precioAlquiler) {
      throw new Error('Para alquiler, el precio de alquiler es requerido');
    }
    if (data.tipoOferta === 'Venta_y_Alquiler' && (!data.precioVenta || !data.precioAlquiler)) {
      throw new Error('Para venta y alquiler, ambos precios son requeridos');
    }

    return {
      id: 0, // Se asignará en persistencia
      codigo: data.codigo.toUpperCase(),
      nombre: data.nombre.trim(),
      tipoPropiedad: data.tipoPropiedad,
      descripcionDetallada: data.descripcionDetallada?.trim() || null,
      direccion: data.direccion.trim(),
      ciudad: data.ciudad.trim(),
      departamento: data.departamento?.trim() || null,
      codigoPostal: data.codigoPostal?.trim() || null,
      latitud: null,
      longitud: null,
      areaTotal: data.areaTotal,
      areaUsable: data.areaUsable || null,
      numeroHabitaciones: data.numeroHabitaciones || null,
      numeroBanos: data.numeroBanos || null,
      numeroPisos: data.numeroPisos || null,
      tieneGaraje: data.tieneGaraje,
      numeroGarajes: data.numeroGarajes || null,
      tienePatio: data.tienePatio,
      tieneJardin: data.tieneJardin,
      tienePiscina: data.tienePiscina,
      tieneAsensor: data.tieneAsensor,
      tieneAireAcondicionado: data.tieneAireAcondicionado,
      tieneGasNatural: data.tieneGasNatural,
      precioVenta: data.precioVenta || null,
      precioAlquiler: data.precioAlquiler || null,
      moneda: data.moneda,
      estado: data.estado,
      estadoFisico: data.estadoFisico,
      tipoOferta: data.tipoOferta,
      fechaCreacion: new Date(),
      fechaActualizacion: null,
      activo: true,
      idUsuarioCreador: data.idUsuarioCreador
    };
  }

  static actualizarPropiedad(propiedad: Propiedad, data: ActualizarPropiedadData): Propiedad {
    // Validaciones de negocio
    if (data.areaTotal !== undefined && data.areaTotal <= 0) {
      throw new Error('El área total debe ser mayor a 0');
    }
    if (data.numeroHabitaciones !== undefined && data.numeroHabitaciones < 0) {
      throw new Error('El número de habitaciones no puede ser negativo');
    }
    if (data.numeroBanos !== undefined && data.numeroBanos < 0) {
      throw new Error('El número de baños no puede ser negativo');
    }
    if (data.tieneGaraje !== undefined && data.numeroGarajes !== undefined) {
      if (data.tieneGaraje && data.numeroGarajes <= 0) {
        throw new Error('Si tiene garaje, debe especificar al menos 1');
      }
    }

    return {
      ...propiedad,
      ...data,
      nombre: data.nombre ? data.nombre.trim() : propiedad.nombre,
      descripcionDetallada: data.descripcionDetallada?.trim() || propiedad.descripcionDetallada,
      direccion: data.direccion ? data.direccion.trim() : propiedad.direccion,
      ciudad: data.ciudad ? data.ciudad.trim() : propiedad.ciudad,
      departamento: data.departamento?.trim() || propiedad.departamento,
      codigoPostal: data.codigoPostal?.trim() || propiedad.codigoPostal,
      fechaActualizacion: new Date()
    };
  }

  static cambiarEstado(propiedad: Propiedad, nuevoEstado: EstadosPropiedad): Propiedad {
    // Validaciones de negocio para cambio de estado
    if (propiedad.estado === 'Vendida' && nuevoEstado !== 'Vendida') {
      throw new Error('Una propiedad vendida no puede cambiar de estado');
    }
    
    if (nuevoEstado === 'Vendida' && propiedad.estado !== 'Vendida') {
      // Lógica adicional para marcar como vendida
      return {
        ...propiedad,
        estado: nuevoEstado,
        fechaActualizacion: new Date()
      };
    }

    return {
      ...propiedad,
      estado: nuevoEstado,
      fechaActualizacion: new Date()
    };
  }

  static estaDisponibleParaVenta(propiedad: Propiedad): boolean {
    return propiedad.activo && 
           propiedad.estado === 'Disponible' && 
           (propiedad.tipoOferta === 'Venta' || propiedad.tipoOferta === 'Venta_y_Alquiler') &&
           propiedad.precioVenta !== null;
  }

  static estaDisponibleParaAlquiler(propiedad: Propiedad): boolean {
    return propiedad.activo && 
           propiedad.estado === 'Disponible' && 
           (propiedad.tipoOferta === 'Alquiler' || propiedad.tipoOferta === 'Venta_y_Alquiler') &&
           propiedad.precioAlquiler !== null;
  }

  static generarCodigoUnico(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `PROP-${timestamp}-${random}`;
  }

  static calcularPrecioPorMetroCuadrado(propiedad: Propiedad): number | null {
    if (propiedad.precioVenta && propiedad.areaTotal > 0) {
      return Math.round(propiedad.precioVenta / propiedad.areaTotal);
    }
    return null;
  }
}
