import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../classes/FormField';
import { AuthService } from '../classes/AuthService';
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const authService = AuthService.getInstance();

const registerFields = [
  new FormField('prenom', 'Prénom', 'text', 'Jean', { required: true, minLength: 2 }),
  new FormField('nom', 'Nom', 'text', 'Dupont', { required: true, minLength: 2 }),
  new FormField('email', 'Email', 'email', 'jean.dupont@email.com', {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }),
  new FormField('password', 'Mot de passe', 'password', '••••••••', {
    required: true,
    minLength: 6,
  }),
  new FormField('confirmPassword', 'Confirmer le mot de passe', 'password', '••••••••', {
    required: true,
    custom: () => null,
  }),
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { fields, handleChange, handleBlur, validate, getValues } = useForm(registerFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isValid = validate();
    if (!isValid) return;

    const values = getValues();

    if (values.password !== values.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        prenom: values.prenom,
        nom: values.nom,
        email: values.email,
        password: values.password,
      });
      authService.saveSession(response);
      setSuccess(true);
      setTimeout(() => navigate('/catalogue'), 1500);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Une erreur est survenue lors de l'inscription.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez la Ligue Sportive d'Auvergne</p>
        </div>

        {error && <div className="mb-4"><Alert message={error} type="error" /></div>}
        {success && <div className="mb-4"><Alert message="Inscription réussie ! Redirection..." type="success" /></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map((field) => (
              <FormInput
                key={field.name}
                field={field}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ))}
          </div>
          {fields.slice(2).map((field) => (
            <FormInput
              key={field.name}
              field={field}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}

          <Button type="submit" loading={loading} className="w-full mt-2">
            S'inscrire
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
