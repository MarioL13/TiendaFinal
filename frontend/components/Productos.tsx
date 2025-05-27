import React, {useState, useEffect} from 'react';
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

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                search,
                category,
                sort,
                idioma
            });
            console.log(queryParams.toString());
            const response = await fetch(`https://tiendafinal-production-2d5f.up.railway.app/api/products?${queryParams.toString()}`);
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

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center gap-4 justify-center">
                <div className="border border-gray-300 p-4 flex flex-col md:flex-row items-center gap-4 bg-white shadow-lg rounded-lg w-full md:w-auto">
                    {/* Input de búsqueda */}
                    <div className="flex items-center border rounded bg-gray-200 px-2 py-1">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={handleSearchChange}
                            className="bg-gray-200 focus:outline-none text-gray-700 flex-1"
                        />
                    </div>
                    {/* Input de categoría */}
                    <div className="flex items-center border rounded bg-gray-200 px-2 py-1">
                        <svg className="fill-current text-gray-800 mr-2 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM5.68 7.1A7.96 7.96 0 0 0 4.06 11H5a1 1 0 0 1 0 2h-.94a7.95 7.95 0 0 0 1.32 3.5A9.96 9.96 0 0 1 11 14.05V9a1 1 0 0 1 2 0v5.05a9.96 9.96 0 0 1 5.62 2.45 7.95 7.95 0 0 0 1.32-3.5H19a1 1 0 0 1 0-2h.94a7.96 7.96 0 0 0-1.62-3.9l-.66.66a1 1 0 1 1-1.42-1.42l.67-.66A7.96 7.96 0 0 0 13 4.06V5a1 1 0 0 1-2 0v-.94c-1.46.18-2.8.76-3.9 1.62l.66.66a1 1 0 0 1-1.42 1.42l-.66-.67zM6.71 18a7.97 7.97 0 0 0 10.58 0 7.97 7.97 0 0 0-10.58 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={category}
                            onChange={handleCategoryChange}
                            className="bg-gray-200 focus:outline-none text-gray-700 flex-1"
                        />
                    </div>
                    {/* Selector de orden */}
                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="border p-2 rounded min-w-[120px] text-black"
                    >
                        <option value="asc">Precio ↑</option>
                        <option value="desc">Precio ↓</option>
                    </select>
                    {/* Selector de idioma */}
                    <select
                        value={idioma}
                        onChange={handleIdiomaChange}
                        className="border p-2 rounded min-w-[120px] text-black"
                    >
                        <option value="">Idioma</option>
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                    </select>
                    {/* Botón buscar */}
                    <button
                        className="p-2 border rounded-md bg-gray-800 text-white font-bold shadow hover:bg-gray-900 transition"
                        onClick={() => fetchProductos()}
                        type="button"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Cargando productos...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {productos.map((producto) => (
                        <div
                            key={producto.id_producto}
                            className="max-w-sm w-full bg-white rounded-xl overflow-hidden transition-all"
                            style={{
                                boxShadow: '0 8px 24px 0 rgba(78,29,99,0.18), 0 1.5rem 2rem rgba(78,29,99,0.10)',
                                borderRadius: '2rem',
                                border: '1px solid #6E2C91',
                                transform: 'translateY(-8px)',
                                position: 'relative',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-20px) scale(1.03)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-8px)'}
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
                                    <h3 className="text-xl font-bold text-gray-900">{producto.nombre}</h3>
                                    <p className="text-gray-500 mt-1 line-clamp-2-custom overflow-hidden">
                                        {producto.descripcion}
                                    </p>
                                </div>
                                <div>
                                    {producto.categorias && producto.categorias.length > 0 && (
                                        <span
                                            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                          {producto.categorias.join(', ')}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-gray-900">{producto.precio} €</span>
                                </div>
                                <button
                                    className="w-full font-bold py-3 rounded-lg transition-colors"
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
                                    Ver producto
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            <nav className="flex justify-center mt-8">
                <ul className="flex">
                    <li>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border text-sm"
                            style={{ background: '#97DF4D', color: '#6E2C91', borderColor: '#4E1D63' }}
                        >
                            ←
                        </button>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => (
                        <li key={i + 1}>
                            <button
                                onClick={() => handlePageChange(i + 1)}
                                style={{ background: page === i + 1 ? '#97DF4D' : 'white', color: '#6E2C91', borderColor: '#4E1D63' }}
                                className={`mx-1 h-9 w-9 flex items-center justify-center rounded-full text-sm border ${page === i + 1 ? 'font-bold shadow' : ''}`}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border text-sm"
                            style={{ background: '#97DF4D', color: '#4E1D63', borderColor: '#4E1D63' }}
                        >
                            →
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Productos;
