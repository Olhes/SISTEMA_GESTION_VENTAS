import sqlite3 from 'sqlite3';
import postgres from 'postgres';

export interface DatabaseConfig {
  type: 'sqlite' | 'postgres';
  url: string;
  postgresUrl?: string;
}

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: sqlite3.Database | postgres.Sql | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  static getInstance(config?: DatabaseConfig): DatabaseManager {
    if (!DatabaseManager.instance) {
      if (!config) {
        throw new Error('Database config is required for first initialization');
      }
      DatabaseManager.instance = new DatabaseManager(config);
    }
    return DatabaseManager.instance;
  }

  async connect(): Promise<void> {
    if (this.db) return;

    if (this.config.type === 'sqlite') {
      this.db = new sqlite3.Database(this.config.url);
      console.log('SQLite database connected');
    } else if (this.config.type === 'postgres' && this.config.postgresUrl) {
      this.db = postgres(this.config.postgresUrl);
      console.log('PostgreSQL database connected');
    } else {
      throw new Error('Invalid database configuration');
    }
  }

  getDatabase(): sqlite3.Database | postgres.Sql {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  isSQLite(): boolean {
    return this.config.type === 'sqlite';
  }

  isPostgres(): boolean {
    return this.config.type === 'postgres';
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      if (this.isSQLite()) {
        (this.db as sqlite3.Database).close();
      } else {
        await (this.db as postgres.Sql).end();
      }
      this.db = null;
      console.log('Database disconnected');
    }
  }
}

export default DatabaseManager;
