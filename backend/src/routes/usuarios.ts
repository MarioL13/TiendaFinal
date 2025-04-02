import { Router, Request, Response } from 'express';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../services/usuariosServices'; // Importa las funciones del servicio

const router = Router();

// Obtener todos los usuarios
router.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await obtenerUsuarios();
        res.json(users);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
});

// Obtener un usuario por ID
router.get('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const user = await obtenerUsuarioPorId(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
    }
});

// Crear un nuevo usuario
router.post('/api/users', async (req: Request, res: Response) => {
    const usuario = req.body;
    try {
        const result = await crearUsuario(usuario);
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    }
});

// Actualizar un usuario
router.put('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = req.body;
    try {
        const result = await actualizarUsuario(id, usuario);
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
    }
});

// Eliminar un usuario
router.delete('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarUsuario(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
});

export default router;
