import db from './db';
import { QueryError, FieldPacket } from 'mysql2';

// Obtiene todas las categorías de la base de datos
export const obtenerCategorias = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM categorias', (err: Error, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Obtiene una categoría por su ID
export const obtenerCategoriaPorId = async (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM categorias WHERE id_categoria = ?',
            [id],
            (err: QueryError | null, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]); // Devuelve la primera categoría encontrada o undefined
                }
            }
        );
    });
};

// Crea una nueva categoría
export const crearCategoria = (categoria: any): Promise<any> => {
    const { nombre, descripcion } = categoria;
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion],
            (err: QueryError | null, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

// Actualiza una categoría existente
export const actualizarCategoria = async (id: number, categoria: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtiene la categoría actual antes de actualizarla
            const categoriaActual = await obtenerCategoriaPorId(id);
            if (!categoriaActual) {
                return reject(new Error('Categoría no encontrada'));
            }

            // Fusiona los datos actuales con los nuevos valores
            const categoriaActualizada = {
                ...categoriaActual,
                ...categoria,
            };

            db.query(
                'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
                [categoriaActualizada.nombre, categoriaActualizada.descripcion, id],
                (err: QueryError | null, results: any[]) => {
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

// Elimina una categoría por su ID
export const eliminarCategoria = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM categorias WHERE id_categoria = ?',
            [id],
            (err: QueryError | null, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

// Obtiene el ID de una categoría por su nombre
export const obtenerIdCategoria = (nombreCategoria: string): Promise<number> => {
    console.log(nombreCategoria);
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id_categoria FROM categorias WHERE nombre = ?',
            [nombreCategoria],
            (err: QueryError | null, results: any[]) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return reject(new Error('Categoría no encontrada'));
                }

                resolve(results[0].id_categoria);
            }
        );
    });
};
