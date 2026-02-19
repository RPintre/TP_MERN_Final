import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../classes/AuthService';
import { CartService } from '../../classes/CartService';
import { Button } from '../ui/Button';

const authService = AuthService.getInstance();
const cartService = CartService.getInstance();

export function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const cartCount = cartService.getTotalItems();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200 transition-colors">
          ⚽ Ligue Sportive d'Auvergne
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/catalogue" className="hover:text-blue-200 transition-colors text-sm font-medium">
                Catalogue
              </Link>
              <Link to="/commandes" className="hover:text-blue-200 transition-colors text-sm font-medium">
                Commandes
              </Link>
              <Link to="/panier" className="relative hover:text-blue-200 transition-colors text-sm font-medium">
                Panier
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/produits" className="hover:text-blue-200 transition-colors text-sm font-medium">
                    Produits
                  </Link>
                  <Link to="/admin/adherents" className="hover:text-blue-200 transition-colors text-sm font-medium">
                    Adhérents
                  </Link>
                </>
              )}
              <span className="text-blue-200 text-sm">
                {user.prenom} {user.nom}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="!text-white !border-white hover:!bg-blue-600">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors text-sm font-medium">
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-white text-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
