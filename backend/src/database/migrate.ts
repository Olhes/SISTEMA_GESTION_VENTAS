import fs from 'fs';
import path from 'path';
import { initializeDatabase, executeModify } from './sqlite.js';

/**
 * Run all database migrations
 */
export async function runMigrations(): Promise<void> {
  const db = await initializeDatabase();
  
  try {
    // Create migrations table to track executed migrations
    await executeModify(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), 'src', 'database', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get executed migrations
    const executedMigrations = await db.all('SELECT filename FROM migrations');
    const executedFiles = new Set(executedMigrations.map((m: any) => m.filename));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedFiles.has(file)) {
        console.log(`Running migration: ${file}`);
        
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        await executeModify(migrationSQL);
        
        // Record migration as executed
        await executeModify(
          'INSERT INTO migrations (filename) VALUES (?)',
          [file]
        );
        
        console.log(`Migration ${file} completed`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

/**
 * Run migrations if this file is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('Migrations finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
