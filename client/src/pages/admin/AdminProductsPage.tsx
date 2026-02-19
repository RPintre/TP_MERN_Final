import { useState, useEffect } from 'react';
import { ProductService } from '../../classes/ProductService';
import { FormField } from '../../classes/FormField';
import { useForm } from '../../hooks/useForm';
import type { Product } from '../../types';
import { SPORT_CATEGORIES } from '../../types';
import { FormInput } from '../../components/ui/FormInput';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Layout } from '../../components/layout/Layout';

const productService = ProductService.getInstance();

const buildProductFields = (product?: Product) => [
  new FormField('nom', 'Nom du produit', 'text', 'Ex: Ballon de football', { required: true, minLength: 2 }),
  new FormField(
    'categorie',
    'Catégorie',
    'select',
    '',
    { required: true },
    SPORT_CATEGORIES.map((c) => ({ label: c, value: c }))
  ),
  new FormField('stock', 'Stock', 'number', '0', { required: true, min: 0 }),
  new FormField('description', 'Description', 'textarea', 'Description du produit...', {}),
].map((f) => {
  if (product) {
    const key = f.name as keyof Product;
    f.value = product[key] !== undefined ? String(product[key]) : '';
  }
  return f;
});

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { fields, handleChange, handleBlur, validate, getValues, reset } = useForm(
    buildProductFields(editingProduct ?? undefined)
  );

  const loadProducts = () => {
    setLoading(true);
    productService
      .getAll()
      .then(setProducts)
      .catch(() => setError('Impossible de charger les produits.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditingProduct(null);
    reset();
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await productService.remove(id);
      setSuccess('Produit supprimé.');
      loadProducts();
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const values = getValues();
    const payload = {
      nom: values.nom,
      categorie: values.categorie as Product['categorie'],
      stock: Number(values.stock),
      description: values.description,
    };
    setSubmitting(true);
    try {
      if (editingProduct?._id) {
        await productService.update(editingProduct._id, payload);
        setSuccess('Produit mis à jour.');
      } else {
        await productService.create(payload);
        setSuccess('Produit créé.');
      }
      setShowForm(false);
      loadProducts();
    } catch {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} produit(s) au catalogue</p>
        </div>
        <Button onClick={openCreate}>+ Nouveau produit</Button>
      </div>

      {error && <div className="mb-4"><Alert message={error} type="error" /></div>}
      {success && <div className="mb-4"><Alert message={success} type="success" /></div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {fields.map((field) => (
                <FormInput key={field.name} field={field} onChange={handleChange} onBlur={handleBlur} />
              ))}
              <div className="flex gap-3 mt-2">
                <Button type="submit" loading={submitting} className="flex-1">
                  {editingProduct ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Catégorie</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{product.nom}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {product.categorie}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(product)}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(product._id!)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-400">Aucun produit pour l'instant.</div>
          )}
        </div>
      )}
    </Layout>
  );
}
