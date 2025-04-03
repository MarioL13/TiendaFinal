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
exports.eliminarProducto = exports.actualizarProducto = exports.crearProducto = exports.obtenerProductoPorId = exports.obtenerProductos = void 0;
const db_1 = __importDefault(require("../services/db"));
const categoriasServices_1 = require("./categoriasServices");
const obtenerProductos = () => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM productos', (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.obtenerProductos = obtenerProductos;
const obtenerProductoPorId = (id) => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM productos WHERE id_producto = ?', [id], (err, results, fields) => {
            if (err) {
                reject(err);
            }
            else {
                const producto = results[0];
                if (producto) {
                    db_1.default.query('SELECT * FROM categorias WHERE id_categoria = ?', [producto.id_categoria], (err, categoriaResults, fields) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const categoria = categoriaResults[0];
                            if (categoria) {
                                producto.categoria = categoria;
                                resolve(producto);
                            }
                            else {
                                resolve(producto);
                            }
                        }
                    });
                }
                else {
                    resolve(null);
                }
            }
        });
    });
};
exports.obtenerProductoPorId = obtenerProductoPorId;
const crearProducto = (producto) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, descripcion, precio, stock, nombre_categoria, imagen } = producto;
    try {
        const id_categoria = yield (0, categoriasServices_1.obtenerIdCategoria)(nombre_categoria);
        return new Promise((resolve, reject) => {
            db_1.default.query('INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)', [nombre, descripcion, precio, stock, id_categoria, imagen], (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.crearProducto = crearProducto;
const actualizarProducto = (producto, producto1) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productoActual = yield (0, exports.obtenerProductoPorId)(producto);
            if (!productoActual) {
                return reject(new Error('Producto no encontrado'));
            }
            const productoActualizado = Object.assign(Object.assign({}, productoActual), producto);
            db_1.default.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, imagen = ? ', [
                productoActualizado.nombre,
                productoActualizado.precio,
                productoActualizado.descripcion,
                productoActualizado.stock,
                productoActualizado.imagen,
                productoActualizado.id_categoria,
                productoActualizado.imagen,
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
exports.actualizarProducto = actualizarProducto;
const eliminarProducto = (producto) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.query('DELETE FROM productos WHERE id_producto = ?', producto, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    }));
});
exports.eliminarProducto = eliminarProducto;
