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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosServices_1 = require("../services/usuariosServices"); // Importa las funciones del servicio que maneja los usuarios
const router = (0, express_1.Router)();
// Obtener todos los usuarios
router.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, usuariosServices_1.obtenerUsuarios)(); // Llama a la función para obtener los usuarios
        res.json(users); // Devuelve los usuarios en formato JSON
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
}));
// Obtener un usuario por su ID
router.get('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el ID de la URL en número
    try {
        const user = yield (0, usuariosServices_1.obtenerUsuarioPorId)(id); // Llama a la función para obtener un usuario por ID
        if (user) {
            res.json(user); // Devuelve el usuario si existe
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error si el usuario no existe
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
    }
}));
// Crear un nuevo usuario
router.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.body; // Obtiene los datos del usuario desde el cuerpo de la solicitud
    try {
        const result = yield (0, usuariosServices_1.crearUsuario)(usuario); // Llama a la función para crear un usuario
        res.status(201).json({ message: 'Usuario creado', id: result.insertId }); // Responde con el ID del usuario creado
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    }
}));
// Actualizar un usuario existente
router.put('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el ID de la URL en número
    const usuario = req.body; // Obtiene los nuevos datos del usuario
    try {
        const result = yield (0, usuariosServices_1.actualizarUsuario)(id, usuario); // Llama a la función para actualizar el usuario
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado' }); // Responde si se actualizó correctamente
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
    }
}));
// Eliminar un usuario por su ID
router.delete('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id); // Convierte el ID de la URL en número
    try {
        const result = yield (0, usuariosServices_1.eliminarUsuario)(id); // Llama a la función para eliminar un usuario
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario eliminado' }); // Confirma la eliminación del usuario
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
}));
// Endpoint de login
router.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, usuariosServices_1.obtenerUsuarioPorEmail)(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Imprimir contraseñas para depuración
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña almacenada:', user.password);
        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        // Si quieres devolver sólo algunos campos:
        const usuarioFiltrado = {
            id: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
        };
        res.json({ message: 'Login correcto', usuario: usuarioFiltrado });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al intentar hacer login', error: err.message });
    }
}));
// Exporta el enrutador para ser utilizado en la aplicación principal
exports.default = router;
