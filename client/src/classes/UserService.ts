import type { User } from '../types';
import { ApiService } from './ApiService';
import { hashPassword } from '../utils/hash';

export interface UserCreatePayload {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  role: 'adherent' | 'admin';
}

export interface UserUpdatePayload {
  prenom?: string;
  nom?: string;
  password?: string;
  role?: 'adherent' | 'admin';
}

export class UserService extends ApiService {
  private static instance: UserService;

  private constructor() {
    super('/users');
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getAll(q?: string): Promise<User[]> {
    const params = q ? { params: { q } } : undefined;
    return this.get<User[]>('/', params);
  }

  async getById(id: string): Promise<User> {
    return this.get<User>(`/${id}`);
  }

  async create(data: UserCreatePayload): Promise<User> {
    const motDePasseChiffre = await hashPassword(data.password);
    return this.post<User>('/', {
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      motDePasseChiffre,
      role: data.role,
    });
  }

  async update(id: string, data: UserUpdatePayload): Promise<User> {
    const payload: Record<string, string> = {};
    if (data.prenom) payload.prenom = data.prenom;
    if (data.nom) payload.nom = data.nom;
    if (data.role) payload.role = data.role;
    if (data.password) {
      payload.motDePasseChiffre = await hashPassword(data.password);
    }
    return this.put<User>(`/${id}`, payload);
  }

  async remove(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}
