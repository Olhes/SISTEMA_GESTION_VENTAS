-- Drop and recreate users2 table with correct Spanish structure
DROP TABLE IF EXISTS users2;

-- Create users2 table with Spanish field names matching User2 entity
CREATE TABLE users2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Datos Personales
    nombres TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT,
    tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('DNI', 'Pasaporte', 'Carnet_Extranjeria')),
    numero_documento TEXT NOT NULL UNIQUE,
    
    -- Contacto
    email TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    telefono_secundario TEXT,
    
    -- Información Laboral
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('Administrador', 'Asesor', 'Gerente', 'Agente')),
    nivel_acceso TEXT NOT NULL CHECK (nivel_acceso IN ('Basico', 'Intermedio', 'Avanzado', 'Total')),
    codigo_empleado TEXT UNIQUE,
    departamento TEXT,
    
    -- Autenticación
    nombre_usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    
    -- Estado
    estado_usuario TEXT NOT NULL DEFAULT 'Activo' CHECK (estado_usuario IN ('Activo', 'Inactivo', 'Suspendido')),
    activo BOOLEAN NOT NULL DEFAULT 1,
    
    -- Auditoria
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME,
    id_creador INTEGER,
    
    FOREIGN KEY (id_creador) REFERENCES users2(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users2_nombre_usuario ON users2(nombre_usuario);
CREATE INDEX IF NOT EXISTS idx_users2_email ON users2(email);
CREATE INDEX IF NOT EXISTS idx_users2_numero_documento ON users2(numero_documento);
CREATE INDEX IF NOT EXISTS idx_users2_estado_usuario ON users2(estado_usuario);
CREATE INDEX IF NOT EXISTS idx_users2_tipo_usuario ON users2(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_users2_activo ON users2(activo);
