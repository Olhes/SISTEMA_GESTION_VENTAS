<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <div class="w-6 h-6 bg-white rounded"></div>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-800">ALVAS</h1>
              <p class="text-xs text-gray-600">BIENES RAICES S.A.C.</p>
            </div>
          </div>
          
          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-700 hover:text-orange-600 font-medium">Nosotros</a>
            <a href="#" class="text-gray-700 hover:text-orange-600 font-medium">Proyectos</a>
          </nav>
          
          <!-- Account Button -->
          <button class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
            Mi cuenta
          </button>
        </div>
      </div>
    </header>

    <!-- Main Banner -->
    <section class="relative bg-gradient-to-r from-orange-100 to-amber-100 py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Left Content -->
          <div class="text-center md:text-left">
            <div class="inline-block mb-4">
              <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                ¿QUIERES VENDER
              </h2>
              <h2 class="text-4xl md:text-5xl font-bold text-orange-600">
                TU PROPIEDAD?
              </h2>
            </div>
            
            <p class="text-lg text-gray-700 mb-6">
              Terrenos, casas, departamentos, oficinas, vehículos.
            </p>
            
            <!-- Contact Info -->
            <div class="flex items-center justify-center md:justify-start space-x-3 bg-white rounded-lg px-6 py-4 shadow-md inline-block">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <div class="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <div>
                <p class="text-sm text-gray-600">Llámanos ahora</p>
                <p class="text-xl font-bold text-gray-800">941 580 544</p>
              </div>
            </div>
          </div>
          
          <!-- Right Images Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div class="bg-gray-300 rounded-lg h-32 flex items-center justify-center">
                <div class="w-16 h-16 bg-gray-400 rounded"></div>
              </div>
              <div class="bg-gray-300 rounded-lg h-32 flex items-center justify-center">
                <div class="w-16 h-16 bg-gray-400 rounded"></div>
              </div>
            </div>
            <div class="space-y-4 mt-8">
              <div class="bg-gray-300 rounded-lg h-32 flex items-center justify-center">
                <div class="w-16 h-16 bg-gray-400 rounded"></div>
              </div>
              <div class="bg-gray-300 rounded-lg h-32 flex items-center justify-center">
                <div class="w-16 h-16 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Oval Carousel -->
    <div class="flex justify-center items-center space-x-4 py-6">
      <div class="w-16 h-8 bg-orange-600 rounded-full"></div>
      <div class="w-12 h-6 bg-gray-300 rounded-full"></div>
      <div class="w-12 h-6 bg-gray-300 rounded-full"></div>
      <div class="w-12 h-6 bg-gray-300 rounded-full"></div>
    </div>

    <!-- Properties Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Nuestras Propiedades Destacadas
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Property Card 1 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-orange-400 to-amber-400"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-2">Casa Moderna</h3>
              <p class="text-gray-600 mb-4">3 habitaciones, 2 baños, 150m²</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-orange-600">$250,000</span>
                <button class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
          
          <!-- Property Card 2 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-orange-400 to-amber-400"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-2">Departamento Luxury</h3>
              <p class="text-gray-600 mb-4">2 habitaciones, 1 baño, 80m²</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-orange-600">$180,000</span>
                <button class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
          
          <!-- Property Card 3 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-orange-400 to-amber-400"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-2">Oficina Comercial</h3>
              <p class="text-gray-600 mb-4">1 piso, 1 baño, 120m²</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-orange-600">$150,000</span>
                <button class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Advisors Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Nuestros Asesores Inmobiliarios
        </h2>
        
        <div class="grid md:grid-cols-4 gap-6">
          <!-- Advisor 1 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div class="w-12 h-12 bg-gray-400 rounded-full"></div>
            </div>
            <h3 class="font-semibold text-gray-800">Carlos Mendoza</h3>
            <p class="text-sm text-gray-600">Asesor Senior</p>
          </div>
          
          <!-- Advisor 2 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div class="w-12 h-12 bg-gray-400 rounded-full"></div>
            </div>
            <h3 class="font-semibold text-gray-800">María García</h3>
            <p class="text-sm text-gray-600">Asesora Experta</p>
          </div>
          
          <!-- Advisor 3 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div class="w-12 h-12 bg-gray-400 rounded-full"></div>
            </div>
            <h3 class="font-semibold text-gray-800">Luis Rodríguez</h3>
            <p class="text-sm text-gray-600">Asesor Comercial</p>
          </div>
          
          <!-- Advisor 4 -->
          <div class="text-center">
            <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div class="w-12 h-12 bg-gray-400 rounded-full"></div>
            </div>
            <h3 class="font-semibold text-gray-800">Ana Silva</h3>
            <p class="text-sm text-gray-600">Asesora Junior</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2024 ALVAS Bienes Raíces S.A.C. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

// Solo inicializar cuando el componente esté montado
const mostrarCrearModal = ref(false)
const estadisticas = ref({
  total: 0,
  disponibles: 0,
  vendidas: 0,
  enNegociacion: 0,
  arrendadas: 0,
  porTipo: {},
  porCiudad: {},
  precioPromedioVenta: 0,
  precioPromedioAlquiler: 0
})

onMounted(async () => {
  try {
    // Importar dinámicamente para evitar problemas de inicialización
    const { usePropiedadStore } = await import('~/src/infrastructure/stores/propiedad.store')
    const propiedadStore = usePropiedadStore()
    
    await propiedadStore.inicializar()
    estadisticas.value = propiedadStore.estadisticas || estadisticas.value
  } catch (error) {
    console.error('Error loading initial data:', error)
  }
})
</script>
