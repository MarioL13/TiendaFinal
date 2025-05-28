'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [userData, setUserData] = useState<User>({});
  const [loading, setLoading] = useState(true);

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
        if (!data || !data.email) {
          router.push("/Login");
          return;
        }
        setUserData({
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-auto">
        <div className="flex flex-col items-center gap-6 p-6 mt-1">
          <div className="relative">
            <img
              src={userData.avatar}
              alt="Profile Avatar"
              className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-blue-500"
            />
          </div>

          <div className="w-full">
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                {userData.name} {userData.surname}
              </h2>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {userData.email}</p>
              <p className="text-sm text-gray-600"><strong>Teléfono:</strong> {userData.phone}</p>
              <p className="text-sm text-gray-600"><strong>Dirección:</strong> {userData.address}</p>
              <button
                onClick={() => router.push("/perfil/editar")}
                className="mt-4 py-2 font-bold rounded-lg transition-colors border-2 text-lg"
                style={{ background: '#334139', color: '#FBFEF9', border: '2px solid #334139' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#FBFEF9';
                  e.currentTarget.style.color = '#334139';
                  e.currentTarget.style.border = '2px solid #5D008F';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#334139';
                  e.currentTarget.style.color = '#FBFEF9';
                  e.currentTarget.style.border = '2px solid #334139';
                }}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}