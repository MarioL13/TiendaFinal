"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const productosServices_1 = require("../services/productosServices");
// Se crea una instancia del enrutador de Express
const router = (0, express_1.Router)();
// Ruta para obtener todos los productos
router.get('/api/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, productosServices_1.obtenerProductos)(); // Llama a la función que obtiene los productos
        res.json(products); // Devuelve los productos en formato JSON
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
}));
// Ruta para obtener todos los productos destacados
router.get('/api/products/destacados', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield (0, productosServices_1.obtenerDestacados)();
        res.json(productos);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
}));
// Ruta para obtener un producto por su ID
router.get('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el parámetro ID a número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }
    try {
        const producto = yield (0, productosServices_1.obtenerProductoPorId)(id);
        if (producto) {
            res.json(Object.assign(Object.assign({}, producto), { imagenes: JSON.parse(producto.imagenes) }));
        }
        else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    }
    catch (err) {
        console.error('Error al obtener el producto:', err.message);
        res.status(500).json({ message: 'Error al obtener el producto', error: err.message });
    }
}));
// Ruta para crear un nuevo producto
router.post('/api/products', upload.array('imagenes'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let producto = req.body; // Obtiene los datos del producto
    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'No se han subido imágenes' });
    }
    // Subir imágenes a Cloudinary o similar
    const imagenesUrls = yield Promise.all(req.files.map((file) => subirImagen(file)));
    // Aquí parseamos el campo categorias si viene como string (form-data)
    if (typeof producto.categorias === 'string') {
        try {
            producto.categorias = JSON.parse(producto.categorias);
        }
        catch (e) {
            return res.status(400).json({ error: 'El campo categorias debe ser un array JSON válido' });
        }
    }
    // Aseguramos que categorias es un array
    if (!Array.isArray(producto.categorias)) {
        return res.status(400).json({ error: 'El campo categorias debe ser un array' });
    }
    const productoConImagenes = Object.assign(Object.assign({}, producto), { imagenes: imagenesUrls });
    // Validación de los campos (puede usar la que ya tienes)
    const error = validarProducto(productoConImagenes);
    if (error) {
        return res.status(400).json({ message: error });
    }
    try {
        const result = yield (0, productosServices_1.crearProducto)(productoConImagenes);
        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message });
    }
}));
// Ruta para actualizar un producto existente por su ID
router.put('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const producto = req.body;
    // Validación de los campos
    const error = validarProducto(producto);
    if (error) {
        return res.status(400).json({ message: error });
    }
    try {
        const result = yield (0, productosServices_1.actualizarProducto)(id, producto);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado' });
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
    }
}));
// Ruta para eliminar un producto por su ID
router.delete('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el ID de la URL a número
    try {
        const result = yield (0, productosServices_1.eliminarProducto)(id); // Llama a la función para eliminar el producto
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto eliminado' }); // Confirma la eliminación
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra, devuelve un error 404
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message });
    }
}));
// Exporta el enrutador para ser utilizado en la aplicación principal
exports.default = router;
// Función de validación para productos
const validarProducto = (producto) => {
    if (!producto.nombre || typeof producto.nombre !== 'string') {
        return 'El nombre del producto es obligatorio y debe ser un texto';
    }
    if (producto.stock === undefined || isNaN(producto.stock) || producto.stock < 0) {
        return 'El stock debe ser un número mayor o igual a 0';
    }
    if (producto.precio === undefined || isNaN(producto.precio) || producto.precio < 0) {
        return 'El precio debe ser un número mayor o igual a 0';
    }
    return null; // Si pasa todas las validaciones
};
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const subirImagen = (imagen) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(imagen.path, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('No se pudo subir la imagen'));
            }
            resolve(result.secure_url); // Devuelve el enlace seguro de la imagen
        });
    });
};
