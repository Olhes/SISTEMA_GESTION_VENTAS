import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

/**
 * Initialize SQLite database connection
 */
export async function initializeDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'database.sqlite');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');
  
  console.log('SQLite database initialized');
  return db;
}

/**
 * Get database instance
 */
export async function getDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!db) {
    return await initializeDatabase();
  }
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('SQLite database connection closed');
  }
}

/**
 * Execute a query with error handling
 */
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  const database = await getDatabase();
  try {
    const result = await database.all(query, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single row query
 */
export async function executeQueryOne<T = any>(
  query: string, 
  params: any[] = []
): Promise<T | undefined> {
  const database = await getDatabase();
  try {
    const result = await database.get(query, params);
    return result as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute insert/update/delete query
 */
export async function executeModify(
  query: string, 
  params: any[] = []
): Promise<sqlite3.RunResult> {
  const database = await getDatabase();
  try {
    const result = await database.run(query, params);
    return result;
  } catch (error) {
    console.error('Database modify error:', error);
    throw error;
  }
}

/**
 * Database transaction helper
 */
export async function transaction<T>(
  callback: (db: Database<sqlite3.Database, sqlite3.Statement>) => Promise<T>
): Promise<T> {
  const database = await getDatabase();
  
  try {
    await database.exec('BEGIN TRANSACTION');
    const result = await callback(database);
    await database.exec('COMMIT');
    return result;
  } catch (error) {
    await database.exec('ROLLBACK');
    throw error;
  }
}
