/**
 * Examples of how to use SQLite in different parts of the application
 */

import { User2Service } from '../modules/users/services/User2Service.js';
import { User2Repository } from '../modules/users/infrastructure/User2Repository.js';
import { initializeDatabase, executeQuery, executeModify, transaction } from '../database/sqlite.js';
import { runMigrations } from '../database/migrate.js';

// ========================================
// 1. BASIC DATABASE SETUP
// ========================================

/**
 * Initialize database and run migrations
 */
export async function setupDatabase() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Run all pending migrations
    await runMigrations();
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

// ========================================
// 2. USING USER SERVICE (RECOMMENDED APPROACH)
// ========================================

/**
 * Example: Create a new user using service layer
 */
export async function createNewUser() {
  try {
    const userData = {
      nombres: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
      tipoDocumento: 'DNI' as const,
      numeroDocumento: '12345678',
      email: 'john@example.com',
      telefono: '123456789',
      telefonoSecundario: '987654321',
      tipoUsuario: 'Asesor' as const,
      nivelAcceso: 'Intermedio' as const,
      codigoEmpleado: 'EMP001',
      departamento: 'Ventas',
      nombreUsuario: 'john_doe',
      contrasena: 'hashed_password_123' // Should be hashed before passing
    };

    const user = await User2Service.createUser(userData);
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

/**
 * Example: Authenticate user
 */
export async function authenticateUser() {
  try {
    const user = await User2Service.authenticateUser('john_doe', 'password123');
    
    if (user) {
      console.log('User authenticated successfully:', user.id);
      return user;
    } else {
      console.log('Authentication failed');
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Example: Get user statistics
 */
export async function getUserStats() {
  try {
    const stats = await User2Service.getUserStatistics();
    console.log('User statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Failed to get user stats:', error);
    throw error;
  }
}

// ========================================
// 3. USING REPOSITORY DIRECTLY
// ========================================

/**
 * Example: Direct repository usage for custom queries
 */
export async function customUserQuery() {
  try {
    // Find all active users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const users = await executeQuery(
      `SELECT id, username, email, created_at 
       FROM users2 
       WHERE status = 'active' AND created_at > ? 
       ORDER BY created_at DESC`,
      [thirtyDaysAgo.toISOString()]
    );
    
    console.log('Recent active users:', users);
    return users;
  } catch (error) {
    console.error('Custom query failed:', error);
    throw error;
  }
}

// ========================================
// 4. RAW SQL EXAMPLES
// ========================================

/**
 * Example: Raw SQL operations
 */
export async function rawSQLOperations() {
  try {
    // Simple query
    const userCount = await executeQuery('SELECT COUNT(*) as count FROM users2');
    console.log('Total users:', userCount[0].count);

    // Query with parameters
    const activeUsers = await executeQuery(
      'SELECT * FROM users2 WHERE estado_usuario = ? AND activo = ?',
      ['Activo', 1]
    );
    console.log('Active users:', activeUsers.length);

    // Insert operation
    const result = await executeModify(
      `INSERT INTO users2 (nombres, apellido_paterno, tipo_documento, numero_documento, 
                          email, telefono, nombre_usuario, contrasena, estado_usuario, activo, 
                          fecha_creacion, ultima_modificacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['New', 'User', 'DNI', '87654321', 'new@example.com', '55555555', 'new_user', 'password123', 'Activo', 1, new Date().toISOString(), new Date().toISOString()]
    );
    console.log('New user ID:', result.lastID);

    // Update operation
    await executeModify(
      'UPDATE users2 SET ultima_modificacion = ? WHERE id = ?',
      [new Date().toISOString(), result.lastID]
    );

    return result;
  } catch (error) {
    console.error('Raw SQL operation failed:', error);
    throw error;
  }
}

// ========================================
// 5. TRANSACTION EXAMPLES
// ========================================

/**
 * Example: Using transactions for complex operations
 */
export async function updateUserWithTransaction(userId: number, updateData: any) {
  try {
    return await transaction(async (db) => {
      // Update user
      await db.run(
        'UPDATE users2 SET nombres = ?, email = ?, ultima_modificacion = ? WHERE id = ?',
        [updateData.nombres, updateData.email, new Date().toISOString(), userId]
      );

      // Log the change (example of related operation)
      await db.run(
        'INSERT INTO usuarios_logs (id_usuario, accion, detalles, fecha_creacion) VALUES (?, ?, ?, ?)',
        [userId, 'perfil_update', JSON.stringify(updateData), new Date().toISOString()]
      );

      // Get updated user
      const updatedUser = await db.get('SELECT * FROM users2 WHERE id = ?', [userId]);
      
      return updatedUser;
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

// ========================================
// 6. API ENDPOINT EXAMPLES
// ========================================

/**
 * Example: API endpoint for user registration
 */
export async function registerUserAPI(userData: any) {
  try {
    // Validate input
    if (!userData.nombres || !userData.apellidoPaterno || !userData.email || !userData.telefono || !userData.numeroDocumento || !userData.nombreUsuario || !userData.contrasena) {
      throw new Error('Missing required fields');
    }

    // Hash password (in real app, use bcrypt)
    const hashedPassword = `hashed_${userData.contrasena}`;

    // Create user
    const user = await User2Service.createUser({
      nombres: userData.nombres,
      apellidoPaterno: userData.apellidoPaterno,
      apellidoMaterno: userData.apellidoMaterno,
      tipoDocumento: userData.tipoDocumento || 'DNI',
      numeroDocumento: userData.numeroDocumento,
      email: userData.email,
      telefono: userData.telefono,
      telefonoSecundario: userData.telefonoSecundario,
      tipoUsuario: userData.tipoUsuario || 'Asesor',
      nivelAcceso: userData.nivelAcceso || 'Basico',
      codigoEmpleado: userData.codigoEmpleado,
      departamento: userData.departamento,
      nombreUsuario: userData.nombreUsuario,
      contrasena: hashedPassword,
      idCreador: userData.idCreador
    });

    // Return user without password
    const { contrasena, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Example: API endpoint for user login
 */
export async function loginUserAPI(credentials: any) {
  try {
    const user = await User2Service.authenticateUser(
      credentials.nombreUsuario, 
      credentials.contrasena
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Generate token (in real app, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    // Return user without password
    const { contrasena, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
}

// ========================================
// 7. BATCH OPERATIONS
// ========================================

/**
 * Example: Batch user creation
 */
export async function createMultipleUsers(usersData: any[]) {
  try {
    return await transaction(async (db) => {
      const createdUsers = [];

      for (const userData of usersData) {
        // Hash password
        const hashedPassword = `hashed_${userData.contrasena}`;
        
        // Insert user
        const result = await db.run(
          `INSERT INTO users2 (nombres, apellido_paterno, tipo_documento, numero_documento, 
                              email, telefono, nombre_usuario, contrasena, estado_usuario, activo, 
                              fecha_creacion, ultima_modificacion) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userData.nombres, userData.apellidoPaterno, userData.tipoDocumento, userData.numeroDocumento,
           userData.email, userData.telefono, userData.nombreUsuario, hashedPassword, 'Activo', 1,
           new Date().toISOString(), new Date().toISOString()]
        );

        // Get created user
        const user = await db.get('SELECT * FROM users2 WHERE id = ?', [result.lastID]);
        createdUsers.push(user);
      }

      return createdUsers;
    });
  } catch (error) {
    console.error('Batch creation failed:', error);
    throw error;
  }
}

// ========================================
// 8. HOW TO USE IN CONTROLLERS/MIDDLEWARE
// ========================================

/**
 * Example: Express.js controller
 */
export class UserController {
  static async createUser(req: any, res: any) {
    try {
      const user = await User2Service.createUser(req.body);
      const { contrasena, ...userWithoutPassword } = user;
      
      res.status(201).json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  }

  static async getUsers(req: any, res: any) {
    try {
      const users = await User2Service.getAllUsers();
      const usersWithoutPasswords = users.map(user => {
        const { contrasena, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json({
        success: true,
        users: usersWithoutPasswords
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }

  static async getUserStats(req: any, res: any) {
    try {
      const stats = await User2Service.getUserStatistics();
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get statistics'
      });
    }
  }
}
