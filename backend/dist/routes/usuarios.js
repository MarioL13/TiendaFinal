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
const usuariosServices_1 = require("../services/usuariosServices"); // Importa las funciones del servicio
const router = (0, express_1.Router)();
// Obtener todos los usuarios
router.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, usuariosServices_1.obtenerUsuarios)();
        res.json(users);
    }
    catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
}));
// Obtener un usuario por ID
router.get('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const user = yield (0, usuariosServices_1.obtenerUsuarioPorId)(id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
    }
}));
// Crear un nuevo usuario
router.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.body;
    try {
        const result = yield (0, usuariosServices_1.crearUsuario)(usuario);
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    }
}));
// Actualizar un usuario
router.put('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const usuario = req.body;
    try {
        const result = yield (0, usuariosServices_1.actualizarUsuario)(id, usuario);
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado' });
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
    }
}));
// Eliminar un usuario
router.delete('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield (0, usuariosServices_1.eliminarUsuario)(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario eliminado' });
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
}));
exports.default = router;
