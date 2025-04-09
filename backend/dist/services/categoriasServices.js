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
exports.obtenerIdCategoria = exports.eliminarCategoria = exports.actualizarCategoria = exports.crearCategoria = exports.obtenerCategoriaPorId = exports.obtenerCategorias = void 0;
const db_1 = __importDefault(require("./db"));
// Obtiene todas las categorías de la base de datos
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
// Obtiene una categoría por su ID
const obtenerCategoriaPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM categorias WHERE id_categoria = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results[0]); // Devuelve la primera categoría encontrada o undefined
            }
        });
    });
});
exports.obtenerCategoriaPorId = obtenerCategoriaPorId;
// Crea una nueva categoría
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
// Actualiza una categoría existente
const actualizarCategoria = (id, categoria) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Obtiene la categoría actual antes de actualizarla
            const categoriaActual = yield (0, exports.obtenerCategoriaPorId)(id);
            if (!categoriaActual) {
                return reject(new Error('Categoría no encontrada'));
            }
            // Fusiona los datos actuales con los nuevos valores
            const categoriaActualizada = Object.assign(Object.assign({}, categoriaActual), categoria);
            db_1.default.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?', [categoriaActualizada.nombre, categoriaActualizada.descripcion, id], (err, results) => {
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
// Elimina una categoría por su ID
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
// Obtiene el ID de una categoría por su nombre
const obtenerIdCategoria = (nombreCategoria) => {
    console.log(nombreCategoria);
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT id_categoria FROM categorias WHERE nombre = ?', [nombreCategoria], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return reject(new Error('Categoría no encontrada'));
            }
            resolve(results[0].id_categoria);
        });
    });
};
exports.obtenerIdCategoria = obtenerIdCategoria;
