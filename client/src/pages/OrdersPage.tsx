import { useState, useEffect } from 'react';
import { CartService } from '../classes/CartService';
import { AuthService } from '../classes/AuthService';
import type { Order, OrderUser } from '../types';
import { Layout } from '../components/layout/Layout';

const cartService = CartService.getInstance();
const authService = AuthService.getInstance();

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const fetch = isAdmin
      ? cartService.getAllOrders()
      : cartService.getMyOrders();

    fetch
      .then(setOrders)
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          {isAdmin ? 'Toutes les commandes' : 'Mes commandes'}
        </h1>
        <p className="text-gray-500">{orders.length} commande(s)</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Aucune commande pour l'instant.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const user = typeof order.utilisateur === 'object' ? order.utilisateur as OrderUser : null;
            return (
              <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400 font-mono">#{order._id}</span>
                  <span className="text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </span>
                </div>

                {isAdmin && user && (
                  <div className="mb-4 bg-gray-50 rounded-lg px-4 py-3 text-sm">
                    <p className="font-medium text-gray-700">{user.prenom} {user.nom}</p>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">ID : {user._id}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {order.articles.map((article, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-700">
                      <span>{article.produit.nom}</span>
                      <span className="text-gray-500">× {article.quantite}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
