/**
 * Store de Propiedades - Pinia
 * Infrastructure Layer - Estado de la aplicación
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  Propiedad, 
  CrearPropiedadData, 
  ActualizarPropiedadData,
  PropiedadEstadisticas 
} from '~/src/domain/entities/Propiedad';
import { PropiedadService } from '~/src/application/use-cases/propiedad.use-case';

export const usePropiedadStore = defineStore('propiedad', () => {
  // State
  const propiedades = ref<Propiedad[]>([]);
  const propiedadSeleccionada = ref<Propiedad | null>(null);
  const loading = ref(false);
  const error = ref<string>('');
  const estadisticas = ref<PropiedadEstadisticas | null>(null);

  // Service
  const propiedadService = new PropiedadService();

  // Getters
  const disponiblesParaVenta = computed(() => 
    propiedades.value.filter(p => 
      p.estado === 'Disponible' && 
      (p.tipoOferta === 'Venta' || p.tipoOferta === 'Venta_y_Alquiler')
    )
  );

  const disponiblesParaAlquiler = computed(() => 
    propiedades.value.filter(p => 
      p.estado === 'Disponible' && 
      (p.tipoOferta === 'Alquiler' || p.tipoOferta === 'Venta_y_Alquiler')
    )
  );

  const propiedadesPorTipo = computed(() => {
    const porTipo: Record<string, number> = {};
    propiedades.value.forEach(propiedad => {
      porTipo[propiedad.tipoPropiedad] = (porTipo[propiedad.tipoPropiedad] || 0) + 1;
    });
    return porTipo;
  });

  const propiedadesPorCiudad = computed(() => {
    const porCiudad: Record<string, number> = {};
    propiedades.value.forEach(propiedad => {
      porCiudad[propiedad.ciudad] = (porCiudad[propiedad.ciudad] || 0) + 1;
    });
    return porCiudad;
  });

  // Actions
  const cargarPropiedades = async () => {
    loading.value = true;
    error.value = '';
    
    try {
      propiedades.value = await propiedadService.findAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar propiedades';
      console.error('Error loading properties:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarPropiedad = async (id: number) => {
    loading.value = true;
    error.value = '';
    
    try {
      const propiedad = await propiedadService.findById(id);
      if (propiedad) {
        propiedadSeleccionada.value = propiedad;
      } else {
        error.value = 'Propiedad no encontrada';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar propiedad';
      console.error('Error loading property:', err);
    } finally {
      loading.value = false;
    }
  };

  const crearPropiedad = async (data: CrearPropiedadData) => {
    loading.value = true;
    error.value = '';
    
    try {
      const nuevaPropiedad = await propiedadService.crearPropiedad(data);
      propiedades.value.push(nuevaPropiedad);
      return nuevaPropiedad;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear propiedad';
      console.error('Error creating property:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const actualizarPropiedad = async (id: number, data: ActualizarPropiedadData) => {
    loading.value = true;
    error.value = '';
    
    try {
      const propiedadActualizada = await propiedadService.actualizarPropiedad(id, data);
      
      // Actualizar en la lista
      const index = propiedades.value.findIndex(p => p.id === id);
      if (index !== -1) {
        propiedades.value[index] = propiedadActualizada;
      }
      
      // Actualizar seleccionada si es la misma
      if (propiedadSeleccionada.value?.id === id) {
        propiedadSeleccionada.value = propiedadActualizada;
      }
      
      return propiedadActualizada;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar propiedad';
      console.error('Error updating property:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const eliminarPropiedad = async (id: number) => {
    loading.value = true;
    error.value = '';
    
    try {
      await propiedadService.eliminarPropiedad(id);
      
      // Eliminar de la lista
      propiedades.value = propiedades.value.filter(p => p.id !== id);
      
      // Limpiar seleccionada si es la misma
      if (propiedadSeleccionada.value?.id === id) {
        propiedadSeleccionada.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar propiedad';
      console.error('Error deleting property:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const buscarPropiedades = async (term: string) => {
    loading.value = true;
    error.value = '';
    
    try {
      const resultados = await propiedadService.buscarPropiedades(term);
      return resultados;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al buscar propiedades';
      console.error('Error searching properties:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const cargarEstadisticas = async () => {
    loading.value = true;
    error.value = '';
    
    try {
      estadisticas.value = await propiedadService.obtenerEstadisticas();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      console.error('Error loading statistics:', err);
    } finally {
      loading.value = false;
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    loading.value = true;
    error.value = '';
    
    try {
      const propiedadActualizada = await propiedadService.cambiarEstado(id, nuevoEstado);
      
      // Actualizar en la lista
      const index = propiedades.value.findIndex(p => p.id === id);
      if (index !== -1) {
        propiedades.value[index] = propiedadActualizada;
      }
      
      // Actualizar seleccionada si es la misma
      if (propiedadSeleccionada.value?.id === id) {
        propiedadSeleccionada.value = propiedadActualizada;
      }
      
      return propiedadActualizada;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cambiar estado';
      console.error('Error changing property status:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const generarCodigoUnico = async () => {
    try {
      return await propiedadService.generarCodigoUnico();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al generar código';
      console.error('Error generating code:', err);
      throw err;
    }
  };

  const limpiarSeleccion = () => {
    propiedadSeleccionada.value = null;
  };

  const limpiarError = () => {
    error.value = '';
  };

  // Métodos de filtrado
  const filtrarPorTipo = (tipo: string) => {
    return propiedades.value.filter(p => p.tipoPropiedad === tipo);
  };

  const filtrarPorEstado = (estado: string) => {
    return propiedades.value.filter(p => p.estado === estado);
  };

  const filtrarPorCiudad = (ciudad: string) => {
    return propiedades.value.filter(p => p.ciudad.toLowerCase() === ciudad.toLowerCase());
  };

  const filtrarPorRangoPrecio = (minPrecio?: number, maxPrecio?: number) => {
    return propiedades.value.filter(propiedad => {
      const precio = propiedad.precioVenta || propiedad.precioAlquiler;
      if (!precio) return false;
      
      if (minPrecio !== undefined && precio < minPrecio) return false;
      if (maxPrecio !== undefined && precio > maxPrecio) return false;
      
      return true;
    });
  };

  // Inicialización
  const inicializar = async () => {
    await Promise.all([
      cargarPropiedades(),
      cargarEstadisticas()
    ]);
  };

  return {
    // State
    propiedades,
    propiedadSeleccionada,
    loading,
    error,
    estadisticas,
    
    // Getters
    disponiblesParaVenta,
    disponiblesParaAlquiler,
    propiedadesPorTipo,
    propiedadesPorCiudad,
    
    // Actions
    cargarPropiedades,
    cargarPropiedad,
    crearPropiedad,
    actualizarPropiedad,
    eliminarPropiedad,
    buscarPropiedades,
    cargarEstadisticas,
    cambiarEstado,
    generarCodigoUnico,
    limpiarSeleccion,
    limpiarError,
    inicializar,
    
    // Métodos de filtrado
    filtrarPorTipo,
    filtrarPorEstado,
    filtrarPorCiudad,
    filtrarPorRangoPrecio
  };
});
