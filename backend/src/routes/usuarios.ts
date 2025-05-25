import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer, { Multer } from 'multer';
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
import dotenv from "dotenv";

const upload: Multer = multer({ dest: 'uploads/' });

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

/**
 * @api {get} /api/users Obtener todos los usuarios
 * @apiName ObtenerUsuarios
 * @apiGroup Usuarios
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT de administrador.
 *
 * @apiSuccess {Object[]} users Lista de usuarios.
 * @apiError 500 Error interno del servidor.
 */
router.get('/api/users', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    try {
        const users = await obtenerUsuarios();
        res.json(users);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    }
});

/**
 * @api {get} /api/users/me Obtener datos del usuario autenticado
 * @apiName ObtenerUsuarioLogeado
 * @apiGroup Usuarios
 * @apiPermission user
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiSuccess {Object} user Datos del usuario logeado.
 * @apiError 404 Usuario no encontrado.
 * @apiError 500 Error interno del servidor.
 */
router.get('/api/users/me', verificarToken, async (req: Request, res: Response) => {
    const usuarioLogeado = (req as any).usuario;
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

/**
 * @api {get} /api/users/:id Obtener un usuario por ID
 * @apiName ObtenerUsuarioPorId
 * @apiGroup Usuarios
 * @apiPermission admin, user (propio)
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {Number} id ID del usuario.
 *
 * @apiSuccess {Object} user Datos del usuario solicitado.
 * @apiError 403 Acceso denegado si no es admin ni el mismo usuario.
 * @apiError 404 Usuario no encontrado.
 * @apiError 500 Error interno del servidor.
 */
router.get('/api/users/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const usuarioLogeado = (req as any).usuario;

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

/**
 * @api {post} /api/users Crear un nuevo usuario
 * @apiName CrearUsuario
 * @apiGroup Usuarios
 *
 * @apiParam {String} [FOTO] Imagen del usuario (form-data).
 * @apiParam {String} nombre Nombre del usuario.
 * @apiParam {String} apellido Apellido del usuario.
 * @apiParam {String} email Email del usuario.
 * @apiParam {String} password Contraseña del usuario.
 *
 * @apiSuccess (201) {Number} id ID del usuario creado.
 * @apiError 500 Error al crear el usuario.
 */
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

/**
 * @api {put} /api/users/:id Actualizar un usuario existente
 * @apiName ActualizarUsuario
 * @apiGroup Usuarios
 * @apiPermission admin, user (propio)
 *
 * @apiHeader {String} Authorization Token JWT.
 * @apiParam {Number} id ID del usuario a actualizar.
 * @apiParam {String} [FOTO] Nueva imagen (form-data).
 * @apiParam {String} [nombre] Nombre actualizado.
 * @apiParam {String} [apellido] Apellido actualizado.
 *
 * @apiSuccess {String} message Confirmación de actualización.
 * @apiError 403 Sin permisos para editar.
 * @apiError 500 Error al actualizar usuario.
 */
router.put('/api/users/:id', verificarToken, upload.single('FOTO'), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const usuarioLogeado = (req as any).usuario;

    if (usuarioLogeado.rol !== 'admin' && usuarioLogeado.id !== id) {
        return res.status(403).json({ message: 'No tienes permiso para editar este usuario' });
    }

    try {
        const datosActualizados = req.body;

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

/**
 * @api {delete} /api/users/:id Eliminar un usuario
 * @apiName EliminarUsuario
 * @apiGroup Usuarios
 * @apiPermission admin, user (propio)
 *
 * @apiHeader {String} Authorization Token JWT.
 * @apiParam {Number} id ID del usuario a eliminar.
 *
 * @apiSuccess {String} message Confirmación de eliminación.
 * @apiError 404 Usuario no encontrado.
 * @apiError 500 Error al eliminar usuario.
 */
router.delete('/api/users/:id', verificarToken, async (req: Request, res: Response) => {
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

/**
 * @api {post} /api/login Login de usuario
 * @apiName LoginUsuario
 * @apiGroup Autenticación
 *
 * @apiParam {String} email Email del usuario.
 * @apiParam {String} password Contraseña del usuario.
 * @apiParam {Boolean} [mantenerSesion] Mantener sesión abierta (24h) o no (2h).
 *
 * @apiSuccess {String} message Mensaje de éxito.
 * @apiSuccess {Object} usuario Datos del usuario (sin password).
 * @apiError 404 Usuario no encontrado.
 * @apiError 401 Contraseña incorrecta.
 * @apiError 500 Error interno.
 */
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

/**
 * @api {post} /api/logout Cerrar sesión
 * @apiName LogoutUsuario
 * @apiGroup Autenticación
 * @apiPermission user
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiSuccess {String} message Confirmación de cierre de sesión.
 */
router.post('/api/logout', verificarToken, (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
});

/**
 * @api {get} /api/check-auth Verificar autenticación
 * @apiName CheckAuth
 * @apiGroup Autenticación
 * @apiPermission user
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiSuccess {Boolean} autenticado true si está autenticado.
 * @apiSuccess {String} rol Rol del usuario.
 * @apiSuccess {Number} id ID del usuario.
 */
router.get('/api/check-auth', verificarToken, (req: Request, res: Response) => {
    const usuario = (req as any).usuario;
    res.json({ autenticado: true, rol: usuario.rol, id: usuario.id });
});

/**
 * @api {put} /api/cambiarpassword Cambiar contraseña del usuario autenticado
 * @apiName CambiarPassword
 * @apiGroup Usuarios
 * @apiPermission user
 *
 * @apiHeader {String} Authorization Token JWT.
 * @apiParam {String} password Contraseña actual.
 * @apiParam {String} nuevapassword Nueva contraseña.
 *
 * @apiSuccess {String} message Confirmación de cambio.
 * @apiError 400 Faltan parámetros.
 * @apiError 401 Contraseña actual incorrecta.
 * @apiError 404 Usuario no encontrado.
 * @apiError 500 Error al cambiar contraseña.
 */
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

/**
 * Función para subir una imagen a Cloudinary
 * @param {Express.Multer.File} imagen Archivo subido con multer
 * @returns {Promise<string>} URL segura de la imagen subida
 */
const subirImagen = (imagen: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagen.path, (error, result) => {
            fs.unlinkSync(imagen.path); // elimina el archivo temporal local
            if (error || !result) {
                reject(error || new Error('Error subiendo la imagen a Cloudinary'));
            } else {
                resolve(result.secure_url);
            }
        });
    });
};

export default router;
