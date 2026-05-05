/**
 * Examples of how to use the new Usuario system with SQLite
 */

import { UsuarioService } from '../modules/users/services/UsuarioService.js';
import { UsuarioRepository } from '../modules/users/infrastructure/UsuarioRepository.js';
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
// 2. USER CREATION EXAMPLES
// ========================================

/**
 * Example: Create a new Administrator user
 */
export async function createAdministrator() {
  try {
    const adminData = {
      nombres: 'Admin',
      apellidoPaterno: 'System',
      apellidoMaterno: 'Root',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      correoElectronico: 'admin@sistema.com',
      telefonoPrincipal: '987654321',
      telefonoSecundario: null,
      tipoUsuario: 'Administrador' as const,
      nombreUsuario: 'admin',
      contrasenaHash: 'hashed_admin_password_123',
      metodoAutenticacion: 'Usuario_Contraseña' as const,
      dosfactorHabilitado: true,
      idUsuarioCreador: 1 // Self-created
    };

    const admin = await UsuarioService.createUsuario(adminData);
    console.log('Administrator created:', admin);
    return admin;
  } catch (error) {
    console.error('Failed to create administrator:', error);
    throw error;
  }
}

/**
 * Example: Create a new Asesor user
 */
export async function createAsesor() {
  try {
    const asesorData = {
      nombres: 'Juan',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Lopez',
      tipoDocumento: 'DNI',
      numeroDocumento: '87654321',
      correoElectronico: 'juan.perez@inmobiliaria.com',
      telefonoPrincipal: '555123456',
      telefonoSecundario: '555789012',
      tipoUsuario: 'Asesor' as const,
      nombreUsuario: 'juan_perez',
      contrasenaHash: 'hashed_asesor_password_456',
      metodoAutenticacion: 'Usuario_Contraseña' as const,
      dosfactorHabilitado: false,
      idUsuarioCreador: 1 // Created by admin
    };

    const asesor = await UsuarioService.createUsuario(asesorData);
    console.log('Asesor created:', asesor);
    return asesor;
  } catch (error) {
    console.error('Failed to create asesor:', error);
    throw error;
  }
}

/**
 * Example: Create user with Google authentication
 */
export async function createGoogleUser() {
  try {
    const googleUserData = {
      nombres: 'Maria',
      apellidoPaterno: 'Garcia',
      apellidoMaterno: 'Sanchez',
      tipoDocumento: 'DNI',
      numeroDocumento: '11223344',
      correoElectronico: 'maria.garcia@gmail.com',
      telefonoPrincipal: '666777888',
      telefonoSecundario: null,
      tipoUsuario: 'Asesor' as const,
      nombreUsuario: 'maria_garcia',
      contrasenaHash: 'hashed_google_password_789',
      metodoAutenticacion: 'Google' as const,
      idExternoGoogle: 'google_oauth_12345',
      dosfactorHabilitado: false,
      idUsuarioCreador: 1
    };

    const googleUser = await UsuarioService.createUsuario(googleUserData);
    console.log('Google user created:', googleUser);
    return googleUser;
  } catch (error) {
    console.error('Failed to create Google user:', error);
    throw error;
  }
}

// ========================================
// 3. AUTHENTICATION EXAMPLES
// ========================================

/**
 * Example: Authenticate user with credentials
 */
