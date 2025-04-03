import db from './db';
import {QueryError, FieldPacket} from 'mysql2';

export const obtenerCategorias = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM categorias', (err: Error, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

export const obtenerCategoriaPorId = async (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id], (err: QueryError | null, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        })
    })
}

export const crearCategoria = (categoria: any): Promise<any> => {
    const {nombre, descripcion} = categoria;
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
        )
    })
}

export const actualizarCategoria = async (id: number, categoria: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try{
            const categoriaActual = await obtenerCategoriaPorId(id);
            if(!categoriaActual){
                return reject(new Error('Categoria no encontrado'));
            }

            const categoriaActualizada = {
                ...categoriaActual,
                ...categoria,
            };
            db.query(
                'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
                [
                    categoriaActualizada.nombre,
                    categoriaActualizada.descripcion,
                    id,
                ],
                (err: QueryError | null, results: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        } catch (error) {
            reject(error);
        }
    });
};

export const eliminarCategoria = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM categorias WHERE id_categoria = ?',
            [id], (err: QueryError | null, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        )
    })
}

export const obtenerIdCategoria =  (nombreCategoria: string): Promise<number> => {
    console.log(nombreCategoria);
    return new Promise((resolve, reject) => {
        db.query('SELECT id_categoria FROM categorias WHERE nombre = ?', [nombreCategoria], (err: QueryError | null, results: any[]) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                return reject (new Error('Categoria no encontrado'));
            }

            resolve(results[0].id_categoria);
        })
    })
}

