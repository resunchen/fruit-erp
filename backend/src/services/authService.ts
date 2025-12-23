import { supabase } from '../config/supabase';
import { hashPassword, comparePassword } from '../utils/validators';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authService = {
  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new AppError('User already exists', 400, 400);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          role: 'user',
        },
      ])
      .select('id, email, name, role')
      .single();

    if (error || !newUser) {
      throw new AppError('Failed to create user', 500, 500);
    }

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: newUser,
      token,
    };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, password')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new AppError('Invalid email or password', 401, 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  },

  async getUser(userId: string): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 404, 404);
    }

    return user;
  },
};
