# Sistema ALBAS - Arquitectura Modular Completa

## **🎯 Descripción del Proyecto**
Sistema de Gestión de Ventas para Inmobiliaria NAVAS, **completamente migrado** desde monolito a arquitectura modular moderna:

- **🏗️ Backend**: Monolito modular con layered architecture (7 módulos)
- **🎨 Frontend**: Clean architecture con Vue 3 + Nuxt 4 + TailwindCSS
- **🗄️ Base de Datos**: SQLite con conexión real y tablas automáticas
- **🔗 Comunicación**: REST API con tipos sincronizados
- **🔐 Autenticación**: Session-based con roles (Administrador/Asesor)

## **✅ Estado Final: 100% Funcional**
- ✅ Frontend original del sistema de ventas ALBAS
- ✅ Backend modular con 7 módulos funcionales
- ✅ Base de datos SQLite con tablas y datos iniciales
- ✅ Conexión completa frontend-backend
- ✅ Sistema de autenticación funcionando
- ✅ Documentación completa y flujo mapeado

---

## **📁 Estructura Modular Final**

```
SISTEMA_VENTAS_UNJBG/
├── 📁 backend/ (3001)                 # Monolito Modular Backend
│   ├── 📁 src/
│   │   ├── 📁 modules/                # 7 Módulos de Negocio
│   │   │   ├── 📁 auth/              # Autenticación y Sesiones
│   │   │   ├── 📁 users/             # Gestión de Usuarios/Asesores
│   │   │   ├── 📁 leads/             # Captación de Leads
│   │   │   ├── 📁 properties/        # Gestión de Propiedades
│   │   │   ├── 📁 appointments/       # Gestión de Citas
│   │   │   ├── 📁 contracts/         # Generación de Contratos
│   │   │   └── 📁 reports/           # Reportes y Estadísticas
│   │   └── 📁 shared/                # Código Compartido Backend
│   │       ├── 📁 database/          # Conexión SQLite/PostgreSQL
│   │       ├── 📁 utils/             # Hash, Validaciones
│   │       └── 📁 types/             # Tipos del Backend
│   ├── 📁 server/api/               # Endpoints REST API
│   │   ├── 📁 auth/                  # /api/auth/login
│   │   ├── 📁 admin/                 # /api/admin/asesores
│   │   ├── 📁 asesor/                # /api/asesor/captacion/leads
│   │   ├── 📁 properties/            # /api/properties
│   │   ├── 📁 appointments/          # /api/appointments
│   │   ├── 📁 contracts/             # /api/contracts
│   │   └── 📁 reports/               # /api/reports/ventas
│   ├── 📄 database.sqlite            # Base de Datos SQLite
│   └── 📄 nuxt.config.ts
├── 📁 frontend/ (3002)               # Clean Architecture Frontend
│   ├── 📁 src/
│   │   ├── 📁 domain/                 # Entidades y Reglas de Negocio
│   │   ├── 📁 application/            # Casos de Uso
│   │   ├── 📁 infrastructure/         # APIs Externas y Stores
│   │   └── 📁 presentation/          # UI - Sistema ALBAS Original
│   │       ├── 📁 pages/
│   │       │   ├── 📄 index.vue      # Login ALBAS
│   │       │   ├── 📁 admin/
│   │       │   │   └── 📄 dashboard.vue
│   │       │   └── 📁 asesor/
│   │       │       └── 📄 dashboard.vue
│   │       ├── 📁 components/         # Componentes UI
│   │       └── 📁 layouts/           # Layouts
│   ├── 📁 assets/css/main.css         # TailwindCSS
│   └── 📄 nuxt.config.ts
├── 📄 FLUJO-ARCHIVOS.md              # Documentación de Conexiones
└── 📄 .gitignore
```

---

## **🚀 Stack Tecnológico**

