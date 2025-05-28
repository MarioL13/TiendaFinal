"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

interface CarritoItem {
  id_carrito: number;
  tipo_item: string;
  id_item: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

const Carrito: React.FC = () => {
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState("");
  const [pagoSuccess, setPagoSuccess] = useState("");
  const { updateCartTotal } = useCart();

  const fetchCarrito = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/carrito", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo cargar el carrito");
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const handleRemove = async (tipo_item: string, id_item: number) => {
    try {
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/carrito/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tipo_item, id_item }),
      });
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      await updateCartTotal();
      fetchCarrito();
    } catch (err) {
      alert("Error al eliminar el producto");
    }
  };

  // El id_usuario se obtiene del localStorage (o contexto auth) en vez de pedirlo al backend
  const getUserId = () => {
    // Si usas contexto de usuario, reemplaza esto por tu lógica
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id_usuario || user.id;
      }
    } catch {}
    return null;
  };

  const handleProcederPago = async () => {
    setPagoLoading(true);
    setPagoError("");
    setPagoSuccess("");
    try {
      const id_usuario = getUserId();
      if (!id_usuario) throw new Error("Usuario no autenticado");
      // Confirmar compra
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/pedidos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_usuario, tipoPago: "online" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");
      setPagoSuccess("¡Compra realizada con éxito!");
      setItems([]); // Vacía el carrito visualmente
      await updateCartTotal();
      window.location.href = "/";
    } catch (err: any) {
      setPagoError(err.message || "Error al procesar el pago");
    } finally {
      setPagoLoading(false);
    }
  };

  const handleRecogerEnTienda = async () => {
    setPagoLoading(true);
    setPagoError("");
    setPagoSuccess("");
    try {
      const id_usuario = getUserId();
      if (!id_usuario) throw new Error("Usuario no autenticado");
      // Confirmar compra con tipoPago 'tienda'
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/pedidos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_usuario, tipoPago: "tienda" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pedido");
      setPagoSuccess("¡Pedido realizado para recoger en tienda!");
      setItems([]); // Vacía el carrito visualmente
      await updateCartTotal();
      window.location.href = "/";
    } catch (err: any) {
      setPagoError(err.message || "Error al procesar el pedido");
    } finally {
      setPagoLoading(false);
    }
  };

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Cargando carrito...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8 mt-8 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Carrito de compras</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Lista de productos */}
        <div className="flex-1">
          {items.length === 0 ? (
            <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id_carrito} className="flex flex-col md:flex-row items-center py-6 gap-4 md:gap-0">
                  <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gray-50 border rounded-lg overflow-hidden">
                    {item.imagen ? (
                      <img src={item.imagen.startsWith('http') ? item.imagen : `/uploads/${item.imagen}`} alt={item.nombre} className="object-contain w-full h-full" />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </div>
                  <div className="flex-1 md:ml-6 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-lg text-gray-800">{item.nombre}</div>
                        <div className="text-sm text-gray-500 mt-1">ID: {item.id_item}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Precio unitario: <span className="text-green-700 font-bold">{item.precio}€</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Cantidad: <span className="font-semibold">{item.cantidad}</span>
                        </div>
                        <div className="text-sm text-gray-700 mt-1 font-bold">
                          Subtotal: {(item.precio * item.cantidad).toFixed(2)}€
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(item.tipo_item, item.id_item)}
                        className="mt-4 md:mt-0 font-semibold px-4 py-2 rounded shadow border transition text-white"
                        style={{ background: '#F87171', border: '2px solid #B91C1C' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#B91C1C';
                          e.currentTarget.style.border = '2px solid #F87171';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#F87171';
                          e.currentTarget.style.border = '2px solid #B91C1C';
                          e.currentTarget.style.color = '#fff';
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Resumen */}
        <div className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-lg p-6 h-fit shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Resumen de compra</h3>
          <div className="flex justify-between text-lg mb-2">
            <span className="text-black">Productos:</span>
            <span className="text-black">{items.length}</span>
          </div>
          <div className="flex justify-between text-lg mb-2">
            <span className="text-black">Total:</span>
            <span className="text-green-700 font-bold">{total.toFixed(2)}€</span>
          </div>
          <button
            className="w-full mt-6 font-bold py-3 rounded shadow border transition text-lg"
            style={{ background: '#97DF4D', color: '#4E1D63', border: '2px solid #4E1D63' }}
            disabled={items.length === 0 || pagoLoading}
            onClick={handleProcederPago}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#6E2C91';
              e.currentTarget.style.color = '#97DF4D';
              e.currentTarget.style.border = '2px solid #97DF4D';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#97DF4D';
              e.currentTarget.style.color = '#4E1D63';
              e.currentTarget.style.border = '2px solid #4E1D63';
            }}
          >
            {pagoLoading ? 'Procesando...' : 'Proceder al pago'}
          </button>
          {pagoError && <div className="text-red-500 text-center mt-2">{pagoError}</div>}
          {pagoSuccess && <div className="text-green-600 text-center mt-2">{pagoSuccess}</div>}
          <button
            className="w-full mt-3 font-bold py-3 rounded shadow border transition text-lg"
            style={{ background: '#97DF4D', color: '#4E1D63', border: '2px solid #4E1D63' }}
            disabled={items.length === 0 || pagoLoading}
            onClick={handleRecogerEnTienda}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#6E2C91';
              e.currentTarget.style.color = '#97DF4D';
              e.currentTarget.style.border = '2px solid #97DF4D';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#97DF4D';
              e.currentTarget.style.color = '#4E1D63';
              e.currentTarget.style.border = '2px solid #4E1D63';
            }}
          >
            {pagoLoading ? 'Procesando...' : 'Recoger en tienda'}
          </button>
          <p className="text-xs text-gray-500 mt-3">El envío y los impuestos se calcularán en el siguiente paso.</p>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
