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
  total_vendidos: number;
}

const Destacados: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/destacados');

        const data = response.data as any[];
        const productosAdaptados: Producto[] = data.map((item: any) => ({
          id_producto: item.id_producto,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: parseFloat(item.precio),
          imagen: item.imagenes,
          categorias: item.categorias || [],
          total_vendidos: parseInt(item.total_vendidos, 10),
        }));
        setProductos(productosAdaptados);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();

  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando productos destacados...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <div
          key={producto.id_producto}
          className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
        >
          <div className="relative">
            <img
              src={producto.imagen[0]}
              alt={producto.nombre}
              className="w-full h-52 object-cover"
            />
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{producto.nombre}</h3>
               <p className="text-gray-500 mt-1 line-clamp-2-custom overflow-hidden">
                {producto.descripcion}
              </p>
            </div>
            <div className="">
            {producto.categorias && producto.categorias.length > 0 && (
              <span className=" top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {producto.categorias.join(', ')}
              </span>
            )}
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">{producto.precio} €</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-yellow-400">★★★★</div>
                <div className="text-gray-300">★</div>
                <span className="text-sm text-gray-600 ml-1">({producto.total_vendidos})</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
            onClick={() => window.location.href = `/productos/${producto.id_producto}`}>
              ver producto
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Destacados;
