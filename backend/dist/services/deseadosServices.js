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
exports.eliminarDeseado = exports.agregarProducto = exports.obtenerDeseados = void 0;
const db_1 = __importDefault(require("./db"));
const obtenerDeseados = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM deseados WHERE id_usuario = ?', [id], (err, results, fields) => {
            if (err) {
                reject(new Error('Error al obtener la lista' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.obtenerDeseados = obtenerDeseados;
const agregarProducto = (deseado) => __awaiter(void 0, void 0, void 0, function* () {
    let { id_carta, id_producto, id_usuario } = deseado;
    return new Promise((resolve, reject) => {
        db_1.default.query('INSERT INTO deseados (id_carta, id_producto, id_usuario) VALUES (?, ?, ?)', [id_carta, id_producto, id_usuario], (err, results) => {
            if (err) {
                reject(new Error('Error al crear el deseado' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.agregarProducto = agregarProducto;
const eliminarDeseado = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('DELETE FROM deseados WHERE id_deseado = ?', [id], (err, results) => {
            if (err) {
                reject(new Error('Error al eliminar el deseado: ' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.eliminarDeseado = eliminarDeseado;
