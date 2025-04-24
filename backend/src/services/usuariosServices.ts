import db from './db';  // Importa la conexión a la base de datos
import { QueryError, FieldPacket } from 'mysql2';

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios', (err: QueryError | null, results: any[]) => {
            if (err) {
                reject(new Error('Error al obtener los usuarios: ' + err.message));
            } else {
                resolve(results);
            }
        });
    });
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (id: number): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id],
            (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
                if (err) {
                    reject(new Error('Error al obtener el usuario: ' + err.message));
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            }
        );
    });
};

// Crear un nuevo usuario
export const crearUsuario = async (usuario: any): Promise<any> => {
    let { nombre, FOTO, email, password, direccion, telefono } = usuario;

    if (!FOTO || FOTO === '' || typeof FOTO !== 'object') {
        FOTO = null;
    }

    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuarios (nombre, FOTO, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, FOTO, email, password, direccion, telefono],
            (err: QueryError | null, results: any) => {
                if (err) {
                    reject(new Error('Error al crear el usuario: ' + err.message));
                } else {
                    resolve(results);
                }
            }
        );
    });
};

// Actualizar un usuario
export const actualizarUsuario = async (id: number, usuario: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtener el usuario actual
            const usuarioActual = await obtenerUsuarioPorId(id);
            if (!usuarioActual) {
                return reject(new Error('Usuario no encontrado'));
            }

            // Mezclar datos: lo que envía el usuario reemplaza lo que ya existía
            const usuarioActualizado = {
                ...usuarioActual,
                ...usuario,
            };

            db.query(
                'UPDATE usuarios SET nombre = ?, FOTO = ?, email = ?, password = ?, direccion = ?, telefono = ? WHERE id_usuario = ?',
                [
                    usuarioActualizado.nombre,
                    usuarioActualizado.FOTO,
                    usuarioActualizado.email,
                    usuarioActualizado.password,
                    usuarioActualizado.direccion,
                    usuarioActualizado.telefono,
                    id,
                ],
                (err: QueryError | null, results: any) => {
                    if (err) {
                        reject(new Error('Error al actualizar el usuario: ' + err.message));
                    } else {
                        resolve(results);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });
};

// Eliminar un usuario
export const eliminarUsuario = async (id: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar si el usuario existe antes de eliminarlo
            const usuario = await obtenerUsuarioPorId(id);
            if (!usuario) {
                return reject(new Error('Usuario no encontrado'));
            }

            db.query(
                'DELETE FROM usuarios WHERE id_usuario = ?',
                [id],
                (err: QueryError | null, results: any) => {
                    if (err) {
                        reject(new Error('Error al eliminar el usuario: ' + err.message));
                    } else {
                        resolve(results);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });
};

export const obtenerUsuarioPorEmail = async (email: string): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email],
            (err: QueryError | null, results: any[]) => {
                if (err) {
                    reject(new Error('Error al buscar el usuario: ' + err.message));
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            }
        );
    });
};