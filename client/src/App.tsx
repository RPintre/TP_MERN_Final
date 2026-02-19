import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CataloguePage } from './pages/CataloguePage';
import { CartPage } from './pages/CartPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { OrdersPage } from './pages/OrdersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />

        <Route
          path="/catalogue"
          element={
            <ProtectedRoute>
              <CataloguePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panier"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/produits"
          element={
            <ProtectedRoute adminOnly>
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/adherents"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commandes"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/catalogue" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
