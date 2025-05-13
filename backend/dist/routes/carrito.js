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
const carritoServices_1 = require("../services/carritoServices");
const router = (0, express_1.Router)();
// Obtener el carrito de un usuario
router.get('/api/carrito/:id_usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_usuario = parseInt(req.params.id_usuario);
    try {
        const carrito = yield (0, carritoServices_1.obtenerCarritoCompletoUsuario)(id_usuario);
        res.json(carrito);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el carrito', error: err.message });
    }
}));
// Añadir al carrito
router.post('/api/carrito', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario, tipo_item, id_item, cantidad } = req.body;
    try {
        const existe = yield (0, carritoServices_1.existeItem)(tipo_item, id_item);
        if (!existe) {
            return res.status(400).json({ message: `${tipo_item} no encontrado` });
        }
        if (cantidad <= 0) {
            return res.status(400).json({ message: 'Cantidad inválida' });
        }
        const result = yield (0, carritoServices_1.agregarAlCarrito)(id_usuario, tipo_item, id_item, cantidad);
        res.status(201).json({ message: 'Ítem añadido en el carrito' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al añadir al carrito', error: err.message });
    }
}));
// Actualizar cantidad de un ítem
router.put('/api/carrito/:id_carrito', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_carrito = parseInt(req.params.id_carrito);
    const { cantidad } = req.body;
    try {
        const result = yield (0, carritoServices_1.actualizarCantidadCarrito)(id_carrito, cantidad);
        if (result.affectedRows > 0) {
            res.json({ message: 'Cantidad actualizada' });
        }
        else {
            res.status(404).json({ message: 'Ítem no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la cantidad', error: err.message });
    }
}));
// Eliminar ítem del carrito
router.delete('/api/carrito/:id_carrito', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_carrito = parseInt(req.params.id_carrito);
    try {
        const result = yield (0, carritoServices_1.eliminarItemCarrito)(id_carrito);
        if (result.affectedRows > 0) {
            res.json({ message: 'Ítem eliminado del carrito' });
        }
        else {
            res.status(404).json({ message: 'Ítem no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el ítem', error: err.message });
    }
}));
// Vaciar carrito (opcional)
router.delete('/api/carrito/usuario/:id_usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_usuario = parseInt(req.params.id_usuario);
    try {
        yield (0, carritoServices_1.vaciarCarrito)(id_usuario);
        res.json({ message: 'Carrito vaciado' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al vaciar el carrito', error: err.message });
    }
}));
exports.default = router;
