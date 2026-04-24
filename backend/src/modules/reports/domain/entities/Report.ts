/**
 * Aggregate Root: Report
 * Entidad pura de dominio sin dependencias de infraestructura
 */

export type TipoReporte = "Ventas" | "Leads" | "Citas" | "Propiedades" | "Usuarios";

export interface Reporte {
  id: number;
  nombre: string;
  tipo: TipoReporte;
  descripcion?: string;
  parametros: ReporteParametros;
  fechaGeneracion: Date;
  datos: ReporteDatos;
  formato: FormatoReporte;
}

// Value Objects para parámetros y datos
export interface ReporteParametros {
  fechaInicio?: Date;
  fechaFin?: Date;
  idUsuario?: number;
  idPersona?: number;
  idPropiedad?: number;
  estado?: string;
  filtrosAdicionales?: Record<string, any>;
}

export interface ReporteDatos {
  totalRegistros: number;
  resumen: Record<string, any>;
  detalles: any[];
  metricas: ReporteMetricas;
}

export interface ReporteMetricas {
  total?: number;
  promedio?: number;
  minimo?: number;
  maximo?: number;
  conteoPorCategoria?: Record<string, number>;
  tendencia?: {
    periodo: string;
    valor: number;
    variacion: number;
  };
}

export type FormatoReporte = "JSON" | "CSV" | "PDF" | "Excel";

// Value Objects para información extendida
export interface ReporteConDetalles extends Reporte {
  generador?: {
    id: number;
    nombreUsuario: string;
    rol: string;
  };
  estadisticas?: {
    tiempoGeneracion: number; // en milisegundos
    tamanoArchivo?: number; // en bytes
    descargas?: number;
  };
}

// Métodos de dominio
export class ReportAggregate {
  static crearReporte(data: CrearReporteData): Reporte {
    // Validaciones de negocio
    if (!data.nombre?.trim()) {
      throw new Error('El nombre del reporte es requerido');
    }
    if (!data.tipo) {
      throw new Error('El tipo de reporte es requerido');
    }
    if (!ReportAggregate.esTipoValido(data.tipo)) {
      throw new Error('El tipo de reporte no es válido');
    }

    return {
      id: 0, // Se asignará en persistencia
      nombre: data.nombre,
      tipo: data.tipo,
      descripcion: data.descripcion || null,
      parametros: data.parametros || {},
      fechaGeneracion: new Date(),
      datos: data.datos || {
        totalRegistros: 0,
        resumen: {},
        detalles: [],
        metricas: {}
      },
      formato: data.formato || 'JSON'
    };
  }

  static generarReporteVentas(parametros: ReporteParametros): ReporteDatos {
    // Simulación de generación de datos de ventas
    const datos = {
      totalRegistros: Math.floor(Math.random() * 100) + 1,
      resumen: {
        totalVentas: Math.floor(Math.random() * 1000000) + 10000,
        promedioVenta: Math.floor(Math.random() * 50000) + 5000,
        propiedadesVendidas: Math.floor(Math.random() * 50) + 1
      },
      detalles: this.generarDatosSimulados('venta', 20),
      metricas: {
        total: Math.floor(Math.random() * 1000000) + 10000,
        promedio: Math.floor(Math.random() * 50000) + 5000,
        conteoPorCategoria: {
          'Departamentos': Math.floor(Math.random() * 30) + 5,
          'Casas': Math.floor(Math.random() * 20) + 3,
          'Oficinas': Math.floor(Math.random() * 10) + 1
        },
        tendencia: {
          periodo: 'Último mes',
          valor: Math.floor(Math.random() * 100) + 1,
          variacion: (Math.random() - 0.5) * 20
        }
      }
    };

    return datos;
  }

  static generarReporteLeads(parametros: ReporteParametros): ReporteDatos {
    const datos = {
      totalRegistros: Math.floor(Math.random() * 200) + 10,
      resumen: {
        totalLeads: Math.floor(Math.random() * 200) + 10,
        leadsConvertidos: Math.floor(Math.random() * 50) + 5,
        tasaConversion: (Math.random() * 0.3 + 0.1).toFixed(2),
        leadsPendientes: Math.floor(Math.random() * 100) + 20
      },
      detalles: this.generarDatosSimulados('lead', 30),
      metricas: {
        total: Math.floor(Math.random() * 200) + 10,
        promedio: Math.floor(Math.random() * 100) + 20,
        conteoPorCategoria: {
          'Lead Propio': Math.floor(Math.random() * 100) + 30,
          'Lead Alvas': Math.floor(Math.random() * 50) + 10,
          'Referido': Math.floor(Math.random() * 30) + 5,
          'Cliente': Math.floor(Math.random() * 20) + 3
        },
        tendencia: {
          periodo: 'Última semana',
          valor: Math.floor(Math.random() * 50) + 5,
          variacion: (Math.random() - 0.5) * 15
        }
      }
    };

    return datos;
  }

