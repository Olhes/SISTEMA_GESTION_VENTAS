<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-lg font-bold text-gray-900">Detalles de Propiedad</h3>
        <button
          @click="$emit('cerrar')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="mt-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Imagen Placeholder -->
          <div class="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg h-64 flex items-center justify-center">
            <div class="text-white text-center">
              <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <p class="text-sm font-medium">{{ propiedad.tipoPropiedad }}</p>
            </div>
          </div>

          <!-- Información Principal -->
          <div>
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ propiedad.nombre }}</h2>
                <p class="text-sm text-gray-500">{{ propiedad.codigo }}</p>
              </div>
              <span 
                :class="getEstadoClasses(propiedad.estado)"
                class="px-3 py-1 text-sm font-medium rounded-full"
              >
                {{ propiedad.estado.replace('_', ' ') }}
              </span>
            </div>

            <!-- Ubicación -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-900 mb-2">Ubicación</h4>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                {{ propiedad.direccion }}, {{ propiedad.ciudad }}
              </div>
            </div>

            <!-- Precio -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-900 mb-2">Precio</h4>
              <div class="space-y-1">
                <div v-if="propiedad.precioVenta" class="flex justify-between">
                  <span class="text-sm text-gray-600">Venta:</span>
                  <span class="text-lg font-bold text-green-600">
                    {{ formatPrecio(propiedad.precioVenta, propiedad.moneda) }}
                  </span>
                </div>
                <div v-if="propiedad.precioAlquiler" class="flex justify-between">
                  <span class="text-sm text-gray-600">Alquiler:</span>
                  <span class="text-lg font-bold text-blue-600">
                    {{ formatPrecio(propiedad.precioAlquiler, propiedad.moneda) }}/mes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Características -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <!-- Características Físicas -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Características</h4>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center text-sm">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                {{ propiedad.areaTotal }}m² totales
              </div>
              <div v-if="propiedad.numeroHabitaciones" class="flex items-center text-sm">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                {{ propiedad.numeroHabitaciones }} hab.
              </div>
              <div v-if="propiedad.numeroBanos" class="flex items-center text-sm">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"/>
                </svg>
                {{ propiedad.numeroBanos }} baños
              </div>
              <div v-if="propiedad.numeroPisos" class="flex items-center text-sm">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                </svg>
                {{ propiedad.numeroPisos }} pisos
              </div>
            </div>
          </div>

          <!-- Servicios -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Servicios</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-if="propiedad.tieneGaraje" 
                class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                🚗 Garaje
              </span>
              <span 
                v-if="propiedad.tienePatio" 
                class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                🌿 Patio
              </span>
              <span 
                v-if="propiedad.tieneJardin" 
                class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                🌺 Jardín
              </span>
              <span 
                v-if="propiedad.tienePiscina" 
                class="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full"
              >
                🏊 Piscina
              </span>
              <span 
                v-if="propiedad.tieneAsensor" 
                class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
              >
                🛗 Ascensor
              </span>
              <span 
                v-if="propiedad.tieneAireAcondicionado" 
                class="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full"
              >
                ❄️ A/A
              </span>
              <span 
                v-if="propiedad.tieneGasNatural" 
                class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
              >
                🔥 Gas Natural
              </span>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div v-if="propiedad.descripcionDetallada" class="mt-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>
          <p class="text-sm text-gray-600">{{ propiedad.descripcionDetallada }}</p>
        </div>

        <!-- Información Adicional -->
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Tipo Oferta:</span>
            <p class="font-medium">{{ propiedad.tipoOferta.replace('_', ' & ') }}</p>
          </div>
          <div>
            <span class="text-gray-500">Estado Físico:</span>
            <p class="font-medium">{{ propiedad.estadoFisico }}</p>
          </div>
          <div>
            <span class="text-gray-500">Moneda:</span>
            <p class="font-medium">{{ propiedad.moneda }}</p>
          </div>
          <div>
            <span class="text-gray-500">Creada:</span>
            <p class="font-medium">{{ formatDate(propiedad.fechaCreacion) }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            @click="$emit('editar', propiedad)"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Editar Propiedad
          </button>
          <button
            @click="$emit('cerrar')"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import type { Propiedad } from '~/src/domain/entities/Propiedad'

interface Props {
  propiedad: Propiedad
}

defineProps<Props>()

defineEmits<{
  cerrar: []
  editar: [propiedad: Propiedad]
}>()

const getEstadoClasses = (estado: string) => {
  const classes: Record<string, string> = {
    'Disponible': 'bg-green-100 text-green-800',
    'En_Negociacion': 'bg-yellow-100 text-yellow-800',
    'Reservada': 'bg-orange-100 text-orange-800',
    'Vendida': 'bg-red-100 text-red-800',
    'Arrendada': 'bg-purple-100 text-purple-800',
    'Retirada': 'bg-gray-100 text-gray-800',
    'Inactiva': 'bg-gray-100 text-gray-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrecio = (precio: number, moneda: string) => {
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  return formatter.format(precio)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}
</script>
