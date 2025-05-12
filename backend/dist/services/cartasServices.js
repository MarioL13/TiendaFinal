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
exports.eliminarCarta = exports.actualizarCarta = exports.crearCarta = exports.obtenerCartaPorId = exports.obtenerCartas = void 0;
const db_1 = __importDefault(require("./db")); // Importa la conexión a la base de datos
const obtenerCartas = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM cartas', (err, results) => {
            if (err) {
                reject(new Error('Error al obtener las cartas: ' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.obtenerCartas = obtenerCartas;
const obtenerCartaPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM cartas WHERE id_carta= =', [id], (err, results) => {
            if (err) {
                reject(new Error('Error al obtener la carta: ' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.obtenerCartaPorId = obtenerCartaPorId;
const crearCarta = (carta) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, stock, precio, scryfall_id, set_code, collector_number } = carta;
    return new Promise((resolve, reject) => {
        db_1.default.query(`INSERT INTO cartas (nombre, stock, precio, scryfall_id, set_code, collector_number)
             VALUES (?, ?, ?, ?, ?, ?)`, [nombre, stock, precio, scryfall_id, set_code, collector_number], (err, results) => {
            if (err) {
                reject(new Error('Error al crear la carta: ' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.crearCarta = crearCarta;
const actualizarCarta = (id, carta) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartaActual = yield (0, exports.obtenerCartaPorId)(id);
            if (!cartaActual) {
                return reject(new Error('Carta no encontrada'));
            }
            const cartaActualizado = Object.assign(Object.assign({}, cartaActual), carta);
            db_1.default.query('UPDATE cartas SET nombre = ?, stock = ?, precio = ? WHERE id_carta = ?', [
                cartaActualizado.nombre,
                cartaActualizado.stock,
                cartaActualizado.precio,
                id
            ], (err, results) => {
                if (err) {
                    reject(new Error('Error al actualizar la carta: ' + err.message));
                }
                else {
                    resolve(results);
                }
            });
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.actualizarCarta = actualizarCarta;
const eliminarCarta = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const carta = yield (0, exports.obtenerCartaPorId)(id);
            if (!carta) {
                return reject(new Error('Carta no encontrada'));
            }
            db_1.default.query('DELETE FROM cartas WHERE id_carta = ?', [id], (err, results) => {
                if (err) {
                    reject(new Error('Error al eliminar la carta: ' + err.message));
                }
                else {
                    resolve(results);
                }
            });
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.eliminarCarta = eliminarCarta;
