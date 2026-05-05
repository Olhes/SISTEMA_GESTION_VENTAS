# Flujo Completo de Archivos Conectados - Sistema ALBAS

## **Arquitectura General**
```
Frontend (3002)  <--API REST-->  Backend (3001) <--SQLite-->  Database.sqlite
```

---

## **FRONTEND - Clean Architecture**

### **1. Login y Autenticación**
```
src/presentation/pages/index.vue
    |
    v (handleLogin)
src/infrastructure/stores/auth.store.ts
    |
    v (LoginUseCase)
src/application/use-cases/auth/login.use-case.ts
    |
    v (login)
src/infrastructure/api/auth.api.ts
    |
    v (POST /api/auth/login)
Backend: server/api/auth/login.post.ts
```

### **2. Panel Administrador**
```
src/presentation/pages/admin/dashboard.vue
    |
    v (useAuthStore)
src/infrastructure/stores/auth.store.ts
    |
    v (getUser)
src/infrastructure/api/auth.api.ts
```

### **3. Panel Asesor**
```
src/presentation/pages/asesor/dashboard.vue
    |
    v (loadLeads)
src/infrastructure/api/leads.api.ts
    |
    v (GET /api/asesor/captacion/leads)
Backend: server/api/asesor/captacion/leads/index.get.ts
```

---

## **BACKEND - Arquitectura Hexagonal Modular**

### **1. Autenticación (Auth Module)**
```
API Request
    |
    v (AuthController)
src/modules/auth/infrastructure/api/AuthController.ts
    |
    v (AuthService - Caso de Uso)
src/modules/auth/application/use_cases/AuthService.ts
    |
    v (AuthAggregate - Dominio)
src/modules/auth/domain/entities/Auth.ts
    |
    v (AuthSqliteRepo - Adaptador)
src/modules/auth/infrastructure/persistence/AuthSqliteRepo.ts
    |
    v (Database)
src/shared/database/
    |
    v (SQLite)
./database.sqlite
```

### **2. Estructura Hexagonal por Módulo**
```
modules/
├── auth/
│   ├── domain/           # Lógica de negocio pura
│   │   ├── entities/    # AuthAggregate, Usuario, Sesion
│   │   └── ports/        # IAuthUseCase (driving), IAuthRepo (driven)
│   ├── application/      # Casos de uso
│   │   └── use_cases/    # AuthService
│   ├── infrastructure/   # Adaptadores
│   │   ├── api/          # AuthController (HTTP)
│   │   ├── persistence/  # AuthSqliteRepo (DB)
│   │   └── mappers/      # Transformaciones
│   └── container.ts      # DI Container
├── users/               # Estructura similar
├── leads/               # Estructura similar
├── properties/          # Estructura similar
├── appointments/         # Estructura similar
├── contracts/           # Estructura similar
└── reports/             # Estructura similar
```

---

## **BASE DE DATOS - SQLite**

### **1. Inicialización**
```
backend/src/shared/database/
    |
    v (initializeDatabase)
SQLite: ./database.sqlite
```

### **2. Tablas Creadas**
```sql
-- Roles
CREATE TABLE roles (
  id_rol INTEGER PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL
);

-- Personas
CREATE TABLE personas (
  id_persona INTEGER PRIMARY KEY,
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

-- Usuarios
CREATE TABLE usuarios (
  id_usuario INTEGER PRIMARY KEY,
  id_persona INTEGER NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  id_rol INTEGER NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_persona) REFERENCES personas(id_persona),
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Propiedades
CREATE TABLE propiedades (
  id_propiedad INTEGER PRIMARY KEY,
  direccion VARCHAR(255) NOT NULL,
  descripcion TEXT,
  medidas VARCHAR(100),
  servicios_basicos TEXT,
  precio_negociable DECIMAL(12,2),
  partida_registral VARCHAR(50),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Citas
CREATE TABLE citas (
  id_cita INTEGER PRIMARY KEY,
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

## **TIPOS Y CONFIGURACIÓN**

### **1. Frontend Types**
```
frontend/src/types/api.ts
    |
    v (import)
