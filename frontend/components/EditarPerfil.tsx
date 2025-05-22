import React from "react";

interface EditarPerfilProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EditarPerfil({
  formData,
  onChange,
  onAvatarChange,
  onSubmit,
  onCancel,
  passwordData,
  onPasswordChange,
  onPasswordSubmit,
}: EditarPerfilProps) {
  return (
    <div className="w-full max-w-2xl mx-auto overflow-auto p-1 mt-5">
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center mb-4">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
            <label className="ml-4 flex items-center">
              <span className="py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 shadow-sm hover:bg-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer">
                Agregar archivo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </span>
            </label>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-black">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}

                className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black"
                placeholder="Nombre"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-black">
                Apellido
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={onChange}
                className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black"
                placeholder="Apellido"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black"
              placeholder="Dirección"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 shadow-sm hover:bg-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-900 text-white rounded-lg border border-blue-800 shadow-sm hover:bg-blue-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
      {/* Formulario de cambiar contraseña */}
      <div className="mt-8 mb-10">
        <h3 className="text-lg font-semibold text-black mb-4">
          Cambiar Contraseña
        </h3>
        <form onSubmit={onPasswordSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Contraseña Actual
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={onPasswordChange}
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={onPasswordChange}
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={onPasswordChange}
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 shadow-sm hover:bg-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}