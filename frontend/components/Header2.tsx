'use client';
import React from "react";
import Head from "next/head";

const StoreLayout = () => {
  return (
    <>
      <Head>
        <title>Responsive Store Layout with Full-Screen Cart Drawer on Mobile</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <input type="checkbox" id="cartToggle" className="hidden" />

      <header className="w-full bg-white shadow-md p-4 fixed top-0 left-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex w-full justify-between items-center">
                <div className="text-lg font-bold">
                <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-lg" />
                </div>
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Shop</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">About</a>
            </nav>
            <div className="flex space-x-4 items-center">
              <a href="#" className="text-gray-700 hover:text-gray-900">Account</a>
              <label htmlFor="cartToggle" className="cursor-pointer text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-basket-icon lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
              </label>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-between w-full">
            <button className="text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"  d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="text-lg font-bold">Logo</div>
          </div>
        </div>
      </header>

      <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-md">
        <div className="flex justify-around items-center p-2">
          <a href="#" className="text-gray-700 hover:text-gray-900 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            <span className="text-xs">Menu</span>
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5v14" />
            </svg>
            <span className="text-xs">Shop</span>
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Account</span>
          </a>
          <label htmlFor="cartToggle" className="cursor-pointer text-gray-700 hover:text-gray-900 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-7 6h7" />
            </svg>
            <span className="text-xs">Basket</span>
          </label>
        </div>
      </footer>

      <div
        id="cartOverlay"
        className="fixed inset-0 z-30 bg-black bg-opacity-50 opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out"
      ></div>

      <div
        id="cartDrawer"
        className="fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-40 p-4 md:max-w-xs"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <label htmlFor="cartToggle" className="cursor-pointer text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </label>
        </div>
        <p className="text-gray-700">Your cart is empty.</p>
      </div>

      <style jsx>{`
        #cartToggle:checked ~ #cartDrawer {
          transform: translateX(0);
        }
        #cartToggle:checked ~ #cartOverlay {
          opacity: 1;
          pointer-events: auto;
        }
        @media (max-width: 768px) {
          #cartDrawer {
            width: 100vw;
          }
        }
      `}</style>
    </>
  );
};

export default StoreLayout;