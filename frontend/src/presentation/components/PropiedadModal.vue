<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-lg font-bold text-gray-900">
          {{ propiedad ? 'Editar Propiedad' : 'Nueva Propiedad' }}
        </h3>
        <button
          @click="$emit('cancelar')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="guardar" class="mt-4 space-y-4">
        <!-- Información Básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Código</label>
            <input
              v-model="formData.codigo"
              type="text"
              required
              :disabled="!!propiedad"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="PROP-2025-001"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              v-model="formData.nombre"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Casa de 3 habitaciones"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipo Propiedad</label>
            <select
              v-model="formData.tipoPropiedad"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar...</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Terreno">Terreno</option>
              <option value="Oficina">Oficina</option>
              <option value="Local_Comercial">Local Comercial</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <select
              v-model="formData.estado"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Disponible">Disponible</option>
              <option value="En_Negociacion">En Negociación</option>
              <option value="Reservada">Reservada</option>
              <option value="Vendida">Vendida</option>
              <option value="Arrendada">Arrendada</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipo Oferta</label>
            <select
              v-model="formData.tipoOferta"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Venta_y_Alquiler">Venta y Alquiler</option>
            </select>
          </div>
        </div>

        <!-- Ubicación -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              v-model="formData.direccion"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Av. Principal 123"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              v-model="formData.ciudad"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Lima"
            />
          </div>
        </div>

        <!-- Características -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Área Total (m²)</label>
            <input
              v-model.number="formData.areaTotal"
              type="number"
              required
              min="1"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="120"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Habitaciones</label>
            <input
              v-model.number="formData.numeroHabitaciones"
              type="number"
              min="0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="3"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Baños</label>
            <input
              v-model.number="formData.numeroBanos"
              type="number"
              min="0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="2"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Pisos</label>
            <input
              v-model.number="formData.numeroPisos"
              type="number"
              min="0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="2"
            />
          </div>
        </div>

        <!-- Precios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Precio Venta</label>
            <input
              v-model.number="formData.precioVenta"
              type="number"
              min="0"
              step="0.01"
              :required="formData.tipoOferta === 'Venta' || formData.tipoOferta === 'Venta_y_Alquiler'"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="250000"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Precio Alquiler</label>
            <input
              v-model.number="formData.precioAlquiler"
              type="number"
              min="0"
              step="0.01"
              :required="formData.tipoOferta === 'Alquiler' || formData.tipoOferta === 'Venta_y_Alquiler'"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="1500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Moneda</label>
            <select
              v-model="formData.moneda"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="PEN">Soles (PEN)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
        </div>

        <!-- Servicios -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Servicios y Características</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <label class="flex items-center">
              <input
                v-model="formData.tieneGaraje"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Garaje</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.tienePatio"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Patio</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.tieneJardin"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Jardín</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.tienePiscina"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Piscina</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.tieneAsensor"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Ascensor</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.tieneAireAcondicionado"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Aire Acond.</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.tieneGasNatural"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Gas Natural</span>
            </label>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción Detallada</label>
          <textarea
            v-model="formData.descripcionDetallada"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Descripción completa de la propiedad..."
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('cancelar')"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>
              {{ propiedad ? 'Actualizar' : 'Crear' }} Propiedad
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePropiedadStore } from '~/src/infrastructure/stores/propiedad.store'

interface Props {
  propiedad?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  guardar: [data: any]
  cancelar: []
}>()

const propiedadStore = usePropiedadStore()
const loading = ref(false)

const formData = ref({
  codigo: '',
  nombre: '',
  tipoPropiedad: 'Casa',
  descripcionDetallada: '',
  direccion: '',
  ciudad: '',
  departamento: '',
  codigoPostal: '',
  areaTotal: 0,
  areaUsable: null,
  numeroHabitaciones: null,
  numeroBanos: null,
  numeroPisos: null,
  tieneGaraje: false,
  numeroGarajes: null,
  tienePatio: false,
  tieneJardin: false,
  tienePiscina: false,
  tieneAsensor: false,
  tieneAireAcondicionado: false,
  tieneGasNatural: false,
  precioVenta: null,
  precioAlquiler: null,
  moneda: 'PEN',
  estado: 'Disponible',
  estadoFisico: 'Buena',
  tipoOferta: 'Venta',
  idUsuarioCreador: 1 // Hardcoded por ahora
})

onMounted(async () => {
  if (props.propiedad) {
    // Si estamos editando, cargamos los datos
    Object.assign(formData.value, props.propiedad)
  } else {
    // Si es nuevo, generamos código único
    try {
      formData.value.codigo = await propiedadStore.generarCodigoUnico()
    } catch (error) {
      console.error('Error generating unique code:', error)
    }
  }
})

const guardar = async () => {
  loading.value = true
  try {
    await emit('guardar', formData.value)
  } finally {
    loading.value = false
  }
}
</script>
