export type TiposPropiedad = "Casa" | "Apartamento" | "Terreno" | "Oficina" | "Local_Comercial";
export type EstadosPropiedad = "Disponible" | "En_Negociacion" | "Reservada" | "Vendida" | "Arrendada" | "Retirada" | "Inactiva";

export type EstadoPropiedad_Fisica = "Excelente" | "Buena" | "Regular" | "Mala" | "Dañada" | "En construcción";
export type TipoOferta = "Venta" | "Alquiler" | "Venta_y_Alquiler";
export type TipoTransaccion = "Compraventa" | "Arrendamiento" | "Opcion_Compra";
export type MetodoPago = "Efectivo" | "Transferencia" | "Cheque" | "Tarjeta" | "Financiamiento" | "Mixto";
export type TipoDocumentoPropiedad = "Titulo_Propiedad" | "Escritura" | "Certificado_Propiedad" | "Contrato_Promesa"
export type TipoImpuesto = "Predial" | "Impuesto_Municipal" | "Impuesto_Transferencia" | "Seguro_Propiedad";


export interface Propiedad{
    id:number;

    //Informacion basica
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


    // Estado
    estadoPropiedad: EstadosPropiedad;
    estadoFisico: EstadoPropiedad_Fisica;

     // Información comercial
    tipoOferta: TipoOferta;
    precioPrincipal: number;     // Precio de venta
    precioAlquiler?: number | null;  // Precio de alquiler (mensual)
    porcientaComision?: number | null; // % de comisión

    // Propietario/Vendedor
    idPropietario: number;       // Usuario o contacto propietario
    nombrePropietario: string;
    telefonoPropietario: string;
    emailPropietario?: string | null;


    // Gestión
    idAsesor: number;            // Asesor responsable
    observaciones?: string | null;
    imagenes?: string[] | null;  // URLs de imágenes

    // Auditoría
    fechaCreacion: Date;
    ultimaModificacion: Date;
    ultimaActualizacionPrecio?: Date | null;
    activa: boolean;
}

export interface DocumentoPropiedad{
    id:number;
    idPropiedad:number;

    tipoDocumento: TipoDocumentoPropiedad;
    identificacionLead: string; //RUC,PASAPORTE,CEDULA,DNI
    descripcion?: string | null;

    //Archivo
    fechaDocumento: Date

    // Validez
    vigente: boolean;
    fechaVencimiento?: Date | null;
  
    // Auditoría
    fechaCarga: Date;// Fecha y hora exacta en que se subió el archivo
                            // Ejemplo: 2026-05-02T14:30:45Z
    idUsuarioCarga: number;// ID del usuario que realizó la carga
                            // Ejemplo: 5 (el usuario administrador o asesor)
}




export interface HistorialPrecio {
  id: number;
  idPropiedad: number;
  
  // Precios
  precioAnterior: number;
  precioNuevo: number;
  diferencia: number;
  porcentajeCambio: number;
  
  // Información del cambio
  razonCambio?: string | null;
  idUsuario: number;
  fechaCambio: Date;
}

/**
 * ENTIDAD: Transaccion
 * Registro de venta o alquiler de propiedad
 */
export interface Transaccion {
  id: number;
  idPropiedad: number;
  idLead: number;              // Cliente comprador/arrendatario
  
  // Información de transacción
  tipoTransaccion: TipoTransaccion;
  estadoTransaccion: "En_Negociacion" | "Acordada" | "Completada" | "Cancelada";
  
  // Montos
  montoNegociado: number;
  montoFinal: number;
  comisionAsesor?: number | null;
  
  // Fechas clave
  fechaInicio: Date;
  fechaAcuerdo?: Date | null;
  fechaCompletacion?: Date | null;
  plazoEntrega?: number | null; // en días
  
  // Detalles del pago
  metodoPago: MetodoPago;
  cuotasAcordadas?: number | null;
  montoInicial?: number | null;
  plazoFinanciamiento?: number | null; // en meses
  
  // Documentación
  requiereEscritura: boolean;
  fechaEscritura?: Date | null;
  notariaResponsable?: string | null;
  numeroEscritura?: string | null;
  
  // Observaciones
  notasTransaccion?: string | null;
  
  // Auditoría
  idAsesor: number;
  ultimaModificacion: Date;
}

/**
 * ENTIDAD: GastoPropiedad
 * Gastos asociados al mantenimiento y servicios
 */
export interface GastoPropiedad {
  id: number;
  idPropiedad: number;
  
  // Información del gasto
  tipoGasto: "Mantenimiento" | "Reparacion" | "Impuesto" | "Seguro" | "Servicios" | "Otro";
  descripcion: string;
  monto: number;
  
  // Fechas
  fechaGasto: Date;
  fechaPago?: Date | null;
  proximoPago?: Date | null;
  
  // Recurrencia
  esRecurrente: boolean;
  frecuenciaRecurrencia?: "Mensual" | "Trimestral" | "Semestral" | "Anual" | null;
  
  // Responsable
  idResponsable?: number | null;
  proveedor?: string | null;
  
  observaciones?: string | null;
  ultimaModificacion: Date;
}

/**
 * ENTIDAD: ImpuestoPropiedad
 * Impuestos y contribuciones
 */
export interface ImpuestoPropiedad {
  id: number;
  idPropiedad: number;
  
  // Tipo
  tipoImpuesto: TipoImpuesto;
  descripcion: string;
  
  // Montos
  montoAnual: number;
  montoPagado: number;
  saldoPendiente: number;
  
  // Fechas
  fechaVencimiento: Date;
  fechaUltimoPago?: Date | null;
  
  // Referencias
  numeroReferencia?: string | null;
  entidadRecaudadora?: string | null;
  
  activo: boolean;
  ultimaModificacion: Date;
}

/**
 * ENTIDAD: InspeccionPropiedad
 * Registros de inspecciones y evaluaciones
 */
export interface InspeccionPropiedad {
  id: number;
  idPropiedad: number;
  
  // Información
  tipoInspeccion: "Evaluacion_Inicial" | "Mantenimiento" | "Pre_Venta" | "Tasacion" | "Sanitaria";
  fechaInspeccion: Date;
  
  // Inspector
  nombreInspector: string;
  profesion?: string | null;
  contactoInspector?: string | null;
  
  // Resultados
  estadoGeneral: EstadoPropiedad_Fisica;
  hallazgos?: string | null;
  recomendaciones?: string | null;
  costosEstimadosReparacion?: number | null;
  
  // Documento
  urlReporte?: string | null;
  calificacionGeneral?: number | null; // 1-10
  
  // Auditoría
  fechaReporte: Date;
}

/**
 * ENTIDAD: HistorialPropiedad
 * Auditoría completa de cambios
 */
export interface HistorialPropiedad {
  id: number;
  idPropiedad: number;
  
  // Qué cambió
  campo: string;              // ej: "estadoPropiedad", "precioPrincipal"
  valorAnterior: string;
  valorNuevo: string;
  razonCambio?: string | null;
  
  // Quién y cuándo
  idUsuario: number;
  fechaCambio: Date;
}