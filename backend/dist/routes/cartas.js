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
exports.default = router;
