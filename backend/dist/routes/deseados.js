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
const deseadosServices_1 = require("../services/deseadosServices");
const router = (0, express_1.Router)();
router.get('/api/wishlist/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const deseados = yield (0, deseadosServices_1.obtenerDeseados)(id);
        if (deseados) {
            res.json(deseados);
        }
        else {
            res.status(404).json({ message: 'No hay lista aun' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener la lista', error: err.message });
    }
}));
router.post('/api/wishlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deseado = req.body;
    if (!deseado.id_usuario || typeof deseado.id_usuario !== 'number') {
        return res.status(400).json({ message: 'El id_usuario es obligatorio y debe ser un número.' });
    }
    if ((deseado.id_producto && typeof deseado.id_producto !== 'number') ||
        (deseado.id_carta && typeof deseado.id_carta !== 'number')) {
        return res.status(400).json({ message: 'id_producto o id_carta deben ser números.' });
    }
    const yaExiste = yield (0, deseadosServices_1.existeDeseado)(deseado.id_usuario, deseado.id_producto, deseado.id_carta);
    if (yaExiste) {
        return res.status(409).json({ message: 'Este producto ya está en la lista de deseos.' });
    }
    if ((!deseado.id_producto && !deseado.id_carta) || (deseado.id_producto && deseado.id_carta)) {
        return res.status(400).json({ message: 'Debes enviar solo id_producto o id_carta, no ambos ni ninguno.' });
    }
    try {
        const result = yield (0, deseadosServices_1.agregarProducto)(deseado);
        res.status(201).json({ message: 'Producto Agregado', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar el producto', error: err.message });
    }
}));
router.delete('/api/wishlist/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield (0, deseadosServices_1.eliminarDeseado)(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Producto eliminado' });
        }
        else {
            res.status(404).json({ message: 'Deseado no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el deseado', error: err.message });
    }
}));
exports.default = router;
