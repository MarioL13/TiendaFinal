'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditarPerfil from "./EditarPerfil";

interface User {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export default function ProfileManager() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    avatar: "/default-avatar.png",
  });
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          credentials: 'include',
        });
        if (!response.ok) {
          router.push("/Login");
          return;
        }
        const data = await response.json();
        // Si no hay datos válidos, redirige
        if (!data || !data.email) {
          router.push("/Login");
          return;
        }
        setFormData({
          name: data.nombre || "",
          surname: data.apellido || "",
          email: data.email || "",
          phone: data.telefono || "",
          address: data.direccion || "",
          avatar: data.FOTO ? data.FOTO : "/default-avatar.png",
        });
      } catch (error) {
        router.push("/Login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al actualizar el perfil');
      setIsEditing(false);
    } catch (error) {
      alert("Error al actualizar el perfil");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Aquí deberías hacer la petición real para cambiar la contraseña
    // Ejemplo:
    /*
    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });
      if (!response.ok) throw new Error('Error al cambiar la contraseña');
      alert("Contraseña actualizada");
    } catch (error) {
      alert("Error al cambiar la contraseña");
    }
    */
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(files[0]),
      }));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-auto">
        <div className="flex flex-col items-center gap-6 p-6 mt-1">
          <div className="relative">
            <img
              src={formData.avatar}
              alt="Profile Avatar"
              className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-blue-500"
            />
          </div>
          <div className="w-full">
            {isEditing ? (
              <EditarPerfil
                formData={formData}
                onChange={handleInputChange}
                onAvatarChange={handleAvatarChange}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                passwordData={passwordData}
                onPasswordChange={handlePasswordChange}
                onPasswordSubmit={handlePasswordSubmit}
              />
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
                  className="mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
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