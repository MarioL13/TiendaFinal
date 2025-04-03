'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambiar estado al hacer clic en el botón
  };

  return (
    <div>
      <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
        <a className="text-3xl font-bold leading-none" href="#">
          <svg className="h-10"  viewBox="0 0 10240 10240">
            <path d="M8284 9162 c-2 -207 -55 -427 -161 -667..."></path>
          </svg>
        </a>
        <div className="lg:hidden">
          <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={toggleMenu}>
            <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <ul className={`lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <li><Link className="text-sm text-gray-400 hover:text-gray-500" href="/home">Home</Link></li>
          <li><a className="text-sm text-blue-600 font-bold" href="#">About Us</a></li>
          <li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Services</a></li>
          <li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Pricing</a></li>
          <li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Contact</a></li>
        </ul>
      </nav>
      {/* Menú móvil */}
      <div className={`navbar-menu relative z-50 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
          <ul>
            <li><Link href="/home">Home</Link></li>
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Services</Link></li>
            <li><Link href="#">Pricing</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
