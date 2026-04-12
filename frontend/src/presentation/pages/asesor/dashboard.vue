<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">A</span>
              </div>
            </div>
            <div class="ml-4">
              <h1 class="text-xl font-semibold text-gray-900">Panel Asesor</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-gray-600 text-sm font-medium">
                  {{ authStore.user?.nombre_usuario?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ authStore.user?.nombre_completo }}</p>
                <p class="text-xs text-gray-500">{{ authStore.user?.rol }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'captacion'"
            :class="[
              activeTab === 'captacion'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Captación
          </button>
          <button
            @click="activeTab = 'citas'"
            :class="[
              activeTab === 'citas'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Citas
          </button>
          <button
            @click="activeTab = 'ventas'"
            :class="[
              activeTab === 'ventas'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Ventas
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Captación Tab -->
        <div v-if="activeTab === 'captacion'" class="space-y-6">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Leads de Captación
                </h3>
                <button
                  @click="showCreateLeadModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Nuevo Lead
                </button>
              </div>
              
              <!-- Stats -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-blue-600">Total Leads</div>
                      <div class="text-2xl font-bold text-blue-900">{{ leadsStats.total }}</div>
                    </div>
                  </div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-green-600">En Seguimiento</div>
                      <div class="text-2xl font-bold text-green-900">{{ leadsStats.seguimiento }}</div>
                    </div>
                  </div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-yellow-600">Por Contactar</div>
                      <div class="text-2xl font-bold text-yellow-900">{{ leadsStats.porContactar }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Leads Table -->
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="lead in leads" :key="lead.id_persona">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                          {{ lead.nombres }} {{ lead.apellido_paterno }}
                        </div>
                        <div class="text-sm text-gray-500">{{ lead.tipo_documento }}: {{ lead.numero_documento }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ lead.telefono }}</div>
                        <div class="text-sm text-gray-500">{{ lead.correo }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          :class="[
                            lead.estado_vendedor === 'Seguimiento' ? 'bg-green-100 text-green-800' : 
                            lead.estado_vendedor === 'No responde' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800',
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                          ]"
                        >
                          {{ lead.estado_vendedor }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          @click="editLead(lead)"
                          class="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Editar
                        </button>
                        <button 
                          @click="deleteLead(lead.id_persona)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Citas Tab -->
        <div v-if="activeTab === 'citas'" class="space-y-6">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Gestión de Citas
                </h3>
                <button
                  @click="showCreateAppointmentModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Nueva Cita
                </button>
              </div>
              
              <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Comienza agendando tu primera visita guiada
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ventas Tab -->
        <div v-if="activeTab === 'ventas'" class="space-y-6">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Ventas y Conversiones
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-green-600">Ventas del Mes</div>
                      <div class="text-3xl font-bold text-green-900">3</div>
                      <div class="text-sm text-green-500">+25% vs mes anterior</div>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-blue-600">Comisiones</div>
                      <div class="text-3xl font-bold text-blue-900">$2,450</div>
                      <div class="text-sm text-blue-500">Este mes</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Sin ventas registradas</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Tus ventas aparecerán aquí una vez que las completes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/src/infrastructure/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('captacion')
const showCreateLeadModal = ref(false)
const showCreateAppointmentModal = ref(false)

const leadsStats = ref({
  total: 0,
  seguimiento: 0,
  porContactar: 0
})

const leads = ref([])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const loadLeads = async () => {
  // TODO: Cargar leads desde la API
  leads.value = [
    {
      id_persona: 1,
      nombres: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'López',
      tipo_documento: 'DNI',
      numero_documento: '12345678',
      telefono: '987654321',
      correo: 'juan@example.com',
      estado_vendedor: 'Seguimiento'
    },
    {
      id_persona: 2,
      nombres: 'María',
      apellido_paterno: 'García',
      apellido_materno: 'Martínez',
      tipo_documento: 'DNI',
      numero_documento: '87654321',
      telefono: '123456789',
      correo: 'maria@example.com',
      estado_vendedor: 'No responde'
    }
  ]
  
  leadsStats.value = {
    total: leads.value.length,
    seguimiento: leads.value.filter(l => l.estado_vendedor === 'Seguimiento').length,
    porContactar: leads.value.filter(l => l.estado_vendedor === 'No responde').length
  }
}

const editLead = (lead) => {
  console.log('Edit lead:', lead)
  // TODO: Implementar edición de lead
}

const deleteLead = async (id) => {
  if (confirm('¿Estás seguro de eliminar este lead?')) {
    // TODO: Implementar eliminación de lead
    console.log('Delete lead:', id)
  }
}

onMounted(() => {
  loadLeads()
})
</script>
