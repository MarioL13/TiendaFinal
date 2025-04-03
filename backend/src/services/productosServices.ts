import db from '../services/db';
import { QueryError, FieldPacket } from "mysql2";
import { obtenerIdCategoria } from "./categoriasServices";

// Función para obtener todos los productos de la base de datos
export const obtenerProductos = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM productos', (err: Error, results: any[]) => {
            if (err) {
                reject(err); // Rechaza la promesa en caso de error
            } else {
                resolve(results); // Devuelve los productos obtenidos
            }
        });
    });
};

// Función para obtener un producto por su ID
export const obtenerProductoPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM productos WHERE id_producto = ?',
            [id],
            (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
                if (err) {
                    reject(err);
                } else {
                    const producto = results[0]; // Obtiene el primer resultado
                    if (producto) {
                        // Si el producto existe, obtiene también su categoría
                        db.query(
                            'SELECT * FROM categorias WHERE id_categoria = ?',
                            [producto.id_categoria],
                            (err: QueryError | null, categoriaResults: any[], fields: FieldPacket[]) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const categoria = categoriaResults[0];
                                    if (categoria) {
                                        producto.categoria = categoria; // Agrega la categoría al producto
                                    }
                                    resolve(producto);
                                }
                            }
                        );
                    } else {
                        resolve(null); // Si no existe el producto, devuelve null
                    }
                }
            }
        );
    });
};

// Función para crear un nuevo producto en la base de datos
export const crearProducto = async (producto: any): Promise<any> => {
    const { nombre, descripcion, precio, stock, nombre_categoria, imagen } = producto;
    try {
        // Obtiene el ID de la categoría basada en su nombre
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
};

// Función para actualizar un producto existente
export const actualizarProducto = async (producto: any, producto1: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtiene el producto actual antes de actualizarlo
            const productoActual = await obtenerProductoPorId(producto);
            if (!productoActual) {
                return reject(new Error('Producto no encontrado'));
            }

            // Combina los datos actuales con los nuevos valores
            const productoActualizado = {
                ...productoActual,
                ...producto,
            };

            db.query(
                'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, imagen = ? WHERE id_producto = ?',
                [
                    productoActualizado.nombre,
                    productoActualizado.descripcion,
                    productoActualizado.precio,
                    productoActualizado.stock,
                    productoActualizado.id_categoria,
                    productoActualizado.imagen,
                    productoActualizado.id_producto // Se agrega el ID del producto en la consulta
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

// Función para eliminar un producto por su ID
export const eliminarProducto = async (producto: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        db.query(
            'DELETE FROM productos WHERE id_producto = ?',
            producto,
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
