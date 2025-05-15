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
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
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
const validarUsuario = (usuario) => {
    const { nombre, email, password, telefono } = usuario;
    if (!nombre || nombre.trim().length < 2) {
        return 'Nombre inválido.';
    }
    if (!email || !validator_1.default.isEmail(email)) {
        return 'Email inválido.';
    }
    if (!password || !validarPassword(password)) {
        return 'La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula, un número y un símbolo.';
    }
    if (telefono && !validator_1.default.isMobilePhone(telefono, 'es-ES')) {
        return 'Teléfono inválido.';
    }
    return null; // Si
};
// Función para validar la contraseña (8 caracteres, al menos una mayúscula, un número y un símbolo)
const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};
// Crear un nuevo usuario
const crearUsuario = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre, FOTO, email, password, direccion, telefono } = usuario;
    const error = validarUsuario(usuario); // Validamos los datos
    if (error)
        throw new Error(error); // Si hay error, lanzamos una excepción
    if (!FOTO || FOTO === '' || typeof FOTO !== 'object') {
        FOTO = null;
    }
    const hash = yield bcrypt_1.default.hash(password, 10); // Encriptamos la contraseña
    return new Promise((resolve, reject) => {
        db_1.default.query('INSERT INTO usuarios (nombre, FOTO, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)', [nombre, FOTO, email, hash, direccion, telefono], (err, results) => {
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
            // Validar los nuevos datos
            const error = validarUsuario(usuario); // Validamos los datos
            if (error)
                return reject(new Error(error)); // Si hay error, lanzamos una excepción
            // Mezclar datos: lo que envía el usuario reemplaza lo que ya existía
            const usuarioActualizado = Object.assign(Object.assign({}, usuarioActual), usuario);
            // Si la contraseña ha cambiado, encriptarla
            if (usuario.password && usuario.password !== usuarioActual.password) {
                usuarioActualizado.password = yield bcrypt_1.default.hash(usuario.password, 10);
            }
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
