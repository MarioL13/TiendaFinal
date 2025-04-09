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

// Función para obtener un producto por su ID y su categoría asociada
export const obtenerProductoPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Consulta principal: buscar el producto
        console.log('ID de producto:', id); // Muestra el ID del producto en la consola
        db.query(
            'SELECT * FROM productos WHERE id_producto = ?',
            [id],
            (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
                if (err) {
                    return reject(new Error(`Error al consultar el producto: ${err.message}`));
                }

                const producto = results[0]; // Obtiene el primer resultado
                console.log('ProductoPoke:', producto); // Muestra el producto en la consola
                if (!producto) {
                    console.log('Producto no encontrado'); // Mensaje de error
                    return resolve(null); // Producto no encontrado
                }

                // Si el producto existe, buscar la categoría asociada
                db.query(
                    'SELECT * FROM categorias WHERE id_categoria = ?',
                    [producto.id_categoria],
                    (err: QueryError | null, categoriaResults: any[], fields: FieldPacket[]) => {
                        if (err) {
                            return reject(new Error(`Error al consultar la categoría: ${err.message}`));
                        }

                        const categoria = categoriaResults[0]; // Primera categoría encontrada
                        if (categoria) {
                            producto.categoria = categoria; // Agrega la categoría al producto
                        }
                        resolve(producto); // Devuelve el producto con la categoría asociada
                    }
                );
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
