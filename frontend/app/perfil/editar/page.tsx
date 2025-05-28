"use client";
import { useEffect, useState } from "react";
import EditarPerfil from "@/components/EditarPerfil";
import { useRouter } from "next/navigation";

interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  avatar: string; // para vista previa
  avatarFile?: File; // <-- para subir al backend
}

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://tiendafinal-production-2d5f.up.railway.app/api/users/me', {
          credentials: 'include',
        });
        if (!response.ok) {
          router.push("/Login");
          return;
        }
        const data = await response.json();
        if (!data || !data.email) {
          router.push("/Login");
          return;
        }
        setFormData({
          id: data.id_usuario,
          name: data.nombre || "",
          surname: data.apellido || "",
          email: data.email || "",
          phone: data.telefono || "",
          address: data.direccion || "",
          avatar: data.FOTO || "/default-avatar.png",
        });
      } catch {
        router.push("/Login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para cambiar avatar (solo vista previa local)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: url,
        avatarFile: file, // <-- Guardamos el archivo
      } as any)); // puedes definir el tipo correctamente luego
    }
  };

  // Handler para cancelar y volver al perfil
  const handleCancel = () => {
    router.push('/perfil');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.id) {
      setError("ID de usuario no disponible.");
      return;
    }

    try {
      const form = new FormData();
      form.append('nombre', formData.name);
      form.append('apellido', formData.surname);
      form.append('email', formData.email);
      form.append('telefono', formData.phone);
      form.append('direccion', formData.address);
      if (formData.avatarFile) {
        form.append('FOTO', formData.avatarFile); // <-- campo esperado por multer
      }

      const response = await fetch(`https://tiendafinal-production-2d5f.up.railway.app/api/users/${formData.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: form, // no usamos headers Content-Type, el navegador lo define solo
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al actualizar el perfil");
      }

      setSuccess("Perfil actualizado correctamente");
      router.push('/perfil');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/cambiarpassword", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          password: passwordData.currentPassword,
          nuevapassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al cambiar la contraseña");
      }

      setSuccess("Contraseña actualizada correctamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-35 pb-30 w-full flex flex-col items-center">
      <div className="w-full max-w-2xl">
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
        {error && (
          <div className="mt-4 text-center text-red-600 font-semibold bg-red-100 rounded-lg p-2 border border-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-center text-green-600 font-semibold bg-green-100 rounded-lg p-2 border border-green-300">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

