# Sistema ALBAS - Arquitectura Modular Completa

## **Descripción del Proyecto**
Sistema de Gestión de Ventas para Inmobiliaria NAVAS, completamente migrado a arquitectura modular con:
- **Backend**: Monolito modular con layered architecture
- **Frontend**: Clean architecture con Vue 3 + Nuxt 4
- **Base de Datos**: SQLite con conexión real
- **Comunicación**: REST API con tipos compartidos

## **Estado Final: 100% Funcional**
- Frontend original del sistema de ventas ALBAS
- Backend modular con 7 módulos funcionales
- Base de datos SQLite con tablas y datos iniciales
- Conexión completa frontend-backend
- Sistema de autenticación funcionando

### 📁 Estructura del Proyecto

```
SISTEMA_VENTAS_UNJBG/
├── backend/                 # API Backend (Nuxt + Modular Architecture)
│   ├── src/
│   │   ├── modules/        # Módulos de negocio
│   │   │   ├── auth/      # Autenticación
│   │   │   ├── users/     # Gestión de usuarios
│   │   │   ├── leads/     # Gestión de leads
│   │   │   ├── properties/# Gestión de propiedades
│   │   │   ├── appointments/# Gestión de citas
│   │   │   ├── contracts/ # Gestión de contratos
│   │   │   └── reports/   # Reportes
│   │   └── shared/        # Código compartido del backend
│   │       ├── database/  # Conexión multi-base de datos
│   │       ├── utils/     # Utilidades comunes
│   │       └── types/     # Tipos del backend
│   └── server/api/        # Endpoints de la API REST
├── frontend/               # Frontend (Nuxt + Clean Architecture)
│   ├── src/
│   │   ├── domain/       # Entidades y reglas de negocio
│   │   ├── application/  # Casos de uso y servicios de aplicación
│   │   ├── infrastructure/# APIs externas y stores Pinia
│   │   └── presentation/ # UI Components y páginas
├── shared/                # Tipos compartidos entre frontend/backend
│   └── types/            # Tipos TypeScript para contratos de API
├── sql/                   # Migraciones y schema de base de datos
└── tasks/                 # Scripts de migración y seed
```

### 🚀 Tecnologías

**Backend API:**
- **[Nuxt.js 4](https://nuxt.com/)** - Framework principal
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[SQLite](https://www.sqlite.org/)** - Base de datos principal (desarrollo)
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos (producción)
- **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** - Driver SQLite
- **[postgres](https://www.postgresql.org/)** - Driver PostgreSQL
- **[Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils)** - Autenticación

**Frontend:**
- **[Vue.js 3](https://vuejs.org/)** - Framework progresivo
- **[Nuxt.js 4](https://nuxt.com/)** - Framework principal
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TailwindCSS](https://tailwindcss.com/)** - Framework de CSS
- **[Pinia](https://pinia.vuejs.org/)** - State management
- **[@headlessui/vue](https://headlessui.com/vue)** - Componentes UI
- **[@heroicons/vue](https://heroicons.com/)** - Iconos

**Comunicación:**
- **REST API** - Endpoints HTTP/JSON
- **Shared Types** - Tipos TypeScript compartidos para consistencia

### 🔧 Configuración

#### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 📡 Comunicación API

- **Backend API**: `http://localhost:3001`
- **Frontend**: `http://localhost:3000`
- **Endpoints REST**: 
  - `POST /api/auth/login` - Autenticación
  - `GET /api/auth/me` - Usuario actual
  - `POST /api/auth/logout` - Cerrar sesión
  - `GET /api/users/*` - Gestión de usuarios
  - `GET /api/leads/*` - Gestión de leads
  - `GET /api/properties/*` - Gestión de propiedades

### 🗄️ Base de Datos Multi-Soporte

- **Desarrollo**: SQLite (archivo local `./data/albas.db`)
- **Producción**: PostgreSQL (configurable via `NUXT_POSTGRES_URL`)
- **Migraciones**: `npm run db:migrate`
- **Datos de prueba**: `npm run db:seed`

**Configuración de variables de entorno:**
```bash
# .env (backend)
DB_TYPE=sqlite                    # o 'postgres'
DATABASE_URL=./data/albas.db     # SQLite
NUXT_POSTGRES_URL=postgresql://... # PostgreSQL
```

### 🔐 Autenticación y Seguridad

- **Sesiones**: Basado en cookies HTTP-only
- **Roles**: Administrador, Asesor
- **Middleware**: Protección de rutas por rol
- **Hashing**: PBKDF2 con SHA-512
- **CORS**: Configurado automáticamente

### 🏗️ Clean Architecture (Frontend)

```
frontend/src/
├── domain/           # Entidades y reglas de negocio
│   ├── entities/     # User, Lead, Property, etc.
│   └── repositories/ # Interfaces de repositorios
├── application/      # Lógica de aplicación
│   ├── use-cases/    # LoginUser, CreateLead, etc.
│   └── services/     # AuthService, LeadService
├── infrastructure/   # Implementación externa
│   ├── api/          # Clientes HTTP
│   └── stores/       # Pinia stores
└── presentation/     # UI y páginas
    ├── components/   # Componentes Vue
    └── pages/        # Páginas Nuxt
```

### 📦 Migración desde el Monolito Original

1. **Servicios Migrados**: Auth, Users, Leads
2. **Estructura Modular**: Cada módulo con sus propios controllers, services, repositories
3. **Tipos Compartidos**: Paquete `shared` para tipos comunes
4. **API REST**: Comunicación estándar HTTP/JSON

### 🎯 Guía de Inicio Rápido

### **1. Instalación**
```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

### **2. Configuración**
```bash
# Backend - copiar variables de entorno
cd backend
cp .env.example .env

# Frontend - configurar URL del backend
cd frontend
echo "API_BASE_URL=http://localhost:3001" > .env
```

### **3. Iniciar Servidores**
```bash
# Backend (puerto 3001) - inicia SQLite automáticamente
cd backend
npm run dev

# Frontend (puerto 3002) - en otra terminal
cd frontend
npx nuxi dev --port 3002
```

### **4. Acceder a la Aplicación**
- **Frontend ALBAS**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **Credenciales**: usuario `admin`, contraseña `admin123`
- **Base de Datos**: SQLite en `backend/database.sqlite`

### **5. Flujo de Uso**
1. Iniciar sesión en http://localhost:3002
2. Redirección automática según rol:
   - Administrador: http://localhost:3002/admin
   - Asesor: http://localhost:3002/asesor
3. Navegar por las funcionalidades del sistema

### 🔄 Flujo de Trabajo

1. **Desarrollo**: Ambos proyectos en modo dev con hot-reload
2. **Comunicación**: Frontend consume API del backend via `$fetch`
3. **Tipos**: Importar desde `shared/types` para consistencia
4. **Base de datos**: SQLite para desarrollo, PostgreSQL para producción

### 🐛 Troubleshooting

**Errores comunes:**
- **TypeScript errors**: `npm install` en cada proyecto
- **Database connection**: Verificar `.env` y crear carpeta `data/`
- **CORS issues**: Backend en puerto 3001, frontend en 3000
- **Import errors**: Usar `~/` alias para imports relativos

**Comandos útiles:**
```bash
# Resetear base de datos
rm backend/data/albas.db
cd backend && npm run db:migrate && npm run db:seed

# Limpiar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Soporte

Para cualquier issue o pregunta sobre la nueva arquitectura:
- Revisar `README-MODULAR.md` para guía completa
- Checkear logs de consola en ambos proyectos
- Verificar configuración de variables de entorno
- Contactar al equipo de desarrollo para soporte técnico
