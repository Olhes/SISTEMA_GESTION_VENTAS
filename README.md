# ALBAS

Este repositorio contiene el dashboard administrativo construido con **Nuxt.js 4, TypeScript** y se
conecta a una base de datos **PostgreSQL** (con soporte para Supabase). El proyecto incluye
autenticación de usuarios con roles, gestión de leads, ventas y clientes, y está desplegado en
**NuxtHub** con **Cloudflare** usando Workers.

## 📑 Índice

- [Software Requerido](#-software-requerido)
- [Tecnologías Clave](#-tecnologías-clave)
- [Configuración Inicial](#-configuración-inicial)
- [Scripts Principales](#scripts-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Variables de Entorno](#-variables-de-entorno)
- [Conexión a Supabase](#-conexión-a-supabase)
- [Integración con Cloudflare](#-integración-con-cloudflare)
- [Despliegue en NuxtHub](#-despliegue-en-nuxthub)
- [Flujo de Trabajo Básico](#-flujo-de-trabajo-básico)
- [Uso del formateador](#-uso-del-formateador)
- [Recursos Útiles](#-recursos-útiles)
- [Troubleshooting](#-troubleshooting)

---

### 📦 Software Requerido

1. **Node.js** (versión 18.0 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`
   - Instalación recomendada: `winget install OpenJS.NodeJS` (Windows)

2. **Git** (para control de versiones)
   - Descargar desde: https://git-scm.com/
   - Verificar instalación: `git --version` No olvides configurar tu cuenta usando

```bash
git config --global user.email "tucorreo@example.com"
git config --global user.name "TuNombre"
```

3. **PostgreSQL**: Una instancia de base de datos corriendo localmente o accesible remotamente.
   - Descargar desde https://www.enterprisedb.com/download-postgresql-binaries o la página oficial
     de PostgreSQL
   - Alternativamente, puedes usar una base de datos en la nube como **Supabase**

---

### ✨ Tecnologías Clave

- **[Nuxt.js 4](https://nuxt.com/)**: Framework de Vue.js para aplicaciones universales modernas.
- **[Vue.js 3](https://vuejs.org/)**: Framework progresivo de JavaScript.
- **[TypeScript](https://www.typescriptlang.org/)**: Para un código más robusto y mantenible.
- **[Nuxt UI](https://ui.nuxt.com/)**: Componentes de UI preconstruidos y estilizados.
- **[NuxtHub](https://hub.nuxt.com/)**: Plataforma de hosting para aplicaciones Nuxt.
- **[Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils)**: Utilidades para autenticación en
  Nuxt.
- **[PostgreSQL](https://www.postgresql.org/)**: Sistema de gestión de base de datos relacional.
- **[Supabase](https://supabase.com/)**: Alternativa open-source a Firebase con PostgreSQL.
- **[Cloudflare](https://www.cloudflare.com/)**: CDN y servicios de seguridad web.
- **[postgres npm package](https://www.npmjs.com/package/postgres)**: Cliente PostgreSQL para
  Node.js.

---

### ⚡ Configuración Inicial

#### 🚀 Configuración Automática (Recomendado)

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/CONECT-IT/albas.git
    cd albas
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Configura tu base de datos:**
    - **Para PostgreSQL local:** Edita `.env` con tus credenciales locales
    - **Para Supabase:** Agrega tus credenciales de Supabase

4.  **Ejecuta migraciones e inicia desarrollo local:** Scripts para iniciar la base de datos
    ```bash
    npm run db:migrate  # Crear tablas
    npm run db:seed     # Crear usuarios de prueba
    ```

### Scripts Principales

| Comando               | Acción                                                        |
| --------------------- | ------------------------------------------------------------- |
| `npm run dev`         | Inicia el servidor en modo desarrollo con recarga automática  |
| `npm run build`       | Construye la aplicación para producción                       |
| `npm run generate`    | Genera la aplicación estáticamente                            |
| `npm run preview`     | Previsualiza la aplicación construida                         |
| `npm run db:migrate`  | Ejecuta migraciones de base de datos                          |
| `npm run db:seed`     | Inserta datos iniciales en la base de datos                   |
| `npm run postinstall` | Prepara el proyecto después de la instalación de dependencias |
| `npm run format`      | Formatea el código usando Prettier                            |

---

### 📁 Estructura del Proyecto

El código fuente se encuentra organizado de la siguiente manera:

```
albas/
├── app/                    # Componentes y páginas de la aplicación Nuxt
│   ├── app.vue            # Componente raíz de la aplicación
│   ├── assets/            # Archivos CSS, imágenes, etc.
│   ├── layouts/           # Layouts de la aplicación (auth, dashboard)
│   └── pages/             # Páginas de la aplicación (login, admin, asesor)
├── server/                 # Lógica del servidor Nuxt
│   ├── api/               # Endpoints de la API (auth/)
│   └── utils/             # Utilidades del servidor (conexion a DB)
├── shared/                 # Tipos y lógica compartida
├── sql/                    # Archivos SQL para migraciones y seed
├── tasks/                  # Scripts de tareas (migrate.ts, seed.ts)
├── nuxt.config.ts         # Configuración principal de Nuxt
├── package.json           # Dependencias y scripts
└── .env                   # Variables de entorno
```

---

### 🔑 Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

#### 🐘 PostgreSQL / Supabase

```bash
NUXT_POSTGRES_URL=postgresql://usuario:contraseña@host:puerto/nombre_base_datos
```

Para Supabase, esta URL se puede obtener desde el panel de control.

#### 🔐 Otras Variables Importantes

- `NUXT_SESSION_NAME`: Nombre de la sesión (por defecto: "nuxt-session")
- `NODE_ENV`: Entorno (development o production)

---

<details>

<summary>Tips para Despliegue Manual</summary>

### 🌐 Conexión a Supabase

El proyecto está configurado para conectarse a una base de datos PostgreSQL, lo que incluye
Supabase. Para usar Supabase:

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la "Project URL" y la "Service Role Key" o "Database URL"
4. Usa esta información para completar tu variable `NUXT_POSTGRES_URL` en el archivo `.env`

La conexión se maneja en `server/utils/postgres.ts` usando el paquete `postgres`.

---

### ☁️ Integración con Cloudflare

El proyecto está diseñado para integrarse con Cloudflare como CDN y servicio de seguridad:

1. Configura tu dominio en Cloudflare
2. Asegúrate de que Cloudflare maneje los DNS para tu dominio
3. El proyecto puede aprovechar características como SSL, caching y protección DDoS

La integración con Cloudflare también mejora el rendimiento global de la aplicación.

</details>

---

### 🚀 Despliegue en NuxtHub

Este proyecto está configurado para desplegar automáticamente en NuxtHub:

1. El workflow en `.github/workflows/nuxthub.yml` maneja los despliegues automáticos
2. La aplicación se despliega cuando se hace push a cualquier rama
3. El ID del proyecto en NuxtHub es `albas-iz09`
4. El despliegue utiliza el action `nuxt-hub/action@v2`

Para más información sobre NuxtHub: [https://hub.nuxt.com](https://hub.nuxt.com)

---

### 🔄 Flujo de Trabajo Básico

1.  **Actualiza `develop`:** `git checkout develop && git pull origin develop`
2.  **Crea una rama:** `git checkout -b feature/nombre-de-la-funcionalidad`
3.  **Desarrolla:** Usa `npm run dev` para correr el servidor localmente.
4.  **Confirma y sube tus cambios:** `git add .`,
    `git commit -m "feat: implementa funcionalidad X"`, `git push origin ...`
5.  **Crea un Pull Request (PR)** en GitHub para la revisión del código.

---

### ✏️ Uso del formateador

#### 🔄 Ejecución automática en Visual Studio Code

Se ejecutará después de cada guardado de archivo si tienes instalado el plugin de Prettier. El
formateador leerá las reglas definidas en el archivo `.prettierrc.json`.

1. Instala la extensión
   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   en VS Code.
2. Abre la configuración de VS Code (`Ctrl + ,` o `Cmd + ,` en Mac).
3. Busca `Format On Save` y habilita la opción.
4. Asegúrate de que Prettier esté seleccionado como el formateador predeterminado:
   - Busca `Default Formatter` en la configuración y selecciona `esbenp.prettier-vscode`.

#### 🔧 Ejecución manual con npm

Ejecuta el siguiente comando en la terminal para formatear todo el código del proyecto:

```bash
npm run format
```

---

### 🔧 Troubleshooting

#### Problemas comunes y soluciones

1. **Error al conectar con la base de datos:**
   - Verifica que la URL `NUXT_POSTGRES_URL` esté correctamente configurada
   - Asegúrate de que el servidor de base de datos esté corriendo
   - Si usas Supabase, verifica que las credenciales sean correctas

2. **Problemas con la autenticación:**
   - Asegúrate de que has ejecutado las migraciones y los seeds
   - Verifica que los usuarios existan en la base de datos
   - Revisa que las contraseñas estén correctamente hasheadas

3. **Errores al construir la aplicación:**
   - Verifica que todas las dependencias estén instaladas: `npm install`
   - Revisa que las variables de entorno estén configuradas

4. **Problemas con el despliegue en NuxtHub:**
   - Asegúrate de que el workflow tenga permisos adecuados
   - Verifica que el project-key en el workflow sea correcto

#### Problemas conocidos:

- Inicio lento del servidor (Nitro), más información en: https://github.com/nuxt/nuxt/issues/26211
- Errores de `fetch handle`, más información en: https://github.com/nuxt/nuxt/issues/33630

> **¿Problemas?** Contacta al equipo de desarrollo o abre un _issue_ en el repositorio.
