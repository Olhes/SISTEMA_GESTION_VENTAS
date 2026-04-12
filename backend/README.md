# ALBAS Backend

Backend monolítico modular para el Sistema de Gestión de Ventas de Inmobiliaria NAVAS.

## Tecnologías

- **Node.js + Nuxt 4** - Framework principal
- **TypeScript** - Tipado estático
- **SQLite** - Base de datos principal
- **PostgreSQL** - Soporte para producción (opcional)
- **TailwindCSS** - Estilos
- **Nuxt Auth Utils** - Autenticación

## Estructura Modular

```
src/
├── modules/              # Módulos de negocio
│   ├── auth/            # Autenticación
│   ├── users/           # Gestión de usuarios
│   ├── leads/           # Gestión de leads
│   ├── properties/      # Gestión de propiedades
│   ├── appointments/    # Gestión de citas
│   ├── contracts/       # Gestión de contratos
│   └── reports/         # Reportes
├── shared/              # Código compartido
│   ├── database/        # Conexión a DB
│   ├── middleware/      # Middleware global
│   ├── utils/           # Utilidades
│   └── types/           # Tipos compartidos
└── config/              # Configuración
```

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Datos de prueba
