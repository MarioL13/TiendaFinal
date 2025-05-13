"use client";

import React from "react";
import Image from "next/image";

const ProductCard = ({ productId, productData }: { productId: number; productData: any }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-30">
      <div className="flex flex-col items-center md:flex-row">
        <div className="md:w-1/3 p-4 relative">
          <Image
            src={productData.image || "/placeholder.png"}
            alt={productData.name}
            width={312}
            height={312}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{productData.name}</h1>
          <p className="text-sm text-gray-600 mb-4">{productData.description}</p>
          <span className="text-3xl font-bold text-gray-900">${productData.price}</span>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
              Agregar al carrito
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;