import DatabaseManager from './connection';

export async function initializeDatabase() {
  const dbManager = DatabaseManager.getInstance({
    type: 'sqlite',
    url: './database.sqlite'
  });

  await dbManager.connect();
  const db = dbManager.getDatabase();

  // Crear tablas
  await createTables(db);
  
  console.log('Database initialized successfully');
  return dbManager;
}

async function createTables(db: any) {
  // Tabla de roles
  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS roles (
      id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_rol VARCHAR(50) NOT NULL UNIQUE
    )
  `);

  // Tabla de personas
  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS personas (
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
    )
  `);

  // Tabla de usuarios
  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      id_persona INTEGER NOT NULL,
      nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
      contrasena VARCHAR(255) NOT NULL,
      id_rol INTEGER NOT NULL,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_persona) REFERENCES personas(id_persona),
      FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
    )
  `);

  // Tabla de propiedades
  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS propiedades (
      id_propiedad INTEGER PRIMARY KEY AUTOINCREMENT,
      direccion VARCHAR(255) NOT NULL,
      descripcion TEXT,
      medidas VARCHAR(100),
      servicios_basicos TEXT,
      precio_negociable DECIMAL(12,2),
      partida_registral VARCHAR(50),
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de citas
  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS citas (
      id_cita INTEGER PRIMARY KEY AUTOINCREMENT,
      id_persona INTEGER NOT NULL,
      id_usuario INTEGER NOT NULL,
      fecha_agendada DATETIME NOT NULL,
      observacion TEXT,
      estado_visita_guiada VARCHAR(50) DEFAULT 'Reprogramó',
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_persona) REFERENCES personas(id_persona),
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    )
  `);

  // Insertar datos iniciales
  await seedInitialData(db);
}

async function runQuery(db: any, query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function seedInitialData(db: any) {
  // Insertar roles
  await runQuery(db, `
    INSERT OR IGNORE INTO roles (nombre_rol) VALUES ('Administrador'), ('Asesor')
  `);

  // Insertar usuario admin por defecto
  await runQuery(db, `
    INSERT OR IGNORE INTO personas 
    (nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento, tipo_persona)
    VALUES ('Administrador', 'Sistema', '', 'DNI', '12345678', 'Interno')
  `);

  await runQuery(db, `
    INSERT OR IGNORE INTO usuarios 
    (id_persona, nombre_usuario, contrasena, id_rol)
    VALUES (1, 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6', 1)
  `);
}
