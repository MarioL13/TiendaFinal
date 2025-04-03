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
const router = (0, express_1.Router)();
router.get('/api/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, productosServices_1.obtenerProductos)();
        res.json(products);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener los productos', error: err.message });
    }
}));
router.get('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const producto = yield (0, productosServices_1.obtenerProductoPorId)(id);
        if (producto) {
            res.json(producto);
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener el producto', error: err.message });
    }
}));
router.post('/api/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const producto = req.body;
    try {
        const result = yield (0, productosServices_1.crearProducto)(producto);
        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message });
    }
}));
router.put('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const producto = req.body;
    try {
        const result = yield (0, productosServices_1.actualizarProducto)(id, producto);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado correctamente', id: result.insertId });
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message });
    }
}));
router.delete('/api/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield (0, productosServices_1.eliminarProducto)(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto eliminado' });
        }
        else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message });
    }
}));
exports.default = router;
