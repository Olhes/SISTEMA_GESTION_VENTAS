import type { User2, CrearUsuarioData, ActualizarUsuarioData } from '../domain/entities/User2.js';
import { User2Aggregate } from '../domain/entities/User2.js';
import { User2Repository } from '../infrastructure/User2Repository.js';

/**
 * Service layer for User2 operations
 */
export class User2Service {
  /**
   * Create a new user
   */
  static async createUser(userData: CrearUsuarioData): Promise<User2> {
    // Check if username or email already exists
    const existingUser = await User2Repository.findByUsernameOrEmail(userData.nombreUsuario);
    if (existingUser) {
      if (existingUser.nombreUsuario === userData.nombreUsuario.toLowerCase()) {
        throw new Error('Username already exists');
      }
      if (existingUser.email === userData.email.toLowerCase()) {
        throw new Error('Email already exists');
      }
    }

    // Create user using domain aggregate
    const user = User2Aggregate.crearUsuario(userData);
    
    // Save to database
    return await User2Repository.create(user);
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<User2 | null> {
    return await User2Repository.findById(id);
  }

  /**
   * Get user by username
   */
  static async getUserByUsername(nombreUsuario: string): Promise<User2 | null> {
    return await User2Repository.findByUsername(nombreUsuario);
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User2 | null> {
    return await User2Repository.findByEmail(email);
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<User2[]> {
    return await User2Repository.findAll();
  }

  /**
   * Update user
   */
  static async updateUser(id: number, updateData: ActualizarUsuarioData): Promise<User2 | null> {
    const existingUser = await User2Repository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if updating username/email and if they already exist
    if (updateData.nombreUsuario || updateData.email) {
      const checkUsername = updateData.nombreUsuario?.toLowerCase();
      const checkEmail = updateData.email?.toLowerCase();
      
      if (checkUsername && checkUsername !== existingUser.nombreUsuario) {
        const usernameExists = await User2Repository.usernameExists(checkUsername);
        if (usernameExists) {
          throw new Error('Username already exists');
        }
      }
      
      if (checkEmail && checkEmail !== existingUser.email) {
        const emailExists = await User2Repository.emailExists(checkEmail);
        if (emailExists) {
          throw new Error('Email already exists');
        }
      }
    }

    // Update using domain aggregate
    const updatedUser = User2Aggregate.actualizarUsuario(existingUser, updateData);
    
    // Save to database
    return await User2Repository.update(id, updateData);
  }

  /**
   * Activate user
   */
  static async activateUser(id: number): Promise<User2 | null> {
    const user = await User2Repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const activatedUser = User2Aggregate.activarUsuario(user);
    return await User2Repository.updateStatus(id, activatedUser.estadoUsuario);
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(id: number): Promise<User2 | null> {
    const user = await User2Repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const deactivatedUser = User2Aggregate.desactivarUsuario(user);
    return await User2Repository.updateStatus(id, deactivatedUser.estadoUsuario);
  }

  /**
   * Suspend user
   */
  static async suspendUser(id: number): Promise<User2 | null> {
    const user = await User2Repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const suspendedUser = User2Aggregate.suspenderUsuario(user);
    return await User2Repository.updateStatus(id, suspendedUser.estadoUsuario);
  }

  /**
   * Authenticate user
   */
  static async authenticateUser(nombreUsuario: string, contrasena: string): Promise<User2 | null> {
    const user = await User2Repository.findByUsername(nombreUsuario);
    if (!user) {
      return null;
    }

    const isValid = User2Aggregate.validarCredenciales(user, nombreUsuario, contrasena);
    if (!isValid) {
      return null;
    }

    // Update last login
    await User2Repository.updateLastLogin(user.id);
    
    return user;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: number): Promise<boolean> {
    const user = await User2Repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await User2Repository.delete(id);
  }

  /**
   * Search users
   */
  static async searchUsers(query: string, limit: number = 50): Promise<User2[]> {
    return await User2Repository.search(query, limit);
  }

  /**
   * Get users by status
   */
  static async getUsersByStatus(status: string): Promise<User2[]> {
    return await User2Repository.findByStatus(status);
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics(): Promise<{ total: number; active: number; inactive: number; suspended: number }> {
    const statusCounts = await User2Repository.getCountByStatus();
    
    const stats = {
      total: 0,
      active: 0,
      inactive: 0,
      suspended: 0
    };

    statusCounts.forEach(count => {
      stats.total += count.count;
      if (count.status === 'active') stats.active = count.count;
      if (count.status === 'inactive') stats.inactive = count.count;
      if (count.status === 'suspended') stats.suspended = count.count;
    });

    return stats;
  }
}
