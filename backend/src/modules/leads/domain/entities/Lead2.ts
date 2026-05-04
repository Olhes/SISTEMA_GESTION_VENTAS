export type TipoLead = "Comprador" | "Vendeor";

export type EstadoLead =
 | "Nuevo" //Recien ingresado
 | "Contactado" //Se ha realizado contacto inicial
 | "En_Negociación" //En proceso de negociacón
 | "Calificado" //Potencial real d compra
 | "No_Calificado" //No tiene potencial 
 | "Convertido" //Se convirtió a cliente/contrato
 | "Rechazado" //No interesado
 | "Inactivo" //Sin interés actual


export type FrecuenciaContacto = "Diario" | "Semanal" | "Mensual" | "Nunca";
export type MetodoContacto = "Telefono" | "Email" | "Redes_Sociales" | "Otro";
export type PresupuestoEstimado = "Bajo" | "Medio" | "Alto";
export type TiposPropiedad = "Casa" | "Apartamento" | "Terreno" | "Oficina" | "Local_Comercial";
export type TipoDocumento = "DNI" | "Pasaporte" | "Carnet_Extranjeria";


export interface Lead {
    
    //Datos Personales
    id: number;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    

    //Contacto
    email: string;
    telefono: string;

    //Informacion de negocio
    tipoLead: TipoLead;
    estadoLead: EstadoLead;
    presupuestoEstimado: PresupuestoEstimado;
    presupuestoMinimo?: number | null;
    presupuestoMaximo?: number | null;
    tiposPropiedad: TiposPropiedad[];
    frecuenciaContacto: FrecuenciaContacto;
   


    //Gestion
    idAsesor:number;
    observaciones?: string | null;
    

    //Auditoria
    fechaCreacion: Date;
    ultimaModificaion:Date;
    ultimoContacto?:Date | null;
    activo: boolean;

}


export interface ActividadLead{
    id: number;
    idLead:number;

    tipoActividad: "Llamada" | "Email" | "Reunion" | "Seguimiento" | "Otro";
    metodoContacto: MetodoContacto;

    descripcion: string;
    resultadoContacto: "Exitoso" | "Fallido" | "Pendiente" | "Otro";
    
    //Auditoria
    idUsuario: number;
    fechaCreacion: Date;
    proximoContacto?: Date | null;
}


export interface PreferenciaLead {
  id: number;
  idLead: number;
  
  // Ubicación
  ciudadesDeInteres: string[];
  zonaGeografica?: string | null;
  proximoAlugares?: string[] | null;
  
  // Características de propiedad
  areaMinima?: number | null;
  areaMaxima?: number | null;
  numeroHabitaciones?: number | null;
  numeroBanos?: number | null;
  tieneGaraje: boolean;
  tienePatio: boolean;
  tieneJardin: boolean;
  
  // Servicios
  requiereServicios: boolean;
  tiposServicios?: string[] | null;
  
  // Otras preferencias
  aceptaRemodelacion: boolean;
  requiereFinanciamiento: boolean;
  porcentajeInicial?: number | null;
  
  fechaCreacion: Date;
  ultimaModificacion: Date;
}

export interface PropiedadDeInteres {
  id: number;
  idLead: number;
  idPropiedad: number;
  
  // Nivel de interés
  nivelInteres: "Muy_Alto" | "Alto" | "Medio" | "Bajo" | "Rechazado";
  razonRechazo?: string | null;
  
  // Seguimiento
  fechaVisualizado: Date;
  fechaVisitaFisica?: Date | null;
  impresionVisita?: string | null;
  proximo_seguimiento?: Date | null;
  
  // Oferta
  ofertaRealizada: boolean;
  montoOferta?: number | null;
  fechaOferta?: Date | null;
  estadoOferta?: "Pendiente" | "Aceptada" | "Rechazada" | "Contraoferta";
}

 export interface ConversacionLead {
  id: number;
  idLead: number;
  
  // Propiedades
  idPropiedad: number;
  
  // Estado
  estadoConversacion: "Abierta" | "En_Negociacion" | "Finalizada" | "Cancelada";
  
  // Detalles
  montoPedido?: number | null;
  montoOfrecido?: number | null;
  contrapropuesta?: number | null;
  
  // Términos
  plazoDeRespuesta?: number | null; // en días
  fechaInicio: Date;
  fechaUltimaActividad: Date;
  fechaConclusion?: Date | null;
  
  notasNegociacion?: string | null;
  idResponsable: number;
}

export interface HistorialLead {
  id: number;
  idLead: number;
  
  // Qué cambió
  campo: string;              // ej: "estadoLead", "presupuestoEstimado"
  valorAnterior: string;
  valorNuevo: string;
  razonCambio?: string | null;
  
  // Quién y cuándo
  idUsuario: number;
  fechaCambio: Date;
}


export class LeadAggregate{
  private _actividades: ActividadLead[] = [];
  private _preferencias: PreferenciaLead;
  private _propiedadesInteres: PropiedadDeInteres[]=[];
  private _conversaciones: ConversacionLead[]= [];


  constructor(
    private readonly id:number,
    private props: Omit<Lead, 'id' | 'fechaCreacion' | 'iltimaModificacion'>,
    preferencias: PreferenciaLead,
    private readonly fechaCreacion: Date= new Date()
  ){
    this._preferencias = preferencias;

  }

  get estado() { return this.props.estadoLead; }
  get idAsesor() { return this.props.idAsesor; }
 
  
  public cambiarEstado(nuevoEstado: EstadoLead,motivo?: string): void{
    const estadosTerminales: EstadoLead[] = ["Convertido", "Rechazado", "Inactivo"];
  
    if (estadosTerminales.includes(this.props.estadoLead)) {
      throw new Error(`No se puede cambiar el estado de un Lead ya ${this.props.estadoLead}`);
    }


    if (nuevoEstado === "Convertido" && this._conversaciones.length === 0) {
      throw new Error("No se puede convertir un lead sin historial de conversaciones.");
    }

    this.props.estadoLead = nuevoEstado;
    this.props.ultimaModificaion = new Date();

  }


  public registrarActividad(actividad: Omit<ActividadLead, 'id' | 'idLead'>): void {
    const nuevaActividad: ActividadLead = {
      ...actividad,
      id: 0, // El ID se genera en la DB
      idLead: this.id,
      fechaCreacion: new Date()
    };

    this._actividades.push(nuevaActividad);
    this.props.ultimoContacto = nuevaActividad.fechaCreacion;
    this.props.ultimaModificaion = new Date();
    
    // Si la actividad fue exitosa, el lead pasa a contactado automáticamente
    if (actividad.resultadoContacto === "Exitoso" && this.props.estadoLead === "Nuevo") {
      this.cambiarEstado("Contactado");
    }
  }

  public actualizarPresupuesto(min: number, max: number): void {
    if (min > max) {
      throw new Error("El presupuesto mínimo no puede ser mayor al máximo.");
    }
    this.props.presupuestoMinimo = min;
    this.props.presupuestoMaximo = max;
    this.props.ultimaModificaion = new Date();
  }
  

  public toJSON() {
    return {
      id: this.id,
      ...this.props,
      preferencias: this._preferencias,
      actividades: [...this._actividades],
      propiedades: [...this._propiedadesInteres]
    };
  }
}