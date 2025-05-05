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
const cartasServices_1 = require("../services/cartasServices");
const router = (0, express_1.Router)();
router.get('/api/cartas', (Request, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartas = yield (0, cartasServices_1.obtenerCartas)();
        res.json(cartas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las cartas', error: err.message });
    }
}));
router.get('/api/cartas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const carta = yield (0, cartasServices_1.obtenerCartaPorId)(id);
        if (carta) {
            res.json(carta);
        }
        else {
            res.status(404).json({ message: 'Carta no encontrada' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la carta', error: err.message });
    }
}));
router.post('/api/cartas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carta = req.body;
    try {
        const result = yield (0, cartasServices_1.crearCarta)(carta);
        res.status(201).json({ message: 'Carta creada', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear carta', error: err.message });
    }
}));
router.put('/api/cartas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const carta = req.body;
    try {
        const result = yield (0, cartasServices_1.actualizarCarta)(id, carta);
        if (result.affectedRows > 0) {
            res.json({ message: 'Carta actualizada' });
        }
        else {
            res.status(404).json({ message: 'Carta no encontrada' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar carta', error: err.message });
    }
}));
router.delete('/api/cartas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield (0, cartasServices_1.eliminarCarta)(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Carta eliminada' });
        }
        else {
            res.status(404).json({ message: 'Carta no encontrada' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar la carta', error: err.message });
    }
}));
exports.default = router;
