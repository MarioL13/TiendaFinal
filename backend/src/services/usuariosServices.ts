import db from './db';  // Importa la conexión a la base de datos
import { QueryError, FieldPacket } from 'mysql2';


export const obtenerUsuarios = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios', (err: Error, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]); // Solo un resultado
            }
        });
    });
};

// Crear un nuevo usuario
export const crearUsuario = (usuario: any): Promise<any> => {
    const { nombre, FOTO, email, password, direccion, telefono } = usuario;
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (nombre, FOTO, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, FOTO, email, password, direccion, telefono],
            (err: QueryError | null, results: any) => { // Cambié Error por QueryError | null
                if (err) {
                    reject(err);
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

            // Ejecutar la consulta de actualización
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
                        reject(err);
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
export const eliminarUsuario = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err: QueryError | null, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
