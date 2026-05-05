<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Propiedades</h1>
            <p class="text-sm text-gray-500">Administra el catálogo de propiedades</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="mostrarCrearModal = true"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Nueva Propiedad
            </button>
            <button
              @click="cargarPropiedades"
              :disabled="loading"
              class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y Estadísticas -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Estadísticas -->
      <div v-if="estadisticas" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Propiedades</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Disponibles</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas.disponibles }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">En Negociación</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas.enNegociacion }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Vendidas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estadisticas.vendidas }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              v-model="busqueda"
              @input="buscarPropiedadesDebounced"
              type="text"
              placeholder="Código, nombre, dirección..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              v-model="filtroTipo"
              @change="aplicarFiltros"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los tipos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Terreno">Terreno</option>
              <option value="Oficina">Oficina</option>
              <option value="Local_Comercial">Local Comercial</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="filtroEstado"
              @change="aplicarFiltros"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="En_Negociacion">En Negociación</option>
              <option value="Reservada">Reservada</option>
              <option value="Vendida">Vendida</option>
              <option value="Arrendada">Arrendada</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <select
              v-model="filtroCiudad"
              @change="aplicarFiltros"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las ciudades</option>
              <option v-for="ciudad in ciudadesUnicas" :key="ciudad" :value="ciudad">
                {{ ciudad }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de Propiedades -->
      <div v-if="loading && !propiedadesFiltradas.length" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 mx-auto text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-500">Cargando propiedades...</p>
      </div>

      <div v-else-if="!propiedadesFiltradas.length && !loading" class="text-center py-12">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
        <p class="mt-2 text-gray-500">No se encontraron propiedades</p>
        <button
          @click="mostrarCrearModal = true"
          class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Crear primera propiedad
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropiedadCard
          v-for="propiedad in propiedadesFiltradas"
          :key="propiedad.id"
          :propiedad="propiedad"
          @ver-detalles="verDetalles"
          @editar="editarPropiedad"
        />
      </div>
    </div>

    <!-- Modal Crear/Editar Propiedad -->
    <PropiedadModal
      v-if="mostrarCrearModal || propiedadEditando"
      :propiedad="propiedadEditando"
      @guardar="guardarPropiedad"
      @cancelar="cancelarModal"
    />

    <!-- Modal Ver Detalles -->
    <PropiedadDetallesModal
      v-if="propiedadDetalles"
      :propiedad="propiedadDetalles"
      @cerrar="propiedadDetalles = null"
      @editar="editarPropiedad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePropiedadStore } from '~/src/infrastructure/stores/propiedad.store';
import PropiedadCard from '~/src/presentation/components/PropiedadCard.vue';
import PropiedadModal from '~/src/presentation/components/PropiedadModal.vue';
import PropiedadDetallesModal from '~/src/presentation/components/PropiedadDetallesModal.vue';
import type { Propiedad } from '~/src/domain/entities/Propiedad';

const propiedadStore = usePropiedadStore();

// State
const loading = ref(false);
const busqueda = ref('');
const filtroTipo = ref('');
const filtroEstado = ref('');
const filtroCiudad = ref('');
const mostrarCrearModal = ref(false);
const propiedadEditando = ref<Propiedad | null>(null);
const propiedadDetalles = ref<Propiedad | null>(null);

// Computed
const propiedades = computed(() => propiedadStore.propiedades);
const estadisticas = computed(() => propiedadStore.estadisticas);

const propiedadesFiltradas = computed(() => {
  let filtradas = propiedades.value;

  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase();
    filtradas = filtradas.filter(p => 
      p.codigo.toLowerCase().includes(termino) ||
      p.nombre.toLowerCase().includes(termino) ||
      p.direccion.toLowerCase().includes(termino) ||
      p.ciudad.toLowerCase().includes(termino)
    );
  }

  if (filtroTipo.value) {
    filtradas = filtradas.filter(p => p.tipoPropiedad === filtroTipo.value);
  }

  if (filtroEstado.value) {
    filtradas = filtradas.filter(p => p.estado === filtroEstado.value);
  }

  if (filtroCiudad.value) {
    filtradas = filtradas.filter(p => p.ciudad === filtroCiudad.value);
  }

  return filtradas;
});

const ciudadesUnicas = computed(() => {
  const ciudades = [...new Set(propiedades.value.map(p => p.ciudad))];
  return ciudades.sort();
});

// Methods
const cargarPropiedades = async () => {
  loading.value = true;
  try {
    await propiedadStore.inicializar();
  } finally {
    loading.value = false;
  }
};

const buscarPropiedadesDebounced = debounce(() => {
  // La búsqueda se aplica automáticamente con el computed
}, 300);

const aplicarFiltros = () => {
  // Los filtros se aplican automáticamente con el computed
};

const verDetalles = (propiedad: Propiedad) => {
  propiedadDetalles.value = propiedad;
};

const editarPropiedad = (propiedad: Propiedad) => {
  propiedadEditando.value = propiedad;
  propiedadDetalles.value = null;
};

const guardarPropiedad = async (data: any) => {
  try {
    if (propiedadEditando.value) {
      await propiedadStore.actualizarPropiedad(propiedadEditando.value.id, data);
    } else {
      await propiedadStore.crearPropiedad(data);
    }
    cancelarModal();
  } catch (error) {
    console.error('Error saving property:', error);
  }
};

const cancelarModal = () => {
  mostrarCrearModal.value = false;
  propiedadEditando.value = null;
};

// Lifecycle
onMounted(() => {
  cargarPropiedades();
});

// Helper
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
</script>
