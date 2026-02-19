import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../classes/FormField';
import { AuthService } from '../classes/AuthService';
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const authService = AuthService.getInstance();

const loginFields = [
  new FormField('email', 'Email', 'email', 'jean.dupont@email.com', {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }),
  new FormField('password', 'Mot de passe', 'password', '••••••••', {
    required: true,
    minLength: 6,
  }),
];

export function LoginPage() {
  const navigate = useNavigate();
  const { fields, handleChange, handleBlur, validate, getValues } = useForm(loginFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    const values = getValues();
    setLoading(true);
    try {
      const response = await authService.login(values.email, values.password);
      authService.saveSession(response);
      navigate('/catalogue');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Email ou mot de passe incorrect.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à votre espace adhérent</p>
        </div>

        {error && <div className="mb-4"><Alert message={error} type="error" /></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {fields.map((field) => (
            <FormInput
              key={field.name}
              field={field}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-blue-600 hover:underline font-medium">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
