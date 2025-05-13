"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existeItem = exports.vaciarCarrito = exports.eliminarItemCarrito = exports.actualizarCantidadCarrito = exports.agregarAlCarrito = exports.obtenerCarritoCompletoUsuario = void 0;
const db_1 = __importDefault(require("./db")); // Importa la conexión a la base de datos
const obtenerCarritoCompletoUsuario = (id_usuario) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT c.id_carrito, c.tipo_item, c.id_item, c.cantidad,
                   CASE
                       WHEN c.tipo_item = 'producto' THEN p.nombre
                       ELSE ca.nombre
                   END AS nombre,
                   CASE
                       WHEN c.tipo_item = 'producto' THEN p.precio
                       ELSE ca.precio
                   END AS precio
            FROM Carrito c
            LEFT JOIN Productos p ON c.tipo_item = 'producto' AND c.id_item = p.id_producto
            LEFT JOIN Cartas ca ON c.tipo_item = 'carta' AND c.id_item = ca.id_cartas
            WHERE c.id_usuario = ?
        `;
        db_1.default.query(query, [id_usuario], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.obtenerCarritoCompletoUsuario = obtenerCarritoCompletoUsuario;
const agregarAlCarrito = (id_usuario, tipo_item, id_item, cantidad) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO Carrito (id_usuario, tipo_item, id_item, cantidad)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
        `;
        db_1.default.query(query, [id_usuario, tipo_item, id_item, cantidad], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.agregarAlCarrito = agregarAlCarrito;
const actualizarCantidadCarrito = (id_carrito, cantidad) => {
    return new Promise((resolve, reject) => {
        db_1.default.query(`UPDATE carrito SET cantidad = ? WHERE id_carrito = ?`, [cantidad, id_carrito], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.actualizarCantidadCarrito = actualizarCantidadCarrito;
const eliminarItemCarrito = (id_carrito) => {
    return new Promise((resolve, reject) => {
        db_1.default.query(`DELETE FROM carrito WHERE id_carrito = ?`, [id_carrito], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.eliminarItemCarrito = eliminarItemCarrito;
const vaciarCarrito = (id_usuario) => {
    return new Promise((resolve, reject) => {
        db_1.default.query(`DELETE FROM carrito WHERE id_usuario = ?`, [id_usuario], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.vaciarCarrito = vaciarCarrito;
const existeItem = (tipo_item, id_item) => {
    const tabla = tipo_item === 'producto' ? 'Productos' : 'Cartas';
    const campo = tipo_item === 'producto' ? 'id_producto' : 'id_cartas';
    return new Promise((resolve, reject) => {
        db_1.default.query(`SELECT COUNT(*) as total FROM ${tabla} WHERE ${campo} = ?`, [id_item], (err, results) => {
            if (err)
                return reject(err);
            const rows = results;
            resolve(rows[0].total > 0);
        });
    });
};
exports.existeItem = existeItem;
