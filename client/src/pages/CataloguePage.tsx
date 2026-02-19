import { useState, useEffect } from 'react';
import { ProductService } from '../classes/ProductService';
import { CartService } from '../classes/CartService';
import type { Product, SportCategory } from '../types';
import { SPORT_CATEGORIES } from '../types';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Layout } from '../components/layout/Layout';

const productService = ProductService.getInstance();
const cartService = CartService.getInstance();

export function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<SportCategory | 'Tous'>('Tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    productService
      .getAll()
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      })
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false));
  }, []);

  const filterByCategory = (cat: SportCategory | 'Tous') => {
    setActiveCategory(cat);
    if (cat === 'Tous') {
      setFiltered(products);
    } else {
      productService
        .getAll(cat)
        .then(setFiltered)
        .catch(() => setFiltered(products.filter((p) => p.categorie === cat)));
    }
  };

  const handleAddToCart = (product: Product) => {
    cartService.addItem(product, 1);
    setAddedId(product._id ?? null);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Catalogue de matériel</h1>
        <p className="text-gray-500">Réservez votre équipement sportif en quelques clics</p>
      </div>

      {error && <Alert message={error} type="error" />}

      <div className="flex flex-wrap gap-2 mb-8">
        {(['Tous', ...SPORT_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => filterByCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Aucun produit dans cette catégorie.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={handleAddToCart}
              justAdded={addedId === product._id}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  justAdded: boolean;
}

function ProductCard({ product, onAdd, justAdded }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-40 flex items-center justify-center text-5xl">
        {categoryEmoji(product.categorie)}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit mb-2">
          {product.categorie}
        </span>
        <h3 className="font-semibold text-gray-800 text-base mb-1">{product.nom}</h3>
        {product.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <p className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} disponible(s)` : 'Rupture de stock'}
          </p>
          <Button
            size="sm"
            variant={justAdded ? 'secondary' : 'primary'}
            disabled={product.stock === 0}
            onClick={() => onAdd(product)}
          >
            {justAdded ? '✓ Ajouté' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function categoryEmoji(cat: SportCategory): string {
  const map: Record<SportCategory, string> = {
    Football: '⚽',
    Natation: '🏊',
    Basketball: '🏀',
    Tennis: '🎾',
    Cyclisme: '🚴',
    Autre: '🏅',
  };
  return map[cat] ?? '🏅';
}
