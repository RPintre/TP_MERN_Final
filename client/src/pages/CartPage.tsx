import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartService } from '../classes/CartService';
import { AuthService } from '../classes/AuthService';
import type { CartItem } from '../types';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Layout } from '../components/layout/Layout';

const cartService = CartService.getInstance();
const authService = AuthService.getInstance();

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setItems(cartService.getCart());
  }, []);

  const refresh = () => setItems(cartService.getCart());

  const handleQuantityChange = (productId: string, qty: number) => {
    cartService.updateQuantity(productId, qty);
    refresh();
  };

  const handleRemove = (productId: string) => {
    cartService.removeItem(productId);
    refresh();
  };

  const handleConfirm = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await cartService.confirmOrder();
      setSuccess(true);
      setItems([]);
    } catch {
      setError('Impossible de valider la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Réservation confirmée !</h2>
          <p className="text-gray-500 mb-6">Votre matériel a bien été réservé.</p>
          <Button onClick={() => navigate('/catalogue')}>Retour au catalogue</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Mon panier</h1>
        <p className="text-gray-500">Récapitulatif de votre réservation</p>
      </div>

      {error && <div className="mb-4"><Alert message={error} type="error" /></div>}

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-gray-400 mb-4">Votre panier est vide.</p>
          <Button onClick={() => navigate('/catalogue')}>Voir le catalogue</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                <div className="text-4xl w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {categoryEmoji(item.product.categorie)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.product.nom}</h3>
                  <p className="text-sm text-blue-600">{item.product.categorie}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product._id!, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product._id!, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="font-medium text-gray-700 w-24 text-right">
                  × {item.quantity}
                </p>
                <button
                  onClick={() => handleRemove(item.product._id!)}
                  className="text-red-400 hover:text-red-600 transition-colors ml-2 cursor-pointer"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h2>
            <div className="flex flex-col gap-2 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate mr-2">{item.product.nom}</span>
                  <span className="flex-shrink-0">× {item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-gray-900 text-base mb-6">
              <span>Total articles</span>
              <span>{cartService.getTotalItems()}</span>
            </div>
            <Button
              className="w-full"
              loading={loading}
              onClick={handleConfirm}
            >
              Confirmer la réservation
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}

function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    Football: '⚽', Natation: '🏊', Basketball: '🏀',
    Tennis: '🎾', Cyclisme: '🚴', Autre: '🏅',
  };
  return map[cat] ?? '🏅';
}
