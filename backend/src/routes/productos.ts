import { Router, Request, Response } from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../services/productosServices';

// Se crea una instancia del enrutador de Express
const router = Router();

// Ruta para obtener todos los productos
router.get('/api/products', async (req: Request, res: Response) => {
    try {
        const products = await obtenerProductos(); // Llama a la función que obtiene los productos
        res.json(products); // Devuelve los productos en formato JSON
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
});

// Ruta para obtener un producto por su ID
router.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el parámetro ID a número

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    try {
        const producto = await obtenerProductoPorId(id); // Busca el producto en la base de datos
        if (producto) {
            let imagenBase64 = null;

            if (producto.imagen) {
                imagenBase64 = producto.imagen.toString('base64');
            }

            res.json({
                ...producto,
                imagen: imagenBase64 ? `data:image/jpeg;base64,${imagenBase64}` : null,
            });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err: any) {
        console.error('Error al obtener el producto:', err.message);
        res.status(500).json({ message: 'Error al obtener el producto', error: err.message });
    }
});

// Ruta para crear un nuevo producto
router.post('/api/products', async (req: Request, res: Response) => {
    const producto = req.body; // Obtiene los datos del producto desde el cuerpo de la solicitud
    try {
        const result = await crearProducto(producto); // Llama a la función para crear el producto
        res.status(201).json({ message: 'Producto creado', id: result.insertId }); // Devuelve el ID del producto creado
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message });
    }
});

// Ruta para actualizar un producto existente por su ID
router.put('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el ID de la URL a número
    const producto = req.body; // Obtiene los nuevos datos del producto
    try {
        const result = await actualizarProducto(id, producto); // Llama a la función para actualizar el producto
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado correctamente', id: result.insertId });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra, devuelve un error 404
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el producto', error: err.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el ID de la URL a número
    try {
        const result = await eliminarProducto(id); // Llama a la función para eliminar el producto
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto eliminado' }); // Confirma la eliminación
        } else {
            res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra, devuelve un error 404
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message });
    }
});

// Exporta el enrutador para ser utilizado en la aplicación principal
export default router;