export async function authenticateUser() {
  try {
    const user = await UsuarioService.authenticateUsuario(
      'juan_perez', 
      'password123',
      '192.168.1.100',
      'Chrome on Windows',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    
    if (user) {
      console.log('User authenticated successfully:', user.nombreUsuario);
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
 * Example: Handle failed authentication attempts
 */
export async function simulateFailedLogin() {
  try {
    // Try multiple failed attempts
    for (let i = 0; i < 6; i++) {
      const user = await UsuarioService.authenticateUsuario(
        'juan_perez', 
        'wrong_password',
        '192.168.1.100',
        'Chrome on Windows'
      );
      
      console.log(`Attempt ${i + 1}: ${user ? 'Success' : 'Failed'}`);
    }

    // Check if user is blocked
    const blockedUser = await UsuarioService.getUsuarioByUsername('juan_perez');
    if (blockedUser && blockedUser.estadoUsuario === 'Bloqueado') {
      console.log('User is blocked until:', blockedUser.bloqueadoHasta);
    }
  } catch (error) {
    console.error('Failed login simulation error:', error);
    throw error;
  }
}

// ========================================
// 4. SESSION MANAGEMENT EXAMPLES
// ========================================

/**
 * Example: Create user session
 */
export async function createUserSession(userId: number) {
  try {
    const sessionData = {
      idUsuario: userId,
      token: 'jwt_token_' + Date.now(),
      tokenRefresh: 'refresh_token_' + Date.now(),
      dispositivo: 'Chrome on Windows',
      direccionIP: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const session = await UsuarioService.crearSesion(sessionData);
    console.log('Session created:', session);
    return session;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw error;
  }
}

/**
 * Example: Validate session
 */
export async function validateSession(token: string) {
  try {
    const session = await UsuarioService.getSesionByToken(token);
    
    if (session && session.activa) {
      console.log('Session is valid for user:', session.idUsuario);
      
      // Update activity
      await UsuarioService.actualizarActividadSesion(session.id);
      
      return session;
    } else {
      console.log('Session is invalid or expired');
      return null;
    }
  } catch (error) {
    console.error('Session validation error:', error);
    throw error;
  }
}

/**
 * Example: Get all active sessions for user
 */
export async function getUserActiveSessions(userId: number) {
  try {
    const sessions = await UsuarioService.getSesionesActivas(userId);
    console.log(`User ${userId} has ${sessions.length} active sessions:`, sessions);
    return sessions;
  } catch (error) {
    console.error('Failed to get active sessions:', error);
    throw error;
  }
}

// ========================================
// 5. PASSWORD MANAGEMENT EXAMPLES
// ========================================

/**
 * Example: Change user password
 */
export async function changeUserPassword(userId: number) {
  try {
    const updatedUser = await UsuarioService.cambiarContrasena(
      userId,
      'old_password',
      'new_password',
      '192.168.1.100',
      1 // Changed by admin
    );
    
    console.log('Password changed successfully for user:', updatedUser?.nombreUsuario);
    return updatedUser;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
}

/**
 * Example: Request password reset
 */
export async function requestPasswordReset(email: string) {
  try {
    const token = 'reset_token_' + Date.now();
    const tokenHash = 'hashed_' + token;
    
    const resetRequest = await UsuarioService.solicitarRestablecimientoContrasena(
      email,
      token,
      tokenHash,
      '192.168.1.100'
    );
    
    console.log('Password reset requested:', resetRequest);
    console.log('Reset token (for testing):', token);
    
    return { resetRequest, token };
  } catch (error) {
    console.error('Failed to request password reset:', error);
    throw error;
  }
}

/**
 * Example: Reset password using token
 */
export async function resetPasswordWithToken(token: string) {
  try {
    const updatedUser = await UsuarioService.restablecerContrasena(
      token,
      'new_reset_password',
      '192.168.1.100'
    );
    
    console.log('Password reset successfully for user:', updatedUser?.nombreUsuario);
    return updatedUser;
  } catch (error) {
    console.error('Failed to reset password:', error);
    throw error;
  }
}

// ========================================
// 6. AUDIT AND SECURITY EXAMPLES
// ========================================

/**
 * Example: Register user activity
 */
export async function registerUserActivity(userId: number) {
  try {
    const activityData = {
      idUsuario: userId,
      modulo: 'Leads',
      accion: 'Crear',
      descripcion: 'Created new lead for client',
      idRecurso: 123,
      tipoRecurso: 'Lead',
      datosAntes: null,
      datosDespues: JSON.stringify({ id: 123, nombre: 'John Doe', estado: 'Nuevo' }),
      direccionIP: '192.168.1.100',
      sesionId: 1
    };

    const activity = await UsuarioService.registrarAcceso(activityData);
    console.log('Activity registered:', activity);
    return activity;
  } catch (error) {
    console.error('Failed to register activity:', error);
    throw error;
  }
}

/**
 * Example: Get user access history
 */
export async function getUserAccessHistory(userId: number) {
  try {
    const history = await UsuarioService.getHistorialAcceso(userId, 20);
    console.log(`User ${userId} access history:`, history);
    return history;
  } catch (error) {
    console.error('Failed to get access history:', error);
    throw error;
  }
}

/**
 * Example: Get recent login attempts
 */
export async function getRecentLoginAttempts(userId: number) {
  try {
    const attempts = await UsuarioService.getIntentosRecientes(userId, 10);
    console.log(`Recent login attempts for user ${userId}:`, attempts);
    return attempts;
  } catch (error) {
    console.error('Failed to get login attempts:', error);
    throw error;
  }
}

// ========================================
// 7. SPECIAL PERMISSIONS EXAMPLES
// ========================================

/**
 * Example: Grant special permission to asesor
 */
export async function grantSpecialPermission() {
  try {
    const permissionData = {
      idUsuario: 2, // Asesor ID
      modulo: 'Reports',
      accion: 'Exportar',
      descripcion: 'Permission to export reports for Q4 analysis',
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      idUsuarioOtorgador: 1, // Admin ID
      razonOtorgamiento: 'Q4 reporting requirements'
    };

    const permission = await UsuarioService.crearPermisoEspecial(permissionData);
    console.log('Special permission granted:', permission);
    return permission;
  } catch (error) {
    console.error('Failed to grant permission:', error);
    throw error;
  }
}

/**
 * Example: Check if user has special permission
 */
export async function checkUserPermission(userId: number) {
  try {
    const canExport = await UsuarioService.tienePermisoEspecial(userId, 'Reports', 'Exportar');
    const canDelete = await UsuarioService.tienePermisoEspecial(userId, 'Leads', 'Eliminar');
    
    console.log(`User ${userId} can export reports:`, canExport);
    console.log(`User ${userId} can delete leads:`, canDelete);
    
    return { canExport, canDelete };
  } catch (error) {
    console.error('Failed to check permissions:', error);
    throw error;
  }
}

/**
 * Example: Check if user can perform action
 */
export async function checkUserActionPermission(userId: number) {
  try {
    const canCreateLead = await UsuarioService.puedeRealizarAccion(userId, 'Leads', 'Crear');
    const canDeleteUser = await UsuarioService.puedeRealizarAccion(userId, 'Users', 'Eliminar');
    const canViewReports = await UsuarioService.puedeRealizarAccion(userId, 'Reports', 'Ver');
    
    console.log(`User ${userId} permissions:`, {
      canCreateLead,
      canDeleteUser,
      canViewReports
    });
    
    return { canCreateLead, canDeleteUser, canViewReports };
  } catch (error) {
    console.error('Failed to check action permissions:', error);
    throw error;
  }
}

// ========================================
// 8. USER MANAGEMENT EXAMPLES
// ========================================

/**
 * Example: Get complete user profile
 */
export async function getUserCompleteProfile(userId: number) {
  try {
    const profile = await UsuarioService.getPerfilCompleto(userId);
    
    if (profile) {
      console.log('Complete user profile:', {
        usuario: profile.usuario.nombreUsuario,
        tipo: profile.usuario.tipoUsuario,
        estado: profile.usuario.estadoUsuario,
        sesionesActivas: profile.sesionesActivas.length,
        permisosEspeciales: profile.permisosEspeciales.length,
        intentosRecientes: profile.intentosRecientes.filter(i => !i.exitoso).length
      });
      
      return profile;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
}

/**
 * Example: Block user temporarily
 */
export async function blockUserTemporarily(userId: number) {
  try {
    const blockedUntil = new Date();
    blockedUntil.setHours(blockedUntil.getHours() + 2); // Block for 2 hours
    
    const blockedUser = await UsuarioService.blockUsuario(userId, blockedUntil);
    console.log('User blocked until:', blockedUser?.bloqueadoHasta);
    
    return blockedUser;
  } catch (error) {
    console.error('Failed to block user:', error);
    throw error;
  }
}

/**
 * Example: Deactivate user
 */
export async function deactivateUser(userId: number) {
  try {
    const deactivatedUser = await UsuarioService.deactivateUsuario(userId);
    console.log('User deactivated:', deactivatedUser?.nombreUsuario);
    
    return deactivatedUser;
  } catch (error) {
    console.error('Failed to deactivate user:', error);
    throw error;
  }
}

// ========================================
// 9. RAW SQL EXAMPLES
// ========================================

/**
 * Example: Raw SQL operations
 */
export async function rawSQLOperations() {
  try {
    // Simple query
    const userCount = await executeQuery('SELECT COUNT(*) as count FROM usuarios');
    console.log('Total usuarios:', userCount[0].count);

    // Query with parameters
    const activeUsers = await executeQuery(
      'SELECT * FROM usuarios WHERE estado_usuario = ? AND activo = ?',
      ['Activo', 1]
    );
    console.log('Active usuarios:', activeUsers.length);

    // Insert operation
    const result = await executeModify(
      `INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento, 
                          correo_electronico, telefono_principal, tipo_usuario, nombre_usuario, 
                          contrasena_hash, estado_usuario, activo, intentos_fallidos, dosfactor_habilitado,
                          fecha_creacion, ultima_modificacion, id_usuario_creador) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Test', 'User', 'Test', 'DNI', '999888777', 'test@example.com', '555111222', 'Asesor', 
       'test_user', 'hashed_password', 'Activo', 1, 0, 0, new Date().toISOString(), 
       new Date().toISOString(), 1]
    );
    console.log('New usuario ID:', result.lastID);

    // Update operation
    await executeModify(
      'UPDATE usuarios SET ultima_modificacion = ? WHERE id = ?',
      [new Date().toISOString(), result.lastID]
    );

    return result;
  } catch (error) {
    console.error('Raw SQL operation failed:', error);
    throw error;
  }
}

// ========================================
// 10. API ENDPOINT EXAMPLES
// ========================================

/**
 * Example: API endpoint for user registration
 */
export async function registerUserAPI(userData: any) {
  try {
    // Validate input
    if (!userData.nombres || !userData.apellidoPaterno || !userData.correoElectronico || 
        !userData.telefonoPrincipal || !userData.numeroDocumento || !userData.nombreUsuario || !userData.contrasenaHash) {
      throw new Error('Missing required fields');
    }

    // Hash password (in real app, use bcrypt)
    const hashedPassword = `hashed_${userData.contrasenaHash}`;

    // Create user
    const user = await UsuarioService.createUsuario({
      nombres: userData.nombres,
      apellidoPaterno: userData.apellidoPaterno,
      apellidoMaterno: userData.apellidoMaterno || '',
      tipoDocumento: userData.tipoDocumento || 'DNI',
      numeroDocumento: userData.numeroDocumento,
      correoElectronico: userData.correoElectronico,
      telefonoPrincipal: userData.telefonoPrincipal,
      telefonoSecundario: userData.telefonoSecundario,
      tipoUsuario: userData.tipoUsuario || 'Asesor',
      nombreUsuario: userData.nombreUsuario,
      contrasenaHash: hashedPassword,
      metodoAutenticacion: userData.metodoAutenticacion || 'Usuario_Contraseña',
      idExternoGoogle: userData.idExternoGoogle,
      idExternoMicrosoft: userData.idExternoMicrosoft,
      dosfactorHabilitado: userData.dosfactorHabilitado || false,
      idUsuarioCreador: userData.idUsuarioCreador || 1
    });

    // Return user without password hash
    const { contrasenaHash, ...userWithoutPassword } = user;
    
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
    const user = await UsuarioService.authenticateUsuario(
      credentials.nombreUsuario, 
      credentials.contrasenaHash,
      credentials.direccionIP || '127.0.0.1',
      credentials.dispositivo || 'Unknown',
      credentials.userAgent
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Create session
    const session = await UsuarioService.crearSesion({
      idUsuario: user.id,
      token: `jwt_${user.id}_${Date.now()}`,
      tokenRefresh: `refresh_${user.id}_${Date.now()}`,
      dispositivo: credentials.dispositivo || 'Unknown',
      direccionIP: credentials.direccionIP || '127.0.0.1',
      userAgent: credentials.userAgent,
      fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Return user without password hash
    const { contrasenaHash, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      session: {
        token: session.token,
        expiresAt: session.fechaExpiracion
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
}

// ========================================
// 11. BATCH OPERATIONS
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
        const hashedPassword = `hashed_${userData.contrasenaHash}`;
        
        // Insert user
        const result = await db.run(
          `INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, tipo_documento, numero_documento, 
                              correo_electronico, telefono_principal, tipo_usuario, nombre_usuario, 
                              contrasena_hash, estado_usuario, activo, intentos_fallidos, dosfactor_habilitado,
                              fecha_creacion, ultima_modificacion, id_usuario_creador) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userData.nombres, userData.apellidoPaterno, userData.apellidoMaterno, userData.tipoDocumento, 
           userData.numeroDocumento, userData.correoElectronico, userData.telefonoPrincipal, userData.tipoUsuario,
           userData.nombreUsuario, hashedPassword, 'Activo', 1, 0, 0, new Date().toISOString(), 
           new Date().toISOString(), userData.idUsuarioCreador || 1]
        );

        // Get created user
        const user = await db.get('SELECT * FROM usuarios WHERE id = ?', [result.lastID]);
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
// 12. HOW TO USE IN CONTROLLERS/MIDDLEWARE
// ========================================

/**
 * Example: Express.js controller
 */
export class UsuarioController {
  static async createUsuario(req: any, res: any) {
    try {
      const user = await UsuarioService.createUsuario(req.body);
      const { contrasenaHash, ...userWithoutPassword } = user;
      
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

  static async getUsuarios(req: any, res: any) {
    try {
      const users = await UsuarioService.getAllUsuarios();
      const usersWithoutPasswords = users.map(user => {
        const { contrasenaHash, ...userWithoutPassword } = user;
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

  static async login(req: any, res: any) {
    try {
      const result = await loginUserAPI({
        nombreUsuario: req.body.nombreUsuario,
        contrasenaHash: req.body.contrasena,
        direccionIP: req.ip,
        dispositivo: req.get('User-Agent'),
        userAgent: req.get('User-Agent')
      });

      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }

  static async getProfile(req: any, res: any) {
    try {
      const profile = await UsuarioService.getPerfilCompleto(req.user.id);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const { contrasenaHash, ...userWithoutPassword } = profile.usuario;
      
      res.json({
        success: true,
        user: userWithoutPassword,
        sessions: profile.sesionesActivas,
        permissions: profile.permisosEspeciales,
        recentAttempts: profile.intentosRecientes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  }

  static async logout(req: any, res: any) {
    try {
      await UsuarioService.cerrarSesion(req.session.id);
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }
}

/**
 * Example: Authentication middleware
 */
export function authMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const session = await UsuarioService.getSesionByToken(token);
      
      if (!session || !session.activa) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }

      // Update session activity
      await UsuarioService.actualizarActividadSesion(session.id);

      // Get user
      const user = await UsuarioService.getUsuarioById(session.idUsuario);
      
      if (!user || !user.activo || user.estadoUsuario !== 'Activo') {
        return res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        });
      }

      req.user = user;
      req.session = session;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Authentication failed'
      });
    }
  };
}

/**
 * Example: Permission middleware
 */
export function permissionMiddleware(modulo: string, accion: string) {
  return async (req: any, res: any, next: any) => {
    try {
      const hasPermission = await UsuarioService.puedeRealizarAccion(req.user.id, modulo, accion);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      // Register access
      await UsuarioService.registrarAcceso({
        idUsuario: req.user.id,
        modulo,
        accion,
        descripcion: `Accessed ${modulo} - ${accion}`,
        direccionIP: req.ip,
        sesionId: req.session.id
      });

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Permission check failed'
      });
    }
  };
}
