<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Panel Asesor</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ authStore.userFullName }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
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
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Leads de Captación
              </h3>
              
              <!-- Stats -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <div class="text-sm font-medium text-blue-600">Total Leads</div>
                  <div class="text-2xl font-bold text-blue-900">{{ leadsStats.total }}</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <div class="text-sm font-medium text-green-600">En Seguimiento</div>
                  <div class="text-2xl font-bold text-green-900">{{ leadsStats.seguimiento }}</div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <div class="text-sm font-medium text-yellow-600">Por Contactar</div>
                  <div class="text-2xl font-bold text-yellow-900">{{ leadsStats.porContactar }}</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex space-x-4 mb-6">
                <button
                  @click="showCreateLeadModal = true"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Nuevo Lead
                </button>
                <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Exportar
                </button>
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
                        Teléfono
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
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ lead.nombres }} {{ lead.apellido_paterno }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ lead.telefono }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {{ lead.estado_vendedor }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                        <button class="text-red-600 hover:text-red-900">Eliminar</button>
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
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Gestión de Citas
              </h3>
              <p class="text-gray-600">Gestiona las visitas guiadas con los clientes.</p>
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
              <p class="text-gray-600">Visualiza y gestiona las ventas realizadas.</p>
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

const leadsStats = ref({
  total: 0,
  seguimiento: 0,
  porContactar: 0
})

const leads = ref([])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const loadLeads = async () => {
  // TODO: Cargar leads desde la API
  leads.value = [
    {
      id_persona: 1,
      nombres: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'López',
      telefono: '987654321',
      estado_vendedor: 'Seguimiento'
    }
  ]
  
  leadsStats.value = {
    total: leads.value.length,
    seguimiento: leads.value.filter(l => l.estado_vendedor === 'Seguimiento').length,
    porContactar: leads.value.filter(l => l.estado_vendedor === 'No responde').length
  }
}

onMounted(() => {
  loadLeads()
})
</script>
