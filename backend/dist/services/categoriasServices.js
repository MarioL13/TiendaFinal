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
exports.eliminarCategoria = exports.actualizarCategoria = exports.crearCategoria = exports.obtenerCategoriaPorId = exports.obtenerCategorias = void 0;
const db_1 = __importDefault(require("./db"));
const obtenerCategorias = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM categorias', (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.obtenerCategorias = obtenerCategorias;
const obtenerCategoriaPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM categorias WHERE id_categoria = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results[0]);
            }
        });
    });
});
exports.obtenerCategoriaPorId = obtenerCategoriaPorId;
const crearCategoria = (categoria) => {
    const { nombre, descripcion } = categoria;
    return new Promise((resolve, reject) => {
        db_1.default.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.crearCategoria = crearCategoria;
const actualizarCategoria = (id, categoria) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoriaActual = yield (0, exports.obtenerCategoriaPorId)(id);
            if (!categoriaActual) {
                return reject(new Error('Categoria no encontrado'));
            }
            const categoriaActualizada = Object.assign(Object.assign({}, categoriaActual), categoria);
            db_1.default.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?', [
                categoriaActualizada.nombre,
                categoriaActualizada.descripcion,
                id,
            ], (err, results) => {
                if (err) {
                    reject(err);
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
exports.actualizarCategoria = actualizarCategoria;
const eliminarCategoria = (id) => {
    return new Promise((resolve, reject) => {
        db_1.default.query('DELETE FROM categorias WHERE id_categoria = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.eliminarCategoria = eliminarCategoria;
