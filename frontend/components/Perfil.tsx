'use client';
import React, { useState } from "react";

interface User {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}


export default function ProfileManager({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    avatar: user.avatar || "/default-avatar.png",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos actualizados:", formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Contraseña actualizada:", passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center mt-20 mb-20">
      <div className="max-w-4xl w-full p-8 shadow-lg rounded-3xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={formData.avatar}
              alt="Profile Avatar"
              className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-blue-500"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: URL.createObjectURL(files[0]),
                    }));
                  }
                }}
              />
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <>
                <form onSubmit={handleSubmit} className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
                          placeholder="Nombre"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">
                          Apellido
                        </label>
                        <input
                          type="text"
                          name="surname"
                          value={formData.surname}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
                          placeholder="Apellido"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Cambiar Contraseña
                  </h3>
                  <form onSubmit={handlePasswordSubmit} className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                    >
                      Actualizar Contraseña
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="grid gap-4">
                <h2 className="text-2xl font-semibold text-gray-700">
                  {formData.name} {formData.surname}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {formData.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Teléfono:</strong> {formData.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Dirección:</strong> {formData.address}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                  Editar Perfil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
