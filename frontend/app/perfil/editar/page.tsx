"use client";
import { useEffect, useState } from "react";
import EditarPerfil from "@/components/EditarPerfil";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    avatar: "/default-avatar.png",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.nombre || "",
            surname: data.apellido || "",
            email: data.email || "",
            phone: data.telefono || "",
            address: data.direccion || "",
            avatar: data.FOTO || "/default-avatar.png",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handlers de ejemplo (debes adaptarlos a tu lógica)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // lógica para guardar cambios
  };
  const handleCancel = () => {};
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // lógica para cambiar contraseña
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-35 pb-30 w-full">
      <EditarPerfil
        formData={formData}
        onChange={handleInputChange}
        onAvatarChange={handleAvatarChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        passwordData={passwordData}
        onPasswordChange={handlePasswordChange}
        onPasswordSubmit={handlePasswordSubmit}
      />
    </div>
  );
}

