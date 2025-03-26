"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuarioPorId = exports.obtenerUsuarios = void 0;
const db_1 = __importDefault(require("./db")); // Importa la conexión a la base de datos
// Obtener todos los usuarios
const obtenerUsuarios = () => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM usuarios', (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.obtenerUsuarios = obtenerUsuarios;
// Obtener un usuario por ID
const obtenerUsuarioPorId = (id) => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db_1.default.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results[0]); // Solo un resultado
            }
        });
    });
};
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
// Crear un nuevo usuario
const crearUsuario = (usuario) => {
    const { nombre, FOTO, email, password, direccion, telefono } = usuario;
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db_1.default.query('INSERT INTO usuarios (nombre, FOTO, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)', [nombre, FOTO, email, password, direccion, telefono], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.crearUsuario = crearUsuario;
// Actualizar un usuario
const actualizarUsuario = (id, usuario) => {
    const { nombre, FOTO, email, password, direccion, telefono } = usuario;
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db_1.default.query('UPDATE usuarios SET nombre = ?, FOTO = ?, email = ?, password = ?, direccion = ?, telefono = ? WHERE id_usuario = ?', [nombre, FOTO, email, password, direccion, telefono, id], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.actualizarUsuario = actualizarUsuario;
// Eliminar un usuario
const eliminarUsuario = (id) => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db_1.default.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.eliminarUsuario = eliminarUsuario;
