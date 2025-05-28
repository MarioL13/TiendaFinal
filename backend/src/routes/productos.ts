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
import { verificarAdmin, verificarToken } from "../middlewares/authMiddleware";

// Se crea una instancia del enrutador de Express
const router = Router();

dotenv.config();
// Configuración de Cloudinary con variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @api {get} /api/products Obtener lista de productos
 * @apiName ObtenerProductos
 * @apiGroup Productos
 * @apiParam {Number} [page=1] Número de página para paginación
 * @apiParam {Number} [limit=20] Cantidad máxima de productos por página
 * @apiParam {String} [search] Texto para búsqueda en nombre o descripción
 * @apiParam {String} [category] Filtrar por categoría
 * @apiParam {String="asc","desc"} [sort="asc"] Ordenar ascendente o descendente
 * @apiParam {String} [idioma] Filtrar por idioma del producto
 * @apiSuccess {Object[]} productos Lista de productos
 * @apiError (500) ErrorInterno Error al obtener los productos
 */
router.get('/api/products', async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const idioma = (req.query.idioma as string);
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

/**
 * @api {get} /api/products/destacados Obtener productos destacados
 * @apiName ObtenerDestacados
 * @apiGroup Productos
 * @apiSuccess {Object[]} productos Lista de productos destacados
 * @apiError (500) ErrorInterno Error al obtener los productos destacados
 */
router.get('/api/products/destacados', async (req: Request, res: Response) => {
    try {
        const productos = await obtenerDestacados();
        res.json(productos);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
});

/**
 * @api {get} /api/products/:id Obtener producto por ID
 * @apiName ObtenerProductoPorId
 * @apiGroup Productos
 * @apiParam {Number} id ID único del producto
 * @apiSuccess {Object} producto Datos del producto
 * @apiError (400) IDInvalido ID del producto inválido
 * @apiError (404) NoEncontrado Producto no encontrado
 * @apiError (500) ErrorInterno Error al obtener el producto
 */
router.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    try {
        const producto = await obtenerProductoPorId(id);
        if (producto) {
            res.json({
                ...producto,
                imagenes: JSON.parse(producto.imagenes),
            });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err: any) {
        console.error('Error al obtener el producto:', err.message);
        res.status(500).json({ message: 'Error al obtener el producto', error: err.message });
    }
});

/**
 * @api {post} /api/products Crear un nuevo producto
 * @apiName CrearProducto
 * @apiGroup Productos
 * @apiPermission administrador
 * @apiHeader {String} Authorization Token de autenticación Bearer
 * @apiParam {String} nombre Nombre del producto
 * @apiParam {Number} stock Cantidad en stock
 * @apiParam {Number} precio Precio del producto
 * @apiParam {Array} categorias Array con las categorías del producto
 * @apiParam {File[]} imagenes Imágenes del producto (form-data)
 * @apiSuccess (201) {String} message Mensaje de éxito
 * @apiSuccess (201) {Number} id ID del nuevo producto creado
 * @apiError (400) CamposInvalidos Campos requeridos o formato inválido
 * @apiError (401) NoAutorizado Token inválido o no autorizado
 * @apiError (500) ErrorInterno Error al crear el producto
 */
router.post('/api/products', upload.array('imagenes'), verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    let producto = req.body;

    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'No se han subido imágenes' });
    }

    // Subir imágenes a Cloudinary
    const imagenesUrls = await Promise.all(
        (req.files as Express.Multer.File[]).map((file) => subirImagen(file))
    );

    // Parsear categorías si vienen como string
    if (typeof producto.categorias === 'string') {
        try {
            producto.categorias = JSON.parse(producto.categorias);
        } catch (e) {
            return res.status(400).json({ error: 'El campo categorias debe ser un array JSON válido' });
        }
    }

    if (!Array.isArray(producto.categorias)) {
        return res.status(400).json({ error: 'El campo categorias debe ser un array' });
    }

    const productoConImagenes = {
        ...producto,
        imagenes: imagenesUrls,
    };

    // Validar producto
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

/**
 * @api {put} /api/products/:id Actualizar un producto existente
 * @apiName ActualizarProducto
 * @apiGroup Productos
 * @apiPermission administrador
 * @apiHeader {String} Authorization Token de autenticación Bearer
 * @apiParam {Number} id ID del producto a actualizar
 * @apiParam {String} nombre Nombre actualizado del producto
 * @apiParam {Number} stock Stock actualizado
 * @apiParam {Number} precio Precio actualizado
 * @apiParam {Array} categorias Categorías actualizadas
 * @apiParam {File[]} [imagenes] Nuevas imágenes para añadir
 * @apiSuccess {String} message Mensaje de éxito
 * @apiError (400) CamposInvalidos Datos inválidos o incompletos
 * @apiError (401) NoAutorizado Token inválido o sin permisos
 * @apiError (404) NoEncontrado Producto no encontrado
 * @apiError (500) ErrorInterno Error al actualizar el producto
 */
router.put('/api/products/:id', verificarToken, verificarAdmin, upload.array('imagenes'), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    let producto = req.body;

    // Validar campos
    const error = validarProducto(producto);
    if (error) return res.status(400).json({ message: error });

    // Subir imágenes nuevas si hay
    let nuevasImagenesUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        try {
            nuevasImagenesUrls = await Promise.all(
                (req.files as Express.Multer.File[]).map(file => subirImagen(file))
            );
        } catch (err) {
            return res.status(500).json({ message: 'Error al subir las imágenes nuevas', error: (err as Error).message });
        }
    }

    try {
        // Obtener producto actual
        const productoActual = await obtenerProductoPorId(id);
        if (!productoActual) return res.status(404).json({ message: 'Producto no encontrado' });

        let imagenesActuales: string[] = [];
        try {
            imagenesActuales = JSON.parse(productoActual.imagenes);
        } catch {
            imagenesActuales = [];
        }

        // Añadir nuevas imágenes a las existentes
        const imagenesFinales = [...imagenesActuales, ...nuevasImagenesUrls];
        producto.imagenes = imagenesFinales;

        // Actualizar en BD
        const result = await actualizarProducto(id, producto);

        if (result && result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado con imágenes nuevas' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
    }
});

/**
 * @api {delete} /api/products/:id Eliminar un producto
 * @apiName EliminarProducto
 * @apiGroup Productos
 * @apiPermission administrador
 * @apiHeader {String} Authorization Token de autenticación Bearer
 * @apiParam {Number} id ID del producto a eliminar
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiError (401) NoAutorizado Token inválido o sin permisos
 * @apiError (404) NoEncontrado Producto no encontrado
 * @apiError (500) ErrorInterno Error al eliminar el producto
 */
router.delete('/api/products/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarProducto(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message });
    }
});

export default router;

/**
 * Función para validar campos esenciales del producto
 * @param producto Objeto producto a validar
 * @returns {string|null} Mensaje de error si hay, o null si pasa la validación
 */
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
    return null;
};

/**
 * Función para subir una imagen a Cloudinary
 * @param imagen Archivo multer con la imagen a subir
 * @returns {Promise<string>} URL segura de la imagen subida
 */
const subirImagen = (imagen: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagen.path, (error, result) => {
            fs.unlinkSync(imagen.path); // elimina el archivo local temporal
            if (error || !result) {
                return reject(error || new Error('No se pudo subir la imagen'));
            }
            resolve(result.secure_url);
        });
    });
};
