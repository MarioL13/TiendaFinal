"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);
  const imagenesInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        setImagenesPreview(Array.isArray(data.imagenes) ? data.imagenes : []);
      })
      .catch(() => setError("No se pudo cargar el producto"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProducto((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (e: any) => {
    setProducto((prev: any) => ({ ...prev, categorias: e.target.value.split(",").map((c: string) => c.trim()) }));
  };

  const handleImagenesChange = (e: any) => {
    const files = Array.from(e.target.files);
    setImagenesPreview([
      ...imagenesPreview,
      ...files.map((file: any) => URL.createObjectURL(file)),
    ]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("descripcion", producto.descripcion);
    formData.append("precio", producto.precio);
    formData.append("stock", producto.stock);
    formData.append("idioma", producto.idioma);
    formData.append("categorias", JSON.stringify(producto.categorias));
    // Imágenes nuevas
    if (imagenesInput.current && imagenesInput.current.files && imagenesInput.current.files.length > 0) {
      Array.from(imagenesInput.current.files).forEach((file: any) => {
        formData.append("imagenes", file);
      });
    }
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar producto");
      setSuccess("Producto actualizado correctamente");
      router.push("/admin/productos");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!producto) return <div className="p-8 text-center">Producto no encontrado</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-30 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-center" style={{ color: 'black', letterSpacing: '1px' }}>Editar producto</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Nombre</label>
          <input name="nombre" value={producto.nombre || ""} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" style={{ color: 'black', background: '#f9f9f9' }} />
        </div>
        <div>
          <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Descripción</label>
          <textarea name="descripcion" value={producto.descripcion || ""} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[80px]" style={{ color: 'black', background: '#f9f9f9' }} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Precio</label>
            <input name="precio" type="number" min="0" step="0.01" value={producto.precio || ""} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" style={{ color: 'black', background: '#f9f9f9' }} />
          </div>
          <div className="flex-1">
            <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Stock</label>
            <input name="stock" type="number" min="0" value={producto.stock || ""} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" style={{ color: 'black', background: '#f9f9f9' }} />
          </div>
        </div>
        <div>
          <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Idioma</label>
          <input name="idioma" value={producto.idioma || ""} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" style={{ color: 'black', background: '#f9f9f9' }} />
        </div>
        <div>
          <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Categorías (separadas por coma)</label>
          <input name="categorias" value={producto.categorias?.join(", ") || ""} onChange={handleCategoriaChange} required className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" style={{ color: 'black', background: '#f9f9f9' }} />
        </div>
        <div>
          <label className="block text-base font-semibold mb-1" style={{ color: 'black' }}>Imágenes actuales</label>
          <div className="flex flex-wrap gap-3 mb-2">
            {imagenesPreview.map((img, i) => (
              <img key={i} src={img} alt="img" className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm" />
            ))}
          </div>
          <input type="file" multiple ref={imagenesInput} onChange={handleImagenesChange} className="block mt-2" accept="image/*" style={{ color: 'black' }} />
        </div>
        {error && <div className="text-red-600 text-center font-semibold" style={{ color: 'black' }}>{error}</div>}
        {success && <div className="text-green-600 text-center font-semibold" style={{ color: 'black' }}>{success}</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:from-blue-700 hover:to-blue-500 transition">Guardar cambios</button>
      </form>
    </div>
  );
}