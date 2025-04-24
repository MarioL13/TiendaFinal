import { Router, Request, Response } from 'express';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuarioPorEmail
} from '../services/usuariosServices'; // Importa las funciones del servicio que maneja los usuarios

const router = Router();

// Obtener todos los usuarios
router.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await obtenerUsuarios(); // Llama a la función para obtener los usuarios
        res.json(users); // Devuelve los usuarios en formato JSON
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
});

// Obtener un usuario por su ID
router.get('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el ID de la URL en número
    try {
        const user = await obtenerUsuarioPorId(id); // Llama a la función para obtener un usuario por ID
        if (user) {
            res.json(user); // Devuelve el usuario si existe
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error si el usuario no existe
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
    }
});

// Crear un nuevo usuario
router.post('/api/users', async (req: Request, res: Response) => {
    const usuario = req.body; // Obtiene los datos del usuario desde el cuerpo de la solicitud
    try {
        const result = await crearUsuario(usuario); // Llama a la función para crear un usuario
        res.status(201).json({ message: 'Usuario creado', id: result.insertId }); // Responde con el ID del usuario creado
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    }
});

// Actualizar un usuario existente
router.put('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el ID de la URL en número
    const usuario = req.body; // Obtiene los nuevos datos del usuario
    try {
        const result = await actualizarUsuario(id, usuario); // Llama a la función para actualizar el usuario
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado' }); // Responde si se actualizó correctamente
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
    }
});

// Eliminar un usuario por su ID
router.delete('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Convierte el ID de la URL en número
    try {
        const result = await eliminarUsuario(id); // Llama a la función para eliminar un usuario
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario eliminado' }); // Confirma la eliminación del usuario
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
});

// Endpoint de login
router.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await obtenerUsuarioPorEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

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
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al intentar hacer login', error: err.message });
    }
});

// Exporta el enrutador para ser utilizado en la aplicación principal
export default router;
