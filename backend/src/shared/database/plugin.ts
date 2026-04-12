import DatabaseManager from './connection'
import { initializeDatabase } from './init'

export default defineNuxtPlugin(async () => {
  try {
    // Inicializar base de datos
    await initializeDatabase()
    
    console.log('Database plugin initialized successfully')
  } catch (error) {
    console.error('Database plugin initialization failed:', error)
  }
})
