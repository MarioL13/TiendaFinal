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
              <span
                className="py-2 px-4 font-bold rounded-lg transition-colors border-2 text-lg cursor-pointer"
                style={{
                  background: "#97DF4D",
                  color: "#4E1D63",
                  border: "2px solid #4E1D63",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.background =
                    "#6E2C91";
                  (e.currentTarget as HTMLSpanElement).style.color = "#97DF4D";
                  (e.currentTarget as HTMLSpanElement).style.border =
                    "2px solid #97DF4D";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.background =
                    "#97DF4D";
                  (e.currentTarget as HTMLSpanElement).style.color = "#4E1D63";
                  (e.currentTarget as HTMLSpanElement).style.border =
                    "2px solid #4E1D63";
                }}
              >
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
                className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
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
                className="w-full mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
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
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Correo Electrónico"
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
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Teléfono"
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
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Dirección"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 font-bold rounded-lg transition-colors border-2 text-lg"
            style={{
              background: "#97DF4D",
              color: "#4E1D63",
              border: "2px solid #4E1D63",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6E2C91";
              e.currentTarget.style.color = "#97DF4D";
              e.currentTarget.style.border = "2px solid #97DF4D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#97DF4D";
              e.currentTarget.style.color = "#4E1D63";
              e.currentTarget.style.border = "2px solid #4E1D63";
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2 px-4 font-bold rounded-lg transition-colors border-2 text-lg"
            style={{
              background: "#97DF4D",
              color: "#4E1D63",
              border: "2px solid #4E1D63",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6E2C91";
              e.currentTarget.style.color = "#97DF4D";
              e.currentTarget.style.border = "2px solid #97DF4D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#97DF4D";
              e.currentTarget.style.color = "#4E1D63";
              e.currentTarget.style.border = "2px solid #4E1D63";
            }}
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
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Contraseña Actual"
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
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Nueva Contraseña"
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
              className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Confirmar Nueva Contraseña"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 font-bold rounded-lg transition-colors border-2 text-lg"
            style={{
              background: "#97DF4D",
              color: "#4E1D63",
              border: "2px solid #4E1D63",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6E2C91";
              e.currentTarget.style.color = "#97DF4D";
              e.currentTarget.style.border = "2px solid #97DF4D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#97DF4D";
              e.currentTarget.style.color = "#4E1D63";
              e.currentTarget.style.border = "2px solid #4E1D63";
            }}
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}