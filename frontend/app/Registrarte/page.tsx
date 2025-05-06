"use client";

import React, { useState } from 'react';

const SignUpComponent = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
  });
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
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error desconocido');

      setMessage('Usuario registrado exitosamente');
      setFormData({
        nombre: '',
        email: '',
        password: '',
        direccion: '',
        telefono: '',
      }); // Limpiar formulario
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mt-30 mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Registrar Usuario</h2>

      <div className="mb-4">
      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
        Nombre
      </label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      </div>

      <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      </div>

      <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Contraseña
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      </div>

      <div className="mb-4">
      <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
        Dirección
      </label>
      <input
        type="text"
        id="direccion"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      </div>

      <div className="mb-4">
      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
        Teléfono
      </label>
      <input
        type="text"
        id="telefono"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      </div>

      <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
      {loading ? 'Registrando...' : 'Registrar'}
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </form>
  );
};

export default SignUpComponent;
