'use client';
import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useCart } from "@/context/CartContext";

interface Usuario {
  id_usuario: number;
  FOTO: string | null;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  telefono: string;
  rol: string;
}

const StoreLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartTotal } = useCart();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://tiendafinal-production-2d5f.up.railway.app/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setProfileOpen(false);
        window.location.href = "/Login";
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/users/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <div>
      <Head>
        <title>Responsive Store Layout with Full-Screen Cart Drawer on Mobile</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <input type="checkbox" id="cartToggle" className="hidden" />

      <header className="w-full shadow-md p-4 fixed top-0 left-0 z-20" style={{ background: '#97DF4D' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex w-full justify-between items-center">
            <div className="text-lg font-bold">
              <a href="/">
                <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-lg" />
              </a>
            </div>
            <nav className="flex space-x-4 text-xl font-bold">
              <a href="/" className="text-[#6e2c91] hover:text-white">Portada</a>
              <a href="/tienda" className="text-[#6e2c91] hover:text-white">Tienda</a>
              <a href="/Cartas" className="text-[#6e2c91] hover:text-white">Cartas</a>
            </nav>
            <div className="flex items-center space-x-4" style={{ background: '#97DF4D' }}>
                <label
                htmlFor="cartToggle"
                className="cursor-pointer text-[#6e2c91] hover:text-white relative"
                onClick={() => window.location.href = "/Carrito"}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-shopping-basket-icon lucide-shopping-basket">
                  <path d="m15 11-1 9" />
                  <path d="m19 11-4-7" />
                  <path d="M2 11h20" />
                  <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
                  <path d="M4.5 15.5h15" />
                  <path d="m5 11 4-7" />
                  <path d="m9 11 1 9" />
                </svg>
                {cartTotal > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartTotal}
                  </span>
                )}
                </label>

              <div className="relative" ref={profileRef} style={{ background: '#97DF4D' }}>
                {isAuthenticated === null ? null : isAuthenticated ? (
                  <>                    <img
                    alt={userData?.nombre || "Profile"}
                    src={userData?.FOTO ? userData.FOTO : "/default-avatar.png"}
                    className="inline-block h-12 w-12 cursor-pointer rounded-full object-cover object-center border-2 border-gray-300"
                    onClick={() => setProfileOpen((v) => !v)}
                  />
                    {profileOpen && (
                      <ul
                        role="menu"
                        className="absolute right-0 mt-2 z-30 flex min-w-[180px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg focus:outline-none"
                      >
                        <li>
                          <button
                            onClick={() => window.location.href = "/perfil"}
                            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all font-bold border-2"
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true" className="h-4 w-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p>Mi Perfil</p>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => window.location.href = "/perfil/editar"}
                            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all font-bold border-2"
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true" className="h-4 w-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            </svg>
                            <p>Editar Perfil</p>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => window.location.href = "/historial"}
                            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all font-bold border-2"
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history-icon lucide-history">
                              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                              <path d="M3 3v5h5" />
                              <path d="M12 7v5l4 2" />
                            </svg>
                            <p>Historial</p>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => window.location.href = "/deseados"}
                            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all font-bold border-2"
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                            <p>Deseados</p>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all font-bold border-2"
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out">
                              <path d="m16 17 5-5-5-5" />
                              <path d="M21 12H9" />
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            </svg>
                            <p>Cerrar Sesión</p>
                          </button>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => window.location.href = "/Login"}
                    className="py-2 px-4 font-bold rounded-lg transition-colors border-2 text-lg"
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
                    Iniciar sesión
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center justify-between w-full">
            <button
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Abrir menú"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="text-lg font-bold">
              <a href="/">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg" />
              </a>
            </div>
            <label
              htmlFor="cartToggle"
              className="cursor-pointer text-[#6e2c91] hover:text-white relative ml-2"
              onClick={() => window.location.href = "/Carrito"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-shopping-basket-icon lucide-shopping-basket">
                <path d="m15 11-1 9" />
                <path d="m19 11-4-7" />
                <path d="M2 11h20" />
                <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
                <path d="M4.5 15.5h15" />
                <path d="m5 11 4-7" />
                <path d="m9 11 1 9" />
              </svg>
              {cartTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartTotal}
                </span>
              )}
            </label>
          </div>
        </div>
        {/* Menú lateral móvil */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-40" onClick={() => setMobileMenuOpen(false)}>
            <nav
              className="fixed top-0 left-0 w-64 h-full bg-[#97DF4D] shadow-2xl flex flex-col p-6 gap-4 z-50 animate-slideIn"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="self-end mb-4 text-gray-700 hover:text-gray-900"
                aria-label="Cerrar menú"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <a href="/" className="text-[#6e2c91] font-bold text-xl py-2 hover:text-white">Portada</a>
              <a href="/tienda" className="text-[#6e2c91] font-bold text-xl py-2 hover:text-white">Tienda</a>
              <a href="/Cartas" className="text-[#6e2c91] font-bold text-xl py-2 hover:text-white">Cartas</a>
              <hr className="my-2 border-[#6e2c91]" />
              {isAuthenticated === null ? null : isAuthenticated ? (
                <>
                  <a href="/perfil" className="text-[#334139] font-bold text-lg py-2 hover:text-[#5D008F]">Mi Perfil</a>
                  <a href="/perfil/editar" className="text-[#334139] font-bold text-lg py-2 hover:text-[#5D008F]">Editar Perfil</a>
                  <a href="/historial" className="text-[#334139] font-bold text-lg py-2 hover:text-[#5D008F]">Historial</a>
                  <a href="/deseados" className="text-[#334139] font-bold text-lg py-2 hover:text-[#5D008F]">Deseados</a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-[#334139] font-bold text-lg py-2 hover:text-[#5D008F]"
                  >Cerrar Sesión</button>
                </>
              ) : (
                <button
                  onClick={() => { window.location.href = "/Login"; setMobileMenuOpen(false); }}
                  className="w-full text-left text-[#334139] font-bold text-lg py-2 hover:text-[#5D008F]"
                >Iniciar sesión</button>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default StoreLayout;