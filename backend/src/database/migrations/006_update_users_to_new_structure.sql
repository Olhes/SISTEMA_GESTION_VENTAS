-- Drop and recreate users2 table with new structure matching Usuario entity
DROP TABLE IF EXISTS users2;

-- Create usuarios table with new structure
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Datos personales
    nombres TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT NOT NULL,
    tipo_documento TEXT NOT NULL,
    numero_documento TEXT NOT NULL UNIQUE,
    
    -- Contacto
    correo_electronico TEXT NOT NULL UNIQUE,
    telefono_principal TEXT NOT NULL,
    telefono_secundario TEXT,
    
    -- Autenticación
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('Administrador', 'Asesor')),
    nombre_usuario TEXT NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    metodo_autenticacion TEXT NOT NULL DEFAULT 'Usuario_Contraseña' CHECK (metodo_autenticacion IN ('Usuario_Contraseña', 'Google', 'Microsoft')),
    id_externo_google TEXT,
    id_externo_microsoft TEXT,
    
    -- Estado
    estado_usuario TEXT NOT NULL DEFAULT 'Activo' CHECK (estado_usuario IN ('Activo', 'Inactivo', 'Bloqueado')),
    activo BOOLEAN NOT NULL DEFAULT 1,
    
    -- Seguridad
    intentos_fallidos INTEGER NOT NULL DEFAULT 0,
    bloqueado_hasta DATETIME,
    dosfactor_habilitado BOOLEAN NOT NULL DEFAULT 0,
    
    -- Información de sesión
    ultimo_login DATETIME,
    ultima_actividad DATETIME,
    
    -- Auditoría
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creador INTEGER,
    
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usuarios_nombre_usuario ON usuarios(nombre_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo_electronico ON usuarios(correo_electronico);
CREATE INDEX IF NOT EXISTS idx_usuarios_numero_documento ON usuarios(numero_documento);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado_usuario ON usuarios(estado_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo_usuario ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_bloqueado_hasta ON usuarios(bloqueado_hasta);

-- Create sesiones_usuarios table
CREATE TABLE IF NOT EXISTS sesiones_usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    token_refresh TEXT,
    dispositivo TEXT NOT NULL,
    direccion_ip TEXT NOT NULL,
    user_agent TEXT,
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    fecha_ultima_actividad DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN NOT NULL DEFAULT 1,
    cerrada_manualmente DATETIME,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Create auditoria_login table
CREATE TABLE IF NOT EXISTS auditoria_login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    nombre_usuario TEXT NOT NULL,
    exitoso BOOLEAN NOT NULL,
    razon_fallo TEXT,
    direccion_ip TEXT NOT NULL,
    dispositivo TEXT NOT NULL,
    user_agent TEXT,
    fecha_intento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Create cambio_contrasena table
CREATE TABLE IF NOT EXISTS cambio_contrasena (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    contrasena_antigua TEXT NOT NULL,
    contrasena_new TEXT NOT NULL,
    razon_cambio TEXT NOT NULL CHECK (razon_cambio IN ('Manual', 'Expiración', 'Recuperación', 'Administrador')),
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    direccion_ip TEXT NOT NULL,
    id_usuario_modificador INTEGER,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_modificador) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Create restablecimiento_contrasena table
CREATE TABLE IF NOT EXISTS restablecimiento_contrasena (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    token_hash TEXT NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT 0,
    fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    fecha_utilizacion DATETIME,
    direccion_ip TEXT NOT NULL,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Create historial_acceso table
CREATE TABLE IF NOT EXISTS historial_acceso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    modulo TEXT NOT NULL,
    accion TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    id_recurso INTEGER,
    tipo_recurso TEXT,
    datos_antes TEXT,
    datos_despues TEXT,
    fecha_acceso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    direccion_ip TEXT NOT NULL,
    sesion_id INTEGER,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_id) REFERENCES sesiones_usuarios(id) ON DELETE SET NULL
);

-- Create permisos_especiales table
CREATE TABLE IF NOT EXISTS permisos_especiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    modulo TEXT NOT NULL,
    accion TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1,
    id_usuario_otorgador INTEGER NOT NULL,
    razon_otorgamiento TEXT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_otorgador) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Create indexes for session table
CREATE INDEX IF NOT EXISTS idx_sesiones_usuarios_id_usuario ON sesiones_usuarios(id_usuario);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuarios_token ON sesiones_usuarios(token);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuarios_activa ON sesiones_usuarios(activa);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuarios_fecha_expiracion ON sesiones_usuarios(fecha_expiracion);

-- Create indexes for audit tables
CREATE INDEX IF NOT EXISTS idx_auditoria_login_id_usuario ON auditoria_login(id_usuario);
CREATE INDEX IF NOT EXISTS idx_auditoria_login_fecha_intento ON auditoria_login(fecha_intento);
CREATE INDEX IF NOT EXISTS idx_auditoria_login_exitoso ON auditoria_login(exitoso);

CREATE INDEX IF NOT EXISTS idx_cambio_contrasena_id_usuario ON cambio_contrasena(id_usuario);
CREATE INDEX IF NOT EXISTS idx_cambio_contrasena_fecha_cambio ON cambio_contrasena(fecha_cambio);

CREATE INDEX IF NOT EXISTS idx_restablecimiento_contrasena_id_usuario ON restablecimiento_contrasena(id_usuario);
CREATE INDEX IF NOT EXISTS idx_restablecimiento_contrasena_token ON restablecimiento_contrasena(token);
CREATE INDEX IF NOT EXISTS idx_restablecimiento_contrasena_utilizado ON restablecimiento_contrasena(utilizado);

CREATE INDEX IF NOT EXISTS idx_historial_acceso_id_usuario ON historial_acceso(id_usuario);
CREATE INDEX IF NOT EXISTS idx_historial_acceso_fecha_acceso ON historial_acceso(fecha_acceso);
CREATE INDEX IF NOT EXISTS idx_historial_acceso_modulo ON historial_acceso(modulo);

CREATE INDEX IF NOT EXISTS idx_permisos_especiales_id_usuario ON permisos_especiales(id_usuario);
CREATE INDEX IF NOT EXISTS idx_permisos_especiales_activo ON permisos_especiales(activo);
CREATE INDEX IF NOT EXISTS idx_permisos_especiales_fecha_fin ON permisos_especiales(fecha_fin);
