import db from './db';  // Importa la conexión a la base de datos
import { QueryError, FieldPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import validator from 'validator';

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

const validarUsuario = (usuario: any, requerirPassword: boolean = true): string | null => {
    const { nombre, apellido, email, password, telefono } = usuario;

    if (!nombre || nombre.trim().length < 2) {
        return 'Nombre inválido.';
    }

    if (!apellido || apellido.trim().length < 2) {
        return 'Apellido inválido.';
    }

    if (!email || !validator.isEmail(email)) {
        return 'Email inválido.';
    }

    if (requerirPassword && (!password || !validarPassword(password))) {
        return 'La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula, un número y un símbolo.';
    }

    if (telefono && !validator.isMobilePhone(telefono, 'es-ES')) {
        return 'Teléfono inválido.';
    }

    return null;
};

// Función para validar la contraseña (8 caracteres, al menos una mayúscula, un número y un símbolo)
const validarPassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    return regex.test(password);
};

// Crear un nuevo usuario
export const crearUsuario = async (usuario: any): Promise<any> => {
    let { nombre, apellido, foto, email, password, direccion, telefono } = usuario;

    const error = validarUsuario(usuario);
    if (error) throw new Error(error);

    // FOTO debe ser string o null
    if (!foto || foto === '') {
        foto = null;
    }

    const hash = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuarios (nombre, apellido, foto, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, foto, email, hash, direccion, telefono],
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
            const usuarioActual = await obtenerUsuarioPorId(id);
            if (!usuarioActual) {
                return reject(new Error('Usuario no encontrado'));
            }

            const error = validarUsuario(usuario, false);
            if (error) return reject(new Error(error));

            // Preparar imagen
            let fotoFinal = usuario.foto;
            if (Array.isArray(usuario.foto)) {
                fotoFinal = JSON.stringify(usuario.foto);
            }

            // No permitimos cambiar contraseña desde aquí
            const passwordFinal = usuarioActual.password;

            const usuarioActualizado = {
                ...usuarioActual,
                ...usuario,
                foto: fotoFinal ?? usuarioActual.foto,
                password: passwordFinal,
            };

            db.query(
                'UPDATE usuarios SET nombre = ?, apellido = ?, foto = ?, email = ?, password = ?, direccion = ?, telefono = ? WHERE id_usuario = ?',
                [
                    usuarioActualizado.nombre,
                    usuarioActualizado.apellido,
                    usuarioActualizado.foto,
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

export const cambiarPassword = async (id: number, nuevaPassword: string): Promise<any> => {
    if (!validarPassword(nuevaPassword)) {
        throw new Error('La nueva contraseña debe tener mínimo 8 caracteres, incluir una mayúscula, un número y un símbolo.');
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
            [hashedPassword, id],
            (err: QueryError | null, results: any) => {
                if (err) {
                    reject(new Error('Error al cambiar la contraseña: ' + err.message));
                } else {
                    resolve(results);
                }
            }
        );
    });
};

