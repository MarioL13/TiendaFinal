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
  const [mainImgIdx, setMainImgIdx] = useState(0);

  useEffect(() => {
    const fetchProducto = async () => {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      // Si 'imagenes' es un string, conviértelo en array
      if (typeof data.imagenes === 'string') {
        data.imagenes = data.imagenes.split(',').map((img: string) => img.trim());
      }
      setProducto(data);
      setMainImgIdx(0); // reset main image on product change
    };
    fetchProducto();
  }, [id]);

  if (!producto) {
    return <div>Cargando...</div>;
  }

  const handlePrev = () => {
    setMainImgIdx((prev) => (prev === 0 ? producto.imagenes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMainImgIdx((prev) => (prev === producto.imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md overflow-hidden">
      <div className="flex flex-col items-center md:flex-row md:h-[32rem]">
        {/* Product Image Carousel */}
        <div className="md:w-1/2 w-full p-6 flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center h-64 md:h-full relative">
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              aria-label="Anterior"
              type="button"
            >
              &#8592;
            </button>
            <img
              src={producto.imagenes[mainImgIdx]}
              alt={producto.nombre}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              aria-label="Siguiente"
              type="button"
            >
              &#8594;
            </button>
          </div>
          {/* Miniaturas debajo de la imagen principal */}
          <div className="flex justify-center gap-2 mt-4">
            {producto.imagenes.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className={`w-14 h-14 object-cover rounded-md cursor-pointer border-2 ${idx === mainImgIdx ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setMainImgIdx(idx)}
              />
            ))}
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
  );
};

export default ProductCard;
