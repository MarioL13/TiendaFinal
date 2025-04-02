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
router.get('/api/categorias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield (0, categoriasServices_1.obtenerCategorias)();
        res.json(categorias);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener las categorias', error: err.message });
    }
}));
router.get('/api/categorias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const categoria = yield (0, categoriasServices_1.obtenerCategoriaPorId)(id);
        if (categoria) {
            res.json(categoria);
        }
        else {
            res.status(404).json({ message: 'No se encontrado' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener las categorias', error: err.message });
    }
}));
router.post('/api/categorias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoria = req.body;
    try {
        const result = yield (0, categoriasServices_1.crearCategoria)(categoria);
        res.status(201).json({ message: 'Categoria creada', id: result.insertId });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener las categorias', error: err.message });
    }
}));
router.put('/api/categorias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const categoria = req.body;
    try {
        const result = yield (0, categoriasServices_1.actualizarCategoria)(id, categoria);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Categoria actualizado', id: result.insertId });
        }
        else {
            res.status(404).json({ message: 'No se encontrado' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener la categorias', error: err.message });
    }
}));
router.delete('/api/categorias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield (0, categoriasServices_1.eliminarCategoria)(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Categoria Eliminada' });
        }
        else {
            res.status(404).json({ message: 'No se encontrado' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener la categorias', error: err.message });
    }
}));
exports.default = router;
