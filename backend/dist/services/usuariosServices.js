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
exports.obtenerUsuarioPorEmail = exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuarioPorId = exports.obtenerUsuarios = void 0;
const db_1 = __importDefault(require("./db")); // Importa la conexión a la base de datos
// Obtener todos los usuarios
const obtenerUsuarios = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM usuarios', (err, results) => {
            if (err) {
                reject(new Error('Error al obtener los usuarios: ' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.obtenerUsuarios = obtenerUsuarios;
// Obtener un usuario por ID
const obtenerUsuarioPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err, results, fields) => {
            if (err) {
                reject(new Error('Error al obtener el usuario: ' + err.message));
            }
            else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
});
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
// Crear un nuevo usuario
const crearUsuario = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre, FOTO, email, password, direccion, telefono } = usuario;
    if (!FOTO || FOTO === '' || typeof FOTO !== 'object') {
        FOTO = null;
    }
    return new Promise((resolve, reject) => {
        db_1.default.query('INSERT INTO usuarios (nombre, FOTO, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)', [nombre, FOTO, email, password, direccion, telefono], (err, results) => {
            if (err) {
                reject(new Error('Error al crear el usuario: ' + err.message));
            }
            else {
                resolve(results);
            }
        });
    });
});
exports.crearUsuario = crearUsuario;
// Actualizar un usuario
const actualizarUsuario = (id, usuario) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Obtener el usuario actual
            const usuarioActual = yield (0, exports.obtenerUsuarioPorId)(id);
            if (!usuarioActual) {
                return reject(new Error('Usuario no encontrado'));
            }
            // Mezclar datos: lo que envía el usuario reemplaza lo que ya existía
            const usuarioActualizado = Object.assign(Object.assign({}, usuarioActual), usuario);
            db_1.default.query('UPDATE usuarios SET nombre = ?, FOTO = ?, email = ?, password = ?, direccion = ?, telefono = ? WHERE id_usuario = ?', [
                usuarioActualizado.nombre,
                usuarioActualizado.FOTO,
                usuarioActualizado.email,
                usuarioActualizado.password,
                usuarioActualizado.direccion,
                usuarioActualizado.telefono,
                id,
            ], (err, results) => {
                if (err) {
                    reject(new Error('Error al actualizar el usuario: ' + err.message));
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
exports.actualizarUsuario = actualizarUsuario;
// Eliminar un usuario
const eliminarUsuario = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Verificar si el usuario existe antes de eliminarlo
            const usuario = yield (0, exports.obtenerUsuarioPorId)(id);
            if (!usuario) {
                return reject(new Error('Usuario no encontrado'));
            }
            db_1.default.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
                if (err) {
                    reject(new Error('Error al eliminar el usuario: ' + err.message));
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
exports.eliminarUsuario = eliminarUsuario;
const obtenerUsuarioPorEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
            if (err) {
                reject(new Error('Error al buscar el usuario: ' + err.message));
            }
            else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
});
exports.obtenerUsuarioPorEmail = obtenerUsuarioPorEmail;
