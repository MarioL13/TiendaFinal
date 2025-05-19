import React, { useEffect, useState } from 'react';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  imagenes: string[];
  categorias: string[];
}

const ProductCard = ({ id }: { id: number }) => {
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      setProducto(data);
    };
    fetchProducto();
  }, [id]);

  if (!producto) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md overflow-hidden">
      <div className="flex flex-col items-center md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/2 w-full p-4 relative">
          <div>
            <img
              src={producto.imagenes[0]}
              alt={producto.nombre}
              className="w-full h-80 object-cover rounded-md"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 w-full p-6 flex flex-col h-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{producto.nombre}</h1>
          <p className="text-sm text-gray-600 mb-4">{producto.descripcion}</p>

          <div className="flex items-center mb-4">
            <span className="bg-green-500 text-white text-sm font-semibold px-2.5 py-0.5 rounded-md">En stock: {producto.stock}</span>
            <span className="text-sm text-gray-500 ml-2">{producto.categorias.join(', ')}</span>
          </div>

          <ul className="text-sm text-gray-700 mb-6">
            {/* Puedes agregar más detalles si tu API los devuelve */}
          </ul>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-gray-900">${producto.precio}</span>
            </div>
          </div>

          <p className="text-green-600 text-sm font-semibold mb-4">Free Delivery</p>


            <div className="flex space-x-4 mt-auto mb-0">
            <div className="flex space-x-4 mt-auto mb-0 w-full justify-center">
              <button className="flex-1 mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 cursor-pointer">
              Buy Now
              </button>
              <button className="flex-1 mt-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 cursor-pointer">
              Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
