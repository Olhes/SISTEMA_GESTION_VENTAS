
//verificacion 2 pasos?
//guardar ip?
export type EstadoUsuario = "Activo" | "Inactivo";

export interface Usuario {
  id: number;
  nombreUsuario: string;
  contrasena: string;
  Rol: "User";
  Estado: EstadoUsuario;
  fechaCreacion: Date;
  ultimoLogin?: Date | null;
  activo: boolean;
}

export interface SesionUsuario{
    id:number;
    idUsuario:number;
    token:string;
    refreshToken?:string;

    fechaInicio: Date;
    fechaExpiracion: Date;
    fechaCierre?: Date | null;
    activa: boolean;
}

export interface AuditoriaLogin {
  id: number;
  idUsuario: number;
  
  // Intento
  tipoIntento: "Exitoso" | "Fallido" | "Bloqueado";
  razonFallo?: string | null;
  
  // Dispositivo
  navegador: string;
  sistemaOperativo: string;
  direccionIp: string;
  
  // Auditoría
  fechaIntento: Date;
}

export interface CambioContraseña{
    id:number;
    idUsuario:number;
    contrasenaAnterior:string;
    contrasenaNueva:string;
    motivo: "Cambio_Voluntario" | "Restablecimiento";
    fechaCambio: Date;
    activa: boolean;
}

export interface HistorialAcceso{
    id: number;
    idUsuario: number;
    accion: string; //"Crear Lead","Actualizar_propiedad","Generar Reporte"
    modulo: string; //"Leads","Propiedades","Reportes"
    fechaAcceso: Date; 
    activa: boolean;

}

export class UsuarioAggregate{
    private _sesionesActivas: SesionUsuario[] = [];
    private _auditoria: AuditoriaLogin[]=[];
    private _historialAcceso: HistorialAcceso[] = [];
    private _cambioContraseña: CambioContraseña[]= [];

    constructor(
        private readonly id: number,
        private props: Omit<Usuario, 'id' | 'fechaCreacion'| 'ultimaModificacion'>,
        private readonly fechaCreacion: Date = new Date()
    ) {}

}