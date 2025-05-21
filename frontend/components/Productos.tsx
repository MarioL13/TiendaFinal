import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/producto.css';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string[];
  categorias?: string[];
  total_vendidos?: number;
}

interface ApiResponse {
  productos: any[];
  total: number;
  page: number;
  totalPages: number;
}

const Destacados: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDestacados = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`http://localhost:5000/api/products?page=${page}`);
        const data = response.data;
        const productosAdaptados: Producto[] = data.productos.map((item: any) => ({
          id_producto: item.id_producto,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: parseFloat(item.precio),
          imagen: item.imagenes
            ? JSON.parse(item.imagenes)
            : ["https://via.placeholder.com/300x200?text=Sin+Imagen"],
          categorias: item.categorias || [],
          total_vendidos: item.total_vendidos ? parseInt(item.total_vendidos, 10) : 0,
        }));
        setProductos(productosAdaptados);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando productos destacados...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id_producto}
            className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative aspect-w-4 aspect-h-3">
              <div className="img-cuadrada">
                <img
                  src={producto.imagen[0]}
                  alt={producto.nombre}
                />
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{producto.nombre}</h3>
                <p className="text-gray-500 mt-1 line-clamp-2-custom overflow-hidden">
                  {producto.descripcion}
                </p>
              </div>
              <div>
                {producto.categorias && producto.categorias.length > 0 && (
                  <span className="top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {producto.categorias.join(', ')}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">${producto.precio}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-yellow-400">★★★★</div>
                  <div className="text-gray-300">★</div>
                  <span className="text-sm text-gray-600 ml-1">({producto.total_vendidos || 0})</span>
                </div>
              </div>

              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
                onClick={() => window.location.href = `/test/${producto.id_producto}`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="flex justify-center mt-8">
        <ul className="flex">
          <li>
            <button
              className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
              aria-label="Previous"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              type="button"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1}>
              <button
                className={`mx-1 flex h-9 w-9 items-center justify-center rounded-full p-0 text-sm transition duration-150 ease-in-out ${
                  page === i + 1
                    ? "bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-md shadow-pink-500/20"
                    : "border border-blue-gray-100 bg-transparent text-blue-gray-500 hover:bg-light-300"
                }`}
                onClick={() => handlePageChange(i + 1)}
                type="button"
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
              aria-label="Next"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Destacados;
