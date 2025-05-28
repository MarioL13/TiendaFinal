import React, { useState, useEffect } from 'react';
import '../styles/producto.css';

interface Producto {
    id_producto: number;
    nombre: string;
    idioma?: string | null;
    descripcion?: string | null;
    precio: number;
    stock: number;
    imagenes: string[];
    categorias: string[];
}

interface ApiResponse {
    productos: Producto[];
    total: number;
    page: number;
    totalPages: number;
}

// Componente modal simple para confirmación
const ConfirmModal: React.FC<{
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Confirmación</h3>
                    <div className="mt-4 px-7 py-3">
                        <p className="text-lg text-gray-700">{message}</p>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            Sí, eliminar
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filtros
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState<'asc' | 'desc'>('asc');
    const [idioma, setIdioma] = useState('');

    // Estado para modal de confirmación
    const [modalOpen, setModalOpen] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                search,
                category,
                sort,
                idioma,
            });
            const response = await fetch(
                `https://tiendafinal-production-2d5f.up.railway.app/api/products?${queryParams.toString()}`
            );
            if (!response.ok) throw new Error('Error al obtener productos');

            const data: ApiResponse = await response.json();
            const productosAdaptados: Producto[] = data.productos.map((item: any) => ({
                id_producto: item.id_producto,
                nombre: item.nombre,
                idioma: item.idioma,
                descripcion: item.descripcion,
                precio: parseFloat(item.precio),
                stock: item.stock,
                imagenes: JSON.parse(item.imagenes),
                categorias: item.categorias || [],
            }));
            setProductos(productosAdaptados);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, [page, search, category, sort, idioma]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            setPage(newPage);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setSearch(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setCategory(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setSort(e.target.value as 'asc' | 'desc');
    };

    const handleIdiomaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setIdioma(e.target.value);
    };

    // Abrir modal confirmación para eliminar producto
    const confirmarEliminar = (id_producto: number) => {
        setProductoAEliminar(id_producto);
        setModalOpen(true);
    };

    // Ejecutar eliminación después de confirmar
    const handleEliminar = async () => {
        if (productoAEliminar === null) return;
        setModalOpen(false);
        try {
            const response = await fetch(
                `https://tiendafinal-production-2d5f.up.railway.app/api/products/${productoAEliminar}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar producto');
            }
            fetchProductos();
        } catch (error) {
            alert('No se pudo eliminar el producto.');
            console.error(error);
        } finally {
            setProductoAEliminar(null);
        }
    };

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="Buscar producto"
                    value={search}
                    onChange={handleSearchChange}
                    className="border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Filtrar por categoría"
                    value={category}
                    onChange={handleCategoryChange}
                    className="border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="asc">Precio ↑</option>
                    <option value="desc">Precio ↓</option>
                </select>
                <select
                    value={idioma}
                    onChange={handleIdiomaChange}
                    className="border rounded-md px-3 py-2"
                >
                    <option value=""></option>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Cargando productos...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {productos.map((producto) => (
                        <div
                            key={producto.id_producto}
                            className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                        >
                            <div className="relative aspect-w-4 aspect-h-3">
                                <div className="img-cuadrada">
                                    <img
                                        src={producto.imagenes[0]}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {producto.nombre}
                                    </h3>
                                    <p className="text-gray-500 mt-1 line-clamp-2-custom overflow-hidden">
                                        {producto.descripcion}
                                    </p>
                                </div>
                                <div>
                                    {producto.categorias && producto.categorias.length > 0 && (
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {producto.categorias.join(', ')}
                    </span>
                                    )}
                                </div>

                                <button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
                                    onClick={() =>
                                        (window.location.href = `/productos/${producto.id_producto}`)
                                    }
                                >
                                    Ver producto
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                                        onClick={() =>
                                            (window.location.href = `/admin/productos/${producto.id_producto}/editar`)
                                        }
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
                                        onClick={() => confirmarEliminar(producto.id_producto)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <nav className="flex justify-center mt-8">
                <ul className="flex">
                    <li>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border text-sm text-gray-500"
                        >
                            ←
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1}>
                            <button
                                onClick={() => handlePageChange(i + 1)}
                                className={`mx-1 h-9 w-9 flex items-center justify-center rounded-full text-sm ${
                                    page === i + 1
                                        ? 'bg-pink-500 text-white'
                                        : 'border text-gray-600'
                                }`}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border text-sm text-gray-500"
                        >
                            →
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Modal de confirmación */}
            {modalOpen && (
                <ConfirmModal
                    message="¿Estás seguro de que deseas eliminar este producto?"
                    onConfirm={handleEliminar}
                    onCancel={() => setModalOpen(false)}
                />
            )}
        </>
    );
};

export default Productos;