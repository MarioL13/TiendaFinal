'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log('Datos enviados:', formData); // Depuración de datos enviados

      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Depuración de respuesta

      if (!response.ok) throw new Error(data.message || 'Error desconocido');

      setMessage(`Bienvenido ${data.usuario.nombre}`);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      router.push('/');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error); // Depuración de errores
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-[720px] mx-auto">
        <div className="relative flex flex-col text-gray-900 bg-white shadow-md w-96 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative flex justify-center items-center mx-2 mb-2 -mt-2 overflow-hidden text-white h-16 bg-transparent">
                <h3 className="block font-sans text-4xl font-semibold text-black">Sign In</h3>
            </div>
            <div className="relative h-11 w-full">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-full px-3 py-3 border rounded-md text-sm outline-none border-gray-300 focus:border-gray-900"
                placeholder="Email"
                required
              />
            </div>

            <div className="relative h-11 w-full">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-full px-3 py-3 border rounded-md text-sm outline-none border-gray-300 focus:border-gray-900"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" className="w-5 h-5 text-gray-900" />
              <label htmlFor="rememberMe" className="text-gray-700">Remember Me</label>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="block w-full bg-gray-900 text-white py-3 rounded-lg shadow-md hover:opacity-90"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              {message && <p className="mt-2 text-center text-sm text-gray-700">{message}</p>}
              <p className="flex justify-center mt-6 text-sm">
                Don't have an account?
                <a
                  href="#"
                  onClick={() => router.push('/Registrarte')}
                  className="ml-1 font-bold text-gray-900 cursor-pointer hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
