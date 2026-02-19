import { Link } from 'react-router-dom';
import { AuthService } from '../classes/AuthService';
import { Navigate } from 'react-router-dom';

const authService = AuthService.getInstance();

const features = [
  { emoji: '⚽', title: 'Football', desc: 'Ballons, chasubles, maillots arbitre' },
  { emoji: '🏊', title: 'Natation', desc: 'Bonnets, ballons water-polo, lunettes' },
  { emoji: '🏀', title: 'Basketball', desc: 'Ballons, filets, équipements' },
  { emoji: '🎾', title: 'Tennis', desc: 'Raquettes, balles, filets' },
  { emoji: '🚴', title: 'Cyclisme', desc: 'Casques, gants, accessoires' },
];

export function HomePage() {
  if (authService.isAuthenticated()) {
    return <Navigate to="/catalogue" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold tracking-wide">⚽ Ligue Sportive d'Auvergne</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-blue-200 transition-colors text-sm font-medium">
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="bg-white text-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🏅</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Location de matériel sportif
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Réservez votre équipement en ligne, disponible pour tous les adhérents de la Ligue
            Sportive d'Auvergne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/inscription"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-base"
            >
              Créer un compte
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Nos catégories sportives
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Du matériel pour toutes les disciplines
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Créez votre compte', desc: "Inscrivez-vous gratuitement en tant qu'adhérent.", emoji: '📝' },
              { step: '2', title: 'Choisissez votre matériel', desc: 'Parcourez le catalogue et ajoutez au panier.', emoji: '🛒' },
              { step: '3', title: 'Confirmez la réservation', desc: 'Validez votre panier et récupérez votre équipement.', emoji: '✅' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.emoji}
                </div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Étape {item.step}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Prêt à réserver ?</h2>
          <p className="text-blue-200 mb-8">
            Rejoignez les adhérents de la Ligue Sportive d'Auvergne dès aujourd'hui.
          </p>
          <Link
            to="/inscription"
            className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-block"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 text-center text-sm py-4">
        © {new Date().getFullYear()} Ligue Sportive d'Auvergne — Tous droits réservés
      </footer>
    </div>
  );
}
