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
// Función para obtener todos los productos de la base de datos
const obtenerProductos = () => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM productos', (err, results) => {
            if (err) {
                reject(err); // Rechaza la promesa en caso de error
            }
            else {
                resolve(results); // Devuelve los productos obtenidos
            }
        });
    });
};
exports.obtenerProductos = obtenerProductos;
// Función para obtener un producto por su ID y su categoría asociada
const obtenerProductoPorId = (id) => {
    return new Promise((resolve, reject) => {
        // Consulta principal: buscar el producto
        console.log('ID de producto:', id); // Muestra el ID del producto en la consola
        db_1.default.query('SELECT * FROM productos WHERE id_producto = ?', [id], (err, results, fields) => {
            if (err) {
                return reject(new Error(`Error al consultar el producto: ${err.message}`));
            }
            const producto = results[0]; // Obtiene el primer resultado
            console.log('ProductoPoke:', producto); // Muestra el producto en la consola
            if (!producto) {
                console.log('Producto no encontrado'); // Mensaje de error
                return resolve(null); // Producto no encontrado
            }
            // Si el producto existe, buscar la categoría asociada
            db_1.default.query('SELECT * FROM categorias WHERE id_categoria = ?', [producto.id_categoria], (err, categoriaResults, fields) => {
                if (err) {
                    return reject(new Error(`Error al consultar la categoría: ${err.message}`));
                }
                const categoria = categoriaResults[0]; // Primera categoría encontrada
                if (categoria) {
                    producto.categoria = categoria; // Agrega la categoría al producto
                }
                resolve(producto); // Devuelve el producto con la categoría asociada
            });
        });
    });
};
exports.obtenerProductoPorId = obtenerProductoPorId;
// Función para crear un nuevo producto en la base de datos
const crearProducto = (producto) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, descripcion, precio, stock, nombre_categoria, imagen } = producto;
    try {
        // Obtiene el ID de la categoría basada en su nombre
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
// Función para actualizar un producto existente
const actualizarProducto = (producto, producto1) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Obtiene el producto actual antes de actualizarlo
            const productoActual = yield (0, exports.obtenerProductoPorId)(producto);
            if (!productoActual) {
                return reject(new Error('Producto no encontrado'));
            }
            // Combina los datos actuales con los nuevos valores
            const productoActualizado = Object.assign(Object.assign({}, productoActual), producto);
            db_1.default.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, imagen = ? WHERE id_producto = ?', [
                productoActualizado.nombre,
                productoActualizado.descripcion,
                productoActualizado.precio,
                productoActualizado.stock,
                productoActualizado.id_categoria,
                productoActualizado.imagen,
                productoActualizado.id_producto // Se agrega el ID del producto en la consulta
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
// Función para eliminar un producto por su ID
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
