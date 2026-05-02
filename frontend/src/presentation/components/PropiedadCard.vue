<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <!-- Header con imagen placeholder -->
    <div class="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
      <div class="text-white text-center">
        <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
        <p class="text-sm font-medium">{{ propiedad.tipoPropiedad }}</p>
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-4">
      <!-- Código y Estado -->
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ propiedad.nombre }}</h3>
          <p class="text-sm text-gray-500">{{ propiedad.codigo }}</p>
        </div>
        <span 
          :class="getEstadoClasses(propiedad.estado)"
          class="px-2 py-1 text-xs font-medium rounded-full"
        >
          {{ propiedad.estado.replace('_', ' ') }}
        </span>
      </div>

      <!-- Ubicación -->
      <div class="flex items-center text-sm text-gray-600 mb-3">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        {{ propiedad.direccion }}, {{ propiedad.ciudad }}
      </div>

      <!-- Características principales -->
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
          {{ propiedad.areaTotal }}m²
        </div>
        <div v-if="propiedad.numeroHabitaciones" class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          {{ propiedad.numeroHabitaciones }} hab
        </div>
        <div v-if="propiedad.numeroBanos" class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"/>
          </svg>
          {{ propiedad.numeroBanos }} baños
        </div>
        <div v-if="propiedad.tieneGaraje" class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
          </svg>
          Garage
        </div>
      </div>

      <!-- Servicios -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span 
          v-if="propiedad.tienePiscina" 
          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          Piscina
        </span>
        <span 
          v-if="propiedad.tieneJardin" 
          class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
        >
          Jardín
        </span>
        <span 
          v-if="propiedad.tieneAireAcondicionado" 
          class="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full"
        >
          A/A
        </span>
        <span 
          v-if="propiedad.tieneAsensor" 
          class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
        >
          Ascensor
        </span>
      </div>

      <!-- Precio -->
      <div class="border-t pt-3">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">{{ propiedad.tipoOferta.replace('_', ' & ') }}</p>
            <p class="text-xl font-bold text-indigo-600">
              {{ formatPrecio(propiedad) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">{{ propiedad.moneda }}</p>
            <p v-if="precioM2" class="text-xs text-gray-500">
              {{ precioM2 }}/m²
            </p>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="mt-4 flex gap-2">
        <button 
          @click="$emit('ver-detalles', propiedad)"
          class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Ver Detalles
        </button>
        <button 
          @click="$emit('editar', propiedad)"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Propiedad } from '~/src/domain/entities/Propiedad';

interface Props {
  propiedad: Propiedad;
}

defineProps<Props>();

defineEmits<{
  'ver-detalles': [propiedad: Propiedad];
  'editar': [propiedad: Propiedad];
}>();

const getEstadoClasses = (estado: string) => {
  const classes: Record<string, string> = {
    'Disponible': 'bg-green-100 text-green-800',
    'En_Negociacion': 'bg-yellow-100 text-yellow-800',
    'Reservada': 'bg-orange-100 text-orange-800',
    'Vendida': 'bg-red-100 text-red-800',
    'Arrendada': 'bg-purple-100 text-purple-800',
    'Retirada': 'bg-gray-100 text-gray-800',
    'Inactiva': 'bg-gray-100 text-gray-800'
  };
  return classes[estado] || 'bg-gray-100 text-gray-800';
};

const formatPrecio = (propiedad: Propiedad) => {
  const precio = propiedad.tipoOferta === 'Alquiler' ? propiedad.precioAlquiler : propiedad.precioVenta;
  if (!precio) return 'Consultar';
  
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: propiedad.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(precio);
};

const precioM2 = computed(() => {
  const precio = propiedad.tipoOferta === 'Alquiler' ? propiedad.precioAlquiler : propiedad.precioVenta;
  if (!precio || propiedad.areaTotal <= 0) return null;
  
  const precioM2Value = precio / propiedad.areaTotal;
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: propiedad.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(precioM2Value);
});
</script>
