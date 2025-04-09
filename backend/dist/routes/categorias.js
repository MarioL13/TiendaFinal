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
const categoriasServices_1 = require("../services/categoriasServices");
const router = (0, express_1.Router)();
// Obtener todas las categorías
router.get('/api/categorias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield (0, categoriasServices_1.obtenerCategorias)();
        res.json(categorias);
    }
    catch (err) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).json({ message: 'Error al obtener las categorías', error: err.message });
    }
}));
// Obtener una categoría por ID
router.get('/api/categorias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const categoria = yield (0, categoriasServices_1.obtenerCategoriaPorId)(id);
        if (categoria) {
            res.json(categoria);
        }
        else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    }
    catch (err) {
        console.error(`Error al obtener la categoría con ID ${id}:`, err);
        res.status(500).json({ message: 'Error al obtener la categoría', error: err.message });
    }
}));
// Crear una nueva categoría
router.post('/api/categorias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoria = req.body;
    try {
        const result = yield (0, categoriasServices_1.crearCategoria)(categoria);
        res.status(201).json({ message: 'Categoría creada', id: result.insertId });
    }
    catch (err) {
        console.error('Error al crear la categoría:', err);
        res.status(500).json({ message: 'Error al crear la categoría', error: err.message });
    }
}));
// Actualizar una categoría
router.put('/api/categorias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const categoria = req.body;
    try {
        const result = yield (0, categoriasServices_1.actualizarCategoria)(id, categoria);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Categoría actualizada' });
        }
        else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    }
    catch (err) {
        console.error(`Error al actualizar la categoría con ID ${id}:`, err);
        res.status(500).json({ message: 'Error al actualizar la categoría', error: err.message });
    }
}));
// Eliminar una categoría
router.delete('/api/categorias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield (0, categoriasServices_1.eliminarCategoria)(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Categoría eliminada' });
        }
        else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    }
    catch (err) {
        console.error(`Error al eliminar la categoría con ID ${id}:`, err);
        res.status(500).json({ message: 'Error al eliminar la categoría', error: err.message });
    }
}));
exports.default = router;