### **🏗️ Backend API (Monolito Modular)**
- **[Nuxt.js 4](https://nuxt.com/)** - Framework principal con Nitro
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[SQLite](https://www.sqlite.org/)** - Base de datos (desarrollo)
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos (producción)
- **[sqlite3](https://github.com/TryGhost/node-sqlite3)** - Driver SQLite
- **[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)** - Autenticación por sesiones
- **[PBKDF2 SHA-512](https://nodejs.org/api/crypto.html#crypto_pbkdf2)** - Hash de contraseñas

### **🎨 Frontend (Clean Architecture)**
- **[Vue 3](https://vuejs.org/)** - Framework frontend
- **[Nuxt.js 4](https://nuxt.com/)** - Meta-framework
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS
- **[Pinia](https://pinia.vuejs.org/)** - Gestión de estado
- **[Vue Router](https://router.vuejs.org/)** - Enrutamiento
- **[Headless UI](https://headlessui.com/)** - Componentes UI
- **[Heroicons](https://heroicons.com/)** - Iconos SVG

---

## **🗄️ Base de Datos - Schema**

### **📊 Tablas Principales**
```sql
-- Roles de Usuario
CREATE TABLE roles (
  id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Personas (Clientes, Leads, etc.)
CREATE TABLE personas (
  id_persona INTEGER PRIMARY KEY AUTOINCREMENT,
  nombres VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100),
  tipo_documento VARCHAR(20) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  correo VARCHAR(100),
  tipo_persona VARCHAR(50) NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios del Sistema
CREATE TABLE usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  id_persona INTEGER NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  id_rol INTEGER NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_persona) REFERENCES personas(id_persona),
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Propiedades Inmobiliarias
CREATE TABLE propiedades (
  id_propiedad INTEGER PRIMARY KEY AUTOINCREMENT,
  direccion VARCHAR(255) NOT NULL,
  descripcion TEXT,
  medidas VARCHAR(100),
  servicios_basicos TEXT,
  precio_negociable DECIMAL(12,2),
  partida_registral VARCHAR(50),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Citas y Visitas
CREATE TABLE citas (
  id_cita INTEGER PRIMARY KEY AUTOINCREMENT,
  id_persona INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  fecha_agendada DATETIME NOT NULL,
  observacion TEXT,
  estado_visita_guiada VARCHAR(50) DEFAULT 'Reprogramó',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_persona) REFERENCES personas(id_persona),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

---

## **🔗 API Endpoints**

### **🔐 Autenticación**
```
POST /api/auth/login
├── Request: { username: string, password: string }
└── Response: { status: 'success', user: UserSession }
```

### **👥 Administración**
```
GET    /api/admin/asesores           # Listar asesores
POST   /api/admin/asesores           # Crear asesor
PUT    /api/admin/asesores/:id       # Actualizar asesor
DELETE /api/admin/asesores/:id       # Eliminar asesor
```

### **🎯 Asesor - Captación**
```
GET    /api/asesor/captacion/leads           # Listar leads del asesor
POST   /api/asesor/captacion/leads           # Crear nuevo lead
PUT    /api/asesor/captacion/leads/:id       # Actualizar lead
DELETE /api/asesor/captacion/leads/:id       # Eliminar lead
```

### **🏠 Propiedades**
```
GET    /api/properties              # Listar propiedades
POST   /api/properties              # Crear propiedad
PUT    /api/properties/:id          # Actualizar propiedad
DELETE /api/properties/:id          # Eliminar propiedad
```

### **📅 Citas**
```
GET    /api/appointments            # Listar citas
POST   /api/appointments            # Agendar cita
PUT    /api/appointments/:id        # Actualizar cita
DELETE /api/appointments/:id        # Cancelar cita
```

### **📄 Contratos**
```
POST   /api/contracts               # Generar contrato
GET    /api/contracts               # Listar contratos
GET    /api/contracts/:id           # Ver contrato
```

### **📊 Reportes**
```
GET    /api/reports/ventas          # Reporte de ventas
GET    /api/reports/asesores        # Reporte de asesores
GET    /api/reports/propiedades     # Reporte de propiedades
GET    /api/reports/conversion      # Reporte de conversión
```

---

## **⚡ Quick Start - Sistema Completo**

### **🔧 1. Instalación**
```bash
# Clonar repositorio
git clone <repository-url>
cd SISTEMA_VENTAS_UNJBG

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### **⚙️ 2. Configuración**
```bash
# Backend - variables de entorno
cd backend
cp .env.example .env
# Editar .env si es necesario

# Frontend - URL del backend
cd ../frontend
echo "API_BASE_URL=http://localhost:3001" > .env
```

### **🚀 3. Iniciar Sistema**
```bash
# Terminal 1: Backend (puerto 3001)
cd backend
npm run dev
# ✅ Inicia automáticamente SQLite y crea tablas

# Terminal 2: Frontend (puerto 3002)
cd frontend
npx nuxi dev --port 3002
```

### **🌐 4. Acceder al Sistema**
- **🎨 Frontend ALBAS**: http://localhost:3002
- **🔧 Backend API**: http://localhost:3001
- **👤 Login**: usuario `admin`, contraseña `admin123`
- **🗄️ Base de Datos**: `backend/database.sqlite` (creado automáticamente)

---

## **🔄 Flujo de Usuario Completo**

### **1. 🚪 Login**
```
Usuario ingresa credenciales → Frontend valida → API Backend → 
SQLite verifica → Sesión creada → Redirección según rol
```

### **2. 🎯 Administrador**
```
Dashboard → Gestión de Asesores → Reportes → 
Estadísticas → Configuración del sistema
```

### **3. 💼 Asesor**
```
Dashboard → Captación de Leads → 
Gestión de Citas → Seguimiento de Ventas → 
Reportes personales
```

---

## **🐛 Troubleshooting Común**

### **❌ Problemas Frecuentes**

**🔧 Error: Puerto en uso**
```bash
# Matar proceso en puerto 3001
npx kill-port 3001
# Matar proceso en puerto 3002  
npx kill-port 3002
```

**🗄️ Error: Base de datos no encontrada**
```bash
# El sistema crea automáticamente la base de datos
# Verificar que backend/database.sqlite exista
ls -la backend/database.sqlite
```

**🔐 Error: Sesiones no funcionan**
```bash
# Verificar variable NUXT_SESSION_PASSWORD
echo $NUXT_SESSION_PASSWORD
# Agregar a .env del backend
```

---

## **📈 Roadmap Futuro**

### **🚀 Próximas Mejoras**
- [ ] **Unit Tests** - Cobertura completa del código
- [ ] **E2E Tests** - Testing automatizado del flujo completo
- [ ] **Docker** - Contenerización del sistema
- [ ] **CI/CD** - Pipeline de integración continua
- [ ] **PostgreSQL** - Migración a producción
- [ ] **Caching** - Redis para sesiones y caché
- [ ] **WebSocket** - Notificaciones en tiempo real
- [ ] **PDF Generation** - Contratos y reportes PDF
- [ ] **File Upload** - Gestión de documentos
- [ ] **Multi-tenant** - Soporte para múltiples inmobiliarias

---

## **📄 Licencia y Contribución**

### **📜 Licencia**
Este proyecto es propiedad de **Inmobiliaria NAVAS**. Uso exclusivo para fines comerciales internos.

### **🤝 Contribución**
1. **Fork** el repositorio
2. **Branch** feature/nueva-funcionalidad
3. **Commit** cambios descriptivos
4. **Push** al branch
5. **Pull Request** con descripción detallada

### **📧 Contacto**
- **🏢 Inmobiliaria NAVAS**
- **👨‍💻 Equipo de Desarrollo**
- **📧 soporte@inmobiliarianavas.com**

---

**🎉 ¡Sistema ALBAS Modular - 100% Funcional!**