  static generarReporteCitas(parametros: ReporteParametros): ReporteDatos {
    const datos = {
      totalRegistros: Math.floor(Math.random() * 150) + 20,
      resumen: {
        totalCitas: Math.floor(Math.random() * 150) + 20,
        citasRealizadas: Math.floor(Math.random() * 100) + 10,
        citasCanceladas: Math.floor(Math.random() * 30) + 5,
        citasPendientes: Math.floor(Math.random() * 50) + 10
      },
      detalles: this.generarDatosSimulados('cita', 25),
      metricas: {
        total: Math.floor(Math.random() * 150) + 20,
        promedio: Math.floor(Math.random() * 80) + 15,
        conteoPorCategoria: {
          'Realizó visita': Math.floor(Math.random() * 80) + 15,
          'No realizó visita': Math.floor(Math.random() * 30) + 5,
          'Canceló': Math.floor(Math.random() * 20) + 3,
          'Reprogramó': Math.floor(Math.random() * 15) + 2
        },
        tendencia: {
          periodo: 'Última semana',
          valor: Math.floor(Math.random() * 40) + 8,
          variacion: (Math.random() - 0.5) * 10
        }
      }
    };

    return datos;
  }

  static generarReportePropiedades(parametros: ReporteParametros): ReporteDatos {
    const datos = {
      totalRegistros: Math.floor(Math.random() * 100) + 15,
      resumen: {
        totalPropiedades: Math.floor(Math.random() * 100) + 15,
        propiedadesDisponibles: Math.floor(Math.random() * 60) + 10,
        propiedadesVendidas: Math.floor(Math.random() * 30) + 5,
        precioPromedio: Math.floor(Math.random() * 200000) + 50000
      },
      detalles: this.generarDatosSimulados('propiedad', 20),
      metricas: {
        total: Math.floor(Math.random() * 100) + 15,
        promedio: Math.floor(Math.random() * 200000) + 50000,
        minimo: Math.floor(Math.random() * 50000) + 20000,
        maximo: Math.floor(Math.random() * 500000) + 200000,
        conteoPorCategoria: {
          'Departamentos': Math.floor(Math.random() * 50) + 8,
          'Casas': Math.floor(Math.random() * 35) + 5,
          'Oficinas': Math.floor(Math.random() * 15) + 2
        },
        tendencia: {
          periodo: 'Último mes',
          valor: Math.floor(Math.random() * 30) + 5,
          variacion: (Math.random() - 0.5) * 8
        }
      }
    };

    return datos;
  }

  static generarReporteUsuarios(parametros: ReporteParametros): ReporteDatos {
    const datos = {
      totalRegistros: Math.floor(Math.random() * 50) + 5,
      resumen: {
        totalUsuarios: Math.floor(Math.random() * 50) + 5,
        usuariosActivos: Math.floor(Math.random() * 40) + 4,
        usuariosInactivos: Math.floor(Math.random() * 10) + 1,
        administradores: Math.floor(Math.random() * 5) + 1
      },
      detalles: this.generarDatosSimulados('usuario', 15),
      metricas: {
        total: Math.floor(Math.random() * 50) + 5,
        conteoPorCategoria: {
          'Administrador': Math.floor(Math.random() * 5) + 1,
          'Asesor': Math.floor(Math.random() * 40) + 4
        },
        tendencia: {
          periodo: 'Último mes',
          valor: Math.floor(Math.random() * 10) + 2,
          variacion: (Math.random() - 0.5) * 5
        }
      }
    };

    return datos;
  }

  static puedeSerGenerado(tipo: TipoReporte): boolean {
    return this.esTipoValido(tipo);
  }

  static validarParametros(tipo: TipoReporte, parametros: ReporteParametros): boolean {
    // Validaciones específicas por tipo de reporte
    switch (tipo) {
      case 'Ventas':
      case 'Leads':
      case 'Citas':
        return parametros.fechaInicio && parametros.fechaFin;
      case 'Propiedades':
        return true; // No requiere fechas obligatorias
      case 'Usuarios':
        return true; // No requiere fechas obligatorias
      default:
        return false;
    }
  }

  static calcularTiempoEstimado(tipo: TipoReporte): number {
    // Tiempo estimado en milisegundos
    const tiempos = {
      'Ventas': 3000,
      'Leads': 2500,
      'Citas': 2000,
      'Propiedades': 1500,
      'Usuarios': 1000
    };
    return tiempos[tipo] || 2000;
  }

  // Métodos privados de ayuda
  private static esTipoValido(tipo: string): tipo is TipoReporte {
    const tiposValidos: TipoReporte[] = ["Ventas", "Leads", "Citas", "Propiedades", "Usuarios"];
    return tiposValidos.includes(tipo as TipoReporte);
  }

  private static generarDatosSimulados(tipo: string, cantidad: number): any[] {
    const datos = [];
    for (let i = 0; i < cantidad; i++) {
      datos.push({
        id: i + 1,
        nombre: `${tipo} ${i + 1}`,
        valor: Math.floor(Math.random() * 1000) + 100,
        fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    return datos;
  }
}

// DTOs para operaciones del dominio
export interface CrearReporteData {
  nombre: string;
  tipo: TipoReporte;
  descripcion?: string;
  parametros?: ReporteParametros;
  datos?: ReporteDatos;
  formato?: FormatoReporte;
}

export interface ActualizarReporteData {
  nombre?: string;
  descripcion?: string;
  parametros?: ReporteParametros;
  formato?: FormatoReporte;
}
