import type { User, AuthResponse } from '../types';
import { ApiService } from './ApiService';
import { hashPassword } from '../utils/hash';

export class AuthService extends ApiService {
  private static instance: AuthService;

  private constructor() {
    super('/auth');
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(data: {
    prenom: string;
    nom: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const motDePasseChiffre = await hashPassword(data.password);
    return this.post<AuthResponse>('/register', {
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      motDePasseChiffre,
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const motDePasseChiffre = await hashPassword(password);
    return this.post<AuthResponse>('/login', { email, motDePasseChiffre });
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}
