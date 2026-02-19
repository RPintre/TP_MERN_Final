import type { Product, SportCategory } from '../types';
import { ApiService } from './ApiService';

export class ProductService extends ApiService {
  private static instance: ProductService;

  private constructor() {
    super('/products');
  }

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getAll(categorie?: SportCategory, q?: string): Promise<Product[]> {
    const query: Record<string, string> = {};
    if (categorie) query.categorie = categorie;
    if (q) query.q = q;
    const params = Object.keys(query).length ? { params: query } : undefined;
    return this.get<Product[]>('/', params);
  }

  async getById(id: string): Promise<Product> {
    return this.get<Product>(`/${id}`);
  }

  async create(data: { nom: string; description?: string; categorie: SportCategory; stock: number }): Promise<Product> {
    return this.post<Product>('/', data);
  }

  async update(id: string, data: Partial<{ nom: string; description: string; categorie: SportCategory; stock: number }>): Promise<Product> {
    return this.put<Product>(`/${id}`, data);
  }

  async remove(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}
