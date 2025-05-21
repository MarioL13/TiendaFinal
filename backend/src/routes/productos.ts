import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer, { Multer } from 'multer';
import fs from 'fs';

const upload: Multer = multer({ dest: 'uploads/' });

import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerDestacados
} from '../services/productosServices';
import {verificarAdmin, verificarToken} from "../middlewares/authMiddleware";

// Se crea una instancia del enrutador de Express
const router = Router();

// Ruta para obtener todos los productos
router.get('/api/products', async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const idioma = (req.query.idioma as string) || 'es';
    const sortParam = req.query.sort as string;
    const sort: 'asc' | 'desc' = sortParam === 'desc' ? 'desc' : 'asc';

    try {
        const productos = await obtenerProductos({ page, limit, search, category, sort, idioma });
        res.json(productos);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
});

// Ruta para obtener todos los productos destacados
router.get('/api/products/destacados', async (req: Request, res: Response) => {
    try{
        const productos = await obtenerDestacados();
        res.json(productos);
    }catch(err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
})

// Ruta para obtener un producto por su ID
router.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el parámetro ID a número

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    try {
        const producto = await obtenerProductoPorId(id);
        if (producto) {
            res.json({
                ...producto,
                imagenes: JSON.parse(producto.imagenes), // Recupera las URLs almacenadas como JSON
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
router.post('/api/products', upload.array('imagenes'),  verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    let producto = req.body; // Obtiene los datos del producto

    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'No se han subido imágenes' });
    }

    // Subir imágenes a Cloudinary o similar
    const imagenesUrls = await Promise.all(
        (req.files as Express.Multer.File[]).map((file) => subirImagen(file))
    );

    // Aquí parseamos el campo categorias si viene como string (form-data)
    if (typeof producto.categorias === 'string') {
        try {
            producto.categorias = JSON.parse(producto.categorias);
        } catch (e) {
            return res.status(400).json({ error: 'El campo categorias debe ser un array JSON válido' });
        }
    }

    // Aseguramos que categorias es un array
    if (!Array.isArray(producto.categorias)) {
        return res.status(400).json({ error: 'El campo categorias debe ser un array' });
    }

    const productoConImagenes = {
        ...producto,
        imagenes: imagenesUrls, // Almacena un array de enlaces
    };

    // Validación de los campos (puede usar la que ya tienes)
    const error = validarProducto(productoConImagenes);
    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const result = await crearProducto(productoConImagenes);
        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message });
    }
});

// Ruta para actualizar un producto existente por su ID
router.put('/api/products/:id',  verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = req.body;

    // Validación de los campos
    const error = validarProducto(producto);
    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const result = await actualizarProducto(id, producto);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/api/products/:id',  verificarToken, verificarAdmin, async (req: Request, res: Response) => {
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

// Función de validación para productos
const validarProducto = (producto: any): string | null => {
    if (!producto.nombre || typeof producto.nombre !== 'string') {
        return 'El nombre del producto es obligatorio y debe ser un texto';
    }
    if (producto.stock === undefined || isNaN(producto.stock) || producto.stock < 0) {
        return 'El stock debe ser un número mayor o igual a 0';
    }
    if (producto.precio === undefined || isNaN(producto.precio) || producto.precio < 0) {
        return 'El precio debe ser un número mayor o igual a 0';
    }
    return null;  // Si pasa todas las validaciones
}

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const subirImagen = (imagen: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagen.path, (error, result) => {
            fs.unlinkSync(imagen.path); // elimina el archivo local
            if (error || !result) {
                return reject(error || new Error('No se pudo subir la imagen'));
            }
            resolve(result.secure_url);
        });
    });
};