import type { CartItem, Product, Order } from '../types';
import { ApiService } from './ApiService';

const CART_KEY = 'cart';

export class CartService extends ApiService {
  private static instance: CartService;

  private constructor() {
    super('/orders');
  }

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  getCart(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  addItem(product: Product, quantity: number = 1): void {
    const items = this.getCart();
    const existing = items.find((i) => i.product._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.saveCart(items);
  }

  removeItem(productId: string): void {
    const items = this.getCart().filter((i) => i.product._id !== productId);
    this.saveCart(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.getCart();
    const item = items.find((i) => i.product._id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      item.quantity = quantity;
      this.saveCart(items);
    }
  }

  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  }

  getTotalItems(): number {
    return this.getCart().reduce((sum, i) => sum + i.quantity, 0);
  }

  async confirmOrder(): Promise<Order> {
    const items = this.getCart();
    const articles = items.map((i) => ({
      produitId: i.product._id!,
      quantite: i.quantity,
    }));
    const order = await this.post<Order>('/', { articles });
    this.clearCart();
    return order;
  }

  async getMyOrders(): Promise<Order[]> {
    return this.get<Order[]>('/mine');
  }

  async getAllOrders(): Promise<Order[]> {
    return this.get<Order[]>('/');
  }
}
