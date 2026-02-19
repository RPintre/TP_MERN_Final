export interface User {
  _id?: string;
  id?: string;
  prenom: string;
  nom: string;
  email: string;
  role: 'adherent' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id?: string;
  nom: string;
  categorie: SportCategory;
  stock: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderArticle {
  produitId: string;
  quantite: number;
}

export interface OrderArticlePopulated {
  produit: Product;
  quantite: number;
}

export interface Order {
  _id?: string;
  utilisateur: string;
  articles: OrderArticlePopulated[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type SportCategory = 'Football' | 'Natation' | 'Basketball' | 'Tennis' | 'Cyclisme' | 'Autre';

export const SPORT_CATEGORIES: SportCategory[] = [
  'Football',
  'Natation',
  'Basketball',
  'Tennis',
  'Cyclisme',
  'Autre',
];
