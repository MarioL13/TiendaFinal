import db from '../services/db';
import {QueryError, FieldPacket} from "mysql2";
import {obtenerIdCategoria} from "./categoriasServices";

export const obtenerProductos = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM productos', (err: Error, results: any[]) => {
            if (err) {
                reject(err)
            } else {
                resolve(results);
            }
        })
    })
}

export const obtenerProductoPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM productos WHERE id_producto = ?', [id], (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
            if (err) {
                reject(err);
            } else {
                const producto = results[0];
                if (producto) {
                    db.query('SELECT * FROM categorias WHERE id_categoria = ?',
                        [producto.id_categoria], (err: QueryError | null, categoriaResults: any[], fields: FieldPacket[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            const categoria = categoriaResults[0];
                            if (categoria) {
                                producto.categoria = categoria;
                                resolve(producto);
                            } else {
                                resolve(producto);
                            }
                        }
                    });
                } else {
                    resolve(null);
                }
            }
        });
    });
};


export const crearProducto = async (producto: any): Promise<any> => {
    const {nombre, descripcion, precio, stock, nombre_categoria, imagen} = producto;
    try {
        const id_categoria = await obtenerIdCategoria(nombre_categoria);

        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, descripcion, precio, stock, id_categoria, imagen],
                (err: QueryError | null, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

export const actualizarProducto = async (producto: any, producto1: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const productoActual = await obtenerProductoPorId(producto);
            if (!productoActual) {
                return reject(new Error('Producto no encontrado'));
            }

            const productoActualizado = {
                ...productoActual,
                ...producto,
            };

            db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, imagen = ? ',
                [
                    productoActualizado.nombre,
                    productoActualizado.precio,
                    productoActualizado.descripcion,
                    productoActualizado.stock,
                    productoActualizado.imagen,
                    productoActualizado.id_categoria,
                    productoActualizado.imagen,
                ],
                (err: QueryError | null, results: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results);
                    }
                }
            )
        } catch (error) {
            reject(error);
        }
    })
}

export const eliminarProducto = async (producto: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        db.query('DELETE FROM productos WHERE id_producto = ?', producto, (err: QueryError | null, results: any[]) => {
            if (err) {
                reject(err)
            } else {
                resolve(results);
            }
        })
    })
}

