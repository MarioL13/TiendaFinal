"use client";

import React, { useState } from "react";

const SignUpComponent = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    direccion: "",
    telefono: ""
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

    // Validación de contraseña
    const password = formData.password;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setLoading(false);
      setMessage(
        "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          direccion: formData.direccion,
          telefono: formData.telefono
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error desconocido');

      setMessage('Usuario registrado exitosamente');
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
        direccion: "",
        telefono: ""
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 max-w-lg mx-auto bg-white rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
      <h1 className="text-xl font-bold text-center text-black mb-8">
        Bienvenido a Ricon Del Friki
      </h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="nombre" className="text-sm text-black mr-2">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="apellido" className="text-sm text-black mr-2">
            Apellido:
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="email" className="text-sm text-black mr-2">
            Correo electrónico:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="password" className="text-sm text-black mr-2">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500 mt-1">
            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos.
          </span>
        </div>
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="confirmPassword" className="text-sm text-black mr-2">
            Confirmar contraseña:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="direccion" className="text-sm text-black mr-2">
            Dirección:
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="telefono" className="text-sm text-black mr-2">
            Teléfono:
          </label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-3 text-black bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 font-bold rounded-lg transition-colors border-2 text-lg bg-[#334139] text-[#FBFEF9] border-[#334139] hover:bg-[#FBFEF9] hover:text-[#334139] hover:border-[#5D008F]"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        {message && (
          <p
            className={`mt-2 text-center text-sm ${
              message.startsWith("Error") || message.includes("contraseña")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
        </span>
        <a href="/Login" className="text-black hover:text-gray-700">
          Iniciar sesión
        </a>
      </div>
    </div>
  );
};

export default SignUpComponent;
