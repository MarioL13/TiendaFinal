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
    var _a, _b;
    const { nombre, set_code, stock, precio } = req.body;
    if (!nombre || !set_code || stock === undefined || precio === undefined) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, set_code, stock, precio' });
    }
    try {
        const scryfallUrl = `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(nombre)}"+set:${set_code}`;
        const response = yield fetch(scryfallUrl);
        const data = yield response.json();
        const carta = (_a = data.data) === null || _a === void 0 ? void 0 : _a[0];
        if (!carta) {
            return res.status(404).json({ message: `Carta "${nombre}" no encontrada en el set ${set_code}` });
        }
        const cartaNueva = {
            nombre: carta.name,
            stock,
            precio,
            scryfall_id: carta.id,
            set_code: carta.set,
            collector_number: carta.collector_number,
            imagen: ((_b = carta.image_uris) === null || _b === void 0 ? void 0 : _b.normal) || ''
        };
        const resultado = yield (0, cartasServices_1.crearCarta)(cartaNueva);
        res.status(201).json({ message: 'Carta creada desde Scryfall', id: resultado.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear carta', error: err.message });
    }
}));
router.post('/api/cartas/lote', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const cartas = req.body;
    if (!Array.isArray(cartas) || cartas.length === 0) {
        return res.status(400).json({ message: 'Debes enviar un array de cartas' });
    }
    const resultados = [];
    const errores = [];
    for (const carta of cartas) {
        const { nombre, set_code, stock, precio } = carta;
        if (!nombre || !set_code || stock === undefined || precio === undefined) {
            errores.push({ nombre, set_code, error: 'Faltan campos obligatorios' });
            continue;
        }
        try {
            const url = `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(nombre)}"+set:${set_code}`;
            const response = yield fetch(url);
            const data = yield response.json();
            const resultado = (_c = data.data) === null || _c === void 0 ? void 0 : _c[0];
            if (!resultado) {
                errores.push({ nombre, set_code, error: 'Carta no encontrada en Scryfall' });
                continue;
            }
            const cartaNueva = {
                nombre: resultado.name,
                stock,
                precio,
                scryfall_id: resultado.id,
                set_code: resultado.set,
                collector_number: resultado.collector_number
            };
            const insert = yield (0, cartasServices_1.crearCarta)(cartaNueva);
            resultados.push({ nombre, id: insert.insertId });
        }
        catch (err) {
            errores.push({ nombre, set_code, error: err.message });
        }
    }
    res.status(201).json({
        message: 'Proceso de inserción finalizado',
        creadas: resultados,
        errores
    });
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
