import { useState, useEffect } from 'react';
import { UserService } from '../../classes/UserService';
import type { UserCreatePayload, UserUpdatePayload } from '../../classes/UserService';
import { FormField } from '../../classes/FormField';
import { useForm } from '../../hooks/useForm';
import type { User } from '../../types';
import { FormInput } from '../../components/ui/FormInput';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Layout } from '../../components/layout/Layout';

const userService = UserService.getInstance();

const buildUserFields = (user?: User) => {
  const fields = [
    new FormField('prenom', 'Prénom', 'text', 'Jean', { required: true, minLength: 2 }),
    new FormField('nom', 'Nom', 'text', 'Dupont', { required: true, minLength: 2 }),
    new FormField('email', 'Email', 'email', 'jean@email.com', {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    }),
    new FormField(
      'role',
      'Rôle',
      'select',
      '',
      { required: true },
      [
        { label: 'Adhérent', value: 'adherent' },
        { label: 'Administrateur', value: 'admin' },
      ]
    ),
  ];

  if (!user) {
    fields.push(
      new FormField('password', 'Mot de passe', 'password', '••••••••', { required: true, minLength: 6 })
    );
  }

  if (user) {
    fields.forEach((f) => {
      const key = f.name as keyof User;
      if (user[key] !== undefined) f.value = String(user[key]);
    });
  }

  return fields;
};

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { fields, handleChange, handleBlur, validate, getValues, reset } = useForm(
    buildUserFields(editingUser ?? undefined)
  );

  const loadUsers = () => {
    setLoading(true);
    userService
      .getAll()
      .then(setUsers)
      .catch(() => setError('Impossible de charger les adhérents.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    reset();
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet adhérent ?')) return;
    try {
      await userService.remove(id);
      setSuccess('Adhérent supprimé.');
      loadUsers();
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const values = getValues();

    setSubmitting(true);
    try {
      if (editingUser?._id) {
        const payload: UserUpdatePayload = {
          prenom: values.prenom,
          nom: values.nom,
          role: values.role as User['role'],
        };
        if (values.password) payload.password = values.password;
        await userService.update(editingUser._id, payload);
        setSuccess('Adhérent mis à jour.');
      } else {
        const payload: UserCreatePayload = {
          prenom: values.prenom,
          nom: values.nom,
          email: values.email,
          password: values.password,
          role: values.role as User['role'],
        };
        await userService.create(payload);
        setSuccess('Adhérent créé.');
      }
      setShowForm(false);
      loadUsers();
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
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Adhérents</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} adhérent(s) enregistré(s)</p>
        </div>
        <Button onClick={openCreate}>+ Nouvel adhérent</Button>
      </div>

      {error && <div className="mb-4"><Alert message={error} type="error" /></div>}
      {success && <div className="mb-4"><Alert message={success} type="success" /></div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingUser ? 'Modifier l\'adhérent' : 'Nouvel adhérent'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {fields.map((field) => (
                <FormInput key={field.name} field={field} onChange={handleChange} onBlur={handleBlur} />
              ))}
              <div className="flex gap-3 mt-2">
                <Button type="submit" loading={submitting} className="flex-1">
                  {editingUser ? 'Mettre à jour' : 'Créer'}
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Rôle</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Inscrit le</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.prenom} {user.nom}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-green-50 text-green-700'
                        }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Adhérent'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(user)}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(user._id!)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">Aucun adhérent pour l'instant.</div>
          )}
        </div>
      )}
    </Layout>
  );
}
