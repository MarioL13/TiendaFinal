import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer, { Multer } from 'multer';

const upload: Multer = multer({ dest: 'uploads/' });
import jwt, { SignOptions } from 'jsonwebtoken';
import {
    verificarToken,
    verificarAdmin
} from '../middlewares/authMiddleware';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuarioPorEmail,
    cambiarPassword
} from '../services/usuariosServices';
import bcrypt from "bcrypt";
import fs from "fs";
import dotenv from "dotenv"; // Importa las funciones del servicio que maneja los usuarios

const router = Router();

// Obtener todos los usuarios
router.get('/api/users', verificarToken, verificarAdmin, async (req: Request, res: Response) => {    try {
        const users = await obtenerUsuarios(); // Llama a la función para obtener los usuarios
        res.json(users); // Devuelve los usuarios en formato JSON
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
});

router.get('/api/users/me', verificarToken, async (req: Request, res: Response) => {
    const usuarioLogeado = (req as any).usuario; // Aquí accedes al usuario del token
    try {
        const user = await obtenerUsuarioPorId(usuarioLogeado.id);
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

// Obtener un usuario por su ID
router.get('/api/users/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const usuarioLogeado = (req as any).usuario; // Aquí accedes al usuario del token

    if (usuarioLogeado.rol !== 'admin' && usuarioLogeado.id !== id) {
        return res.status(403).json({ message: 'No puedes acceder a este usuario' });
    }

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

// Crear un nuevo usuario con subida de imágenes a Cloudinary
router.post('/api/users', upload.single('FOTO'), async (req: Request, res: Response) => {
    const usuario = req.body;

    try {
        if (req.file) {
            const urlImagen = await subirImagen(req.file);
            usuario.FOTO = urlImagen;
        } else {
            usuario.FOTO = null;
        }

        const result = await crearUsuario(usuario);
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    }
});

// Actualizar un usuario existente
router.put('/api/users/:id', verificarToken, upload.single('FOTO'), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const usuarioLogeado = (req as any).usuario;

    if (usuarioLogeado.rol !== 'admin' && usuarioLogeado.id !== id) {
        return res.status(403).json({ message: 'No tienes permiso para editar este usuario' });
    }

    try {
        const datosActualizados = req.body;

        // Si se sube nueva imagen, la subimos a Cloudinary
        if (req.file) {
            const urlImagen = await subirImagen(req.file);
            datosActualizados.FOTO = urlImagen;
        }

        await actualizarUsuario(id, datosActualizados);
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
    }
});

// Eliminar un usuario por su ID
router.delete('/api/users/:id', verificarToken, async (req: Request, res: Response) => {
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
    const { email, password, mantenerSesion } = req.body;
    const secret = process.env.JWT_SECRET;

    try {
        const user = await obtenerUsuarioPorEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const passwordCorrecta = await bcrypt.compare(password, user.password);
        if (!passwordCorrecta) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (!secret) {
            throw new Error('JWT_SECRET no está definido');
        }

        const duracion = mantenerSesion ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 2; // 24h o 2h
        const expiracionJWT = mantenerSesion ? '24h' : '2h';

        const token = jwt.sign(
            { id: user.id_usuario, email: user.email, rol: user.rol },
            secret,
            { expiresIn: expiracionJWT }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: duracion,
            sameSite: 'strict',
        });

        const usuarioFiltrado = {
            id: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
        };

        res.json({ message: 'Login correcto', usuario: usuarioFiltrado });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al intentar hacer login', error: err.message });
    }
});

router.post('/api/logout', verificarToken, (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
});

router.get('/api/check-auth', verificarToken, (req: Request, res: Response) => {
    const usuario = (req as any).usuario;
    res.json({ autenticado: true, rol: usuario.rol, id: usuario.id });
});

router.put('/api/cambiarpassword', verificarToken, async (req: Request, res: Response) => {
    const { password, nuevapassword } = req.body;
    const usuario = (req as any).usuario;

    if (!password || !nuevapassword) {
        return res.status(400).json({ message: 'Debes proporcionar la contraseña actual y la nueva contraseña' });
    }

    try {
        const user = await obtenerUsuarioPorId(usuario.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const coincide = await bcrypt.compare(password, user.password);
        if (!coincide) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
        }

        await cambiarPassword(usuario.id, nuevapassword);
        res.json({ message: 'Contraseña actualizada correctamente' });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al cambiar la contraseña', error: err.message });
    }
});

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const subirImagen = (imagen: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagen.path, (error, result) => {
            fs.unlinkSync(imagen.path); // elimina el archivo local
            if (error || !result) {
                return reject(error || new Error('No se pudo subir la imagen'));
            }
            resolve(result.secure_url);
        });
    });
};

// Exporta el enrutador para ser utilizado en la aplicación principal
export default router;
