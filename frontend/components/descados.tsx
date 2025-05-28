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
        const response = await axios.get('https://tiendafinal-production-2d5f.up.railway.app/api/products/destacados');

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
          className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border-2"
          style={{ border: '2px solid #4E1D63', boxShadow: '0 4px 16px 0 rgba(78,29,99,0.10)' }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 12px 32px 0 rgba(78,29,99,0.18)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(78,29,99,0.10)';
          }}
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

            <button
              className="w-full font-bold py-3 rounded-lg transition-colors cursor-pointer"
              style={{ background: '#334139', color: '#FBFEF9', border: '2px solid #334139' }}
              onClick={() => window.location.href = `/productos/${producto.id_producto}`}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#FBFEF9';
                e.currentTarget.style.color = '#334139';
                e.currentTarget.style.border = '2px solid #6E2C91';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#334139';
                e.currentTarget.style.color = '#FBFEF9';
                e.currentTarget.style.border = '2px solid #334139';
              }}
            >
              ver producto
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Destacados;
