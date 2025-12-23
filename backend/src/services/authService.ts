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
      throw new AppError('该邮箱已被注册，请使用其他邮箱或直接登录', 400, 400);
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
      throw new AppError('注册失败，请稍后重试', 500, 500);
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
      throw new AppError('邮箱或密码错误，请检查后重试', 401, 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('邮箱或密码错误，请检查后重试', 401, 401);
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
      throw new AppError('用户信息加载失败，请重新登录', 404, 404);
    }

    return user;
  },
};