frontend/src/infrastructure/api/*.ts
frontend/src/infrastructure/stores/*.ts
```

### **Backend Types**
```
backend/src/shared/types/
    |
    v (import)
backend/src/modules/*/domain/entities/*.ts
backend/src/modules/*/domain/ports/*.ts
```

### **3. Configuración**
```
Frontend: frontend/nuxt.config.ts
    - API Base URL: http://localhost:3001
    - TailwindCSS
    - Pinia Stores

Backend: backend/nuxt.config.ts
    - Database Plugin
    - Auth Utils
    - Session Configuration
    - Arquitectura Hexagonal
```

---

## **FLUJO COMPLETO DE USUARIO**

### **1. Login**
```
Usuario ingresa datos en frontend/index.vue
    |
    v
Auth Store llama a LoginUseCase
    |
    v
LoginUseCase llama a AuthApiRepository
    |
    v
AuthApiRepository hace POST a /api/auth/login
    |
    v
Backend AuthController recibe request
    |
    v
AuthService (caso de uso) procesa login
    |
    v
AuthAggregate (dominio) valida credenciales
    |
    v
AuthSqliteRepo (adaptador) verifica en SQLite
    |
    v
Si OK: Retorna datos de usuario
    |
    v
Frontend guarda en store y redirige
```

### **2. Gestión de Leads (Asesor)**
```
Asesor entra a /asesor
    |
    v
Dashboard carga leads desde API
    |
    v
GET /api/leads
    |
    v
Backend LeadsController recibe request
    |
    v
LeadsService (caso de uso) procesa solicitud
    |
    v
LeadAggregate (dominio) aplica reglas de negocio
    |
    v
LeadsRepo (adaptador) consulta SQLite
    |
    v
Retorna lista de leads del asesor
    |
    v
Frontend muestra en tabla
```

---

## **DEPENDENCIAS CLAVE**

### **Frontend**
- Vue 3 + Nuxt 4
- Pinia (estado)
- TailwindCSS (estilos)
- TypeScript (tipos)

### **Backend**
- Nuxt 4 + Nitro
- SQLite3 (base de datos)
- nuxt-auth-utils (sesiones)
- TypeScript (tipos)
- Arquitectura Hexagonal (dominio puro, puertos, adaptadores)

### **Comunicación**
- REST API (HTTP/JSON)
- Session-based authentication
- Environment variables para URLs
- Arquitectura Hexagonal (desacoplamiento)

---

## **ARCHIVOS DE CONFIGURACIÓN**

### **Variables de Entorno**
```
Backend (.env):
- DB_TYPE=sqlite
- DATABASE_URL=./database.sqlite
- NUXT_SESSION_PASSWORD=...

Frontend (.env):
- API_BASE_URL=http://localhost:3001
```

### **Package Scripts**
```
Backend:
- npm run dev (inicia servidor en 3001)
- npm run build
- npm run preview

Frontend:
- npm run dev (inicia servidor en 3002)
- npm run build
- npm run generate
```

---

## **ESTRUCTURA FINAL DE ARCHIVOS**

```
SISTEMA_VENTAS_UNJBG/
|
|-- backend/ (3001)
|   |-- src/
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |   |-- domain/entities/Auth.ts
|   |   |   |   |-- domain/ports/
|   |   |   |   |-- application/use_cases/AuthService.ts
|   |   |   |   |-- infrastructure/api/AuthController.ts
|   |   |   |   |-- infrastructure/persistence/AuthSqliteRepo.ts
|   |   |   |   |-- infrastructure/mappers/
|   |   |   |   └-- container.ts
|   |   |   |-- users/ (estructura similar)
|   |   |   |-- leads/ (estructura similar)
|   |   |   |-- properties/ (estructura similar)
|   |   |   |-- appointments/ (estructura similar)
|   |   |   |-- contracts/ (estructura similar)
|   |   |   |-- reports/ (estructura similar)
|   |   |-- shared/
|   |   |   |-- database/
|   |   |   |-- utils/
|   |   |   └-- types/
|   |-- nuxt.config.ts
|   |-- database.sqlite (creado automáticamente)
|
|-- frontend/ (3002)
|   |-- src/
|   |   |-- presentation/pages/
|   |   |   |-- index.vue (login)
|   |   |   |-- admin/dashboard.vue
|   |   |   |-- asesor/dashboard.vue
|   |   |-- domain/entities/
|   |   |-- application/use-cases/
|   |   |-- infrastructure/api/
|   |   |-- infrastructure/stores/
|   |   |-- types/api.ts
|   |-- nuxt.config.ts
|
|-- README.md
|-- FLUJO-ARCHIVOS.md
```

---

## **RESUMEN DE CONEXIONES**

1. **Frontend** se conecta a **Backend** vía REST API
2. **Backend** usa **Arquitectura Hexagonal**:
   - **Domain**: Lógica de negocio pura (AuthAggregate, LeadAggregate)
   - **Application**: Casos de uso (AuthService, LeadsService)
   - **Infrastructure**: Adaptadores (AuthController, AuthSqliteRepo)
3. **Backend** se conecta a **SQLite** vía Repository Pattern
4. **Tipos** están sincronizados entre frontend y backend
5. **Sesiones** manejadas por nuxt-auth-utils
6. **Estados** gestionados por Pinia stores

**¡Arquitectura Hexagonal implementada y funcional!**
