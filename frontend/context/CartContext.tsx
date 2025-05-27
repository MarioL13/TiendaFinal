'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartTotal: number;
  updateCartTotal: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartTotal, setCartTotal] = useState(0);

  const updateCartTotal = async () => {
    try {
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/carrito/total", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCartTotal(data.totalItems);
      }
    } catch (error) {
      console.error('Error al obtener total del carrito:', error);
    }
  };

  useEffect(() => {
    updateCartTotal();
  }, []);

  return (
    <CartContext.Provider value={{ cartTotal, updateCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
