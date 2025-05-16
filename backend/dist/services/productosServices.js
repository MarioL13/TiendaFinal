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
exports.actualizarCategoriasProducto = exports.obtenerDestacados = exports.eliminarProducto = exports.actualizarProducto = exports.crearProducto = exports.obtenerProductoPorId = exports.obtenerProductos = void 0;
const db_1 = __importDefault(require("../services/db"));
const categoriasServices_1 = require("./categoriasServices");
// Función para obtener todos los productos de la base de datos
const obtenerProductos = () => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM productos', (err, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject(err);
            }
            else {
                const productosCategoria = [];
                for (let producto of results) {
                    try {
                        const categorias = yield new Promise((res, rej) => db_1.default.query('SELECT c.nombre FROM categorias c JOIN ProductoCategoria pc ON c.id_categoria = pc.id_categoria WHERE pc.id_producto = ?', [producto.id_producto], (err, categoriaResults) => {
                            if (err) {
                                rej(err); // <-- cuidado, aquí usabas reject del scope de fuera
                            }
                            else {
                                const nombres = [];
                                for (const c of categoriaResults) {
                                    nombres.push(c.nombre);
                                }
                                res(nombres);
                            }
                        }));
                        // Asignamos las categorías al producto
                        producto.categorias = categorias;
                        // Lo añadimos al array final
                        productosCategoria.push(producto);
                    }
                    catch (error) {
                        reject(error);
                        return;
                    }
                }
                resolve(productosCategoria);
            }
        }));
    });
};
exports.obtenerProductos = obtenerProductos;
// Función para obtener un producto por su ID y su categoría asociada
const obtenerProductoPorId = (id) => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM productos WHERE id_producto = ?', [id], (err, results, fields) => {
            if (err)
                return reject(new Error(`Error al consultar el producto: ${err.message}`));
            const producto = results[0];
            if (!producto)
                return resolve(null);
            // Obtener las categorías asociadas
            db_1.default.query(`SELECT c.nombre
                     FROM categorias c
                              INNER JOIN ProductoCategoria pc ON c.id_categoria = pc.id_categoria
                     WHERE pc.id_producto = ?`, [id], (err, categoriasResults, fields) => {
                if (err)
                    return reject(new Error(`Error al consultar las categorías: ${err.message}`));
                const categorias = [];
                for (const c of categoriasResults) {
                    categorias.push(c.nombre);
                }
                producto.categorias = categorias;
                resolve(producto);
            });
        });
    });
};
exports.obtenerProductoPorId = obtenerProductoPorId;
// Función para crear un nuevo producto en la base de datos
const crearProducto = (producto) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, descripcion, precio, stock, categorias, imagenes } = producto;
    try {
        return new Promise((resolve, reject) => {
            db_1.default.query('INSERT INTO productos (nombre, descripcion, precio, stock, imagenes) VALUES (?, ?, ?, ?, ?)', [nombre, descripcion, precio, stock, JSON.stringify(imagenes)], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    return reject(err);
                const id_producto = results.insertId;
                // Insertar categorías relacionadas
                for (const nombre_categoria of categorias) {
                    const id_categoria = yield (0, categoriasServices_1.obtenerIdCategoria)(nombre_categoria);
                    yield new Promise((resolve, reject) => {
                        db_1.default.query('INSERT INTO ProductoCategoria (id_producto, id_categoria) VALUES (?, ?)', [id_producto, id_categoria], (err) => err ? reject(err) : resolve(true));
                    });
                }
                resolve(results);
            }));
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.crearProducto = crearProducto;
// Función para actualizar un producto existente
const actualizarProducto = (id, nuevosDatos) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productoActual = yield (0, exports.obtenerProductoPorId)(id);
        if (!productoActual) {
            throw new Error('Producto no encontrado');
        }
        // Combinamos los datos antiguos con los nuevos
        const productoActualizado = Object.assign(Object.assign({}, productoActual), nuevosDatos);
        // Convertimos las imágenes a JSON string si es un array
        const imagenesJson = JSON.stringify(productoActualizado.imagenes || []);
        // Actualizamos el producto (sin id_categoria porque se gestiona en tabla intermedia)
        yield new Promise((resolve, reject) => {
            db_1.default.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagenes = ? WHERE id_producto = ?', [
                productoActualizado.nombre,
                productoActualizado.descripcion,
                productoActualizado.precio,
                productoActualizado.stock,
                imagenesJson,
                id
            ], (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
        // Actualizar categorías si vienen en la petición
        if (Array.isArray(nuevosDatos.categorias)) {
            yield (0, exports.actualizarCategoriasProducto)(id, nuevosDatos.categorias);
        }
        return { message: 'Producto actualizado correctamente' };
    }
    catch (error) {
        throw error;
    }
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
const obtenerDestacados = () => {
    return new Promise((resolve, reject) => {
        db_1.default.query(`SELECT p.*,
                    SUM(dp.cantidad) AS total_vendidos
             FROM detallepedido dp
                      JOIN productos p ON dp.id_item = p.id_producto
             WHERE dp.tipo_item = 'producto'
             GROUP BY dp.id_item
             ORDER BY total_vendidos DESC
                 LIMIT 4`, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                const productosTop = results.map((producto) => {
                    if (producto.imagen) {
                        producto.imagen = `data:image/jpeg;base64,${Buffer.from(producto.imagen).toString('base64')}`;
                    }
                    return producto;
                });
                resolve(productosTop);
            }
        });
    });
};
exports.obtenerDestacados = obtenerDestacados;
const actualizarCategoriasProducto = (id_producto, nuevasCategorias) => __awaiter(void 0, void 0, void 0, function* () {
    // Elimina las categorías actuales
    yield new Promise((resolve, reject) => {
        db_1.default.query('DELETE FROM ProductoCategoria WHERE id_producto = ?', [id_producto], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    });
    // Inserta las nuevas
    for (const id_categoria of nuevasCategorias) {
        yield new Promise((resolve, reject) => {
            db_1.default.query('INSERT INTO ProductoCategoria (id_producto, id_categoria) VALUES (?, ?)', [id_producto, id_categoria], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(null);
            });
        });
    }
});
exports.actualizarCategoriasProducto = actualizarCategoriasProducto;
