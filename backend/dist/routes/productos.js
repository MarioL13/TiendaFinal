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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
// Ruta para obtener un producto por su ID
router.get('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el parámetro ID a número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }
    try {
        const producto = yield (0, productosServices_1.obtenerProductoPorId)(id); // Busca el producto en la base de datos
        console.log('Producto qwrqr:', producto); // Muestra el producto en la consola
        if (producto) {
            console.log("hola");
            let imagenBase64 = null;
            if (producto.imagen) {
                imagenBase64 = producto.imagen.toString('base64');
            }
            res.json(Object.assign(Object.assign({}, producto), { imagen: imagenBase64 ? `data:image/jpeg;base64,${imagenBase64}` : null }));
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
router.post('/api/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const producto = req.body; // Obtiene los datos del producto desde el cuerpo de la solicitud
    try {
        const result = yield (0, productosServices_1.crearProducto)(producto); // Llama a la función para crear el producto
        res.status(201).json({ message: 'Producto creado', id: result.insertId }); // Devuelve el ID del producto creado
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message });
    }
}));
// Ruta para actualizar un producto existente por su ID
router.put('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el ID de la URL a número
    const producto = req.body; // Obtiene los nuevos datos del producto
    try {
        const result = yield (0, productosServices_1.actualizarProducto)(id, producto); // Llama a la función para actualizar el producto
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado correctamente', id: result.insertId });
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra, devuelve un error 404
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el producto', error: err.message });
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
