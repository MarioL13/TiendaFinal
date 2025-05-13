import db from '../services/db';
import {QueryError, FieldPacket} from "mysql2";
import {obtenerCategoriaPorId, obtenerIdCategoria} from "./categoriasServices";

// Función para obtener todos los productos de la base de datos
export const obtenerProductos = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM productos', async (err: Error, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                const productosCategoria: any[] = [];

                for (let producto of results) {
                    try {
                        const categorias = await new Promise<string[]>((res, rej) =>
                            db.query(
                                'SELECT c.nombre FROM categorias c JOIN ProductoCategoria pc ON c.id_categoria = pc.id_categoria WHERE pc.id_producto = ?',
                                [producto.id_producto],
                                (err: QueryError | null, categoriaResults: any[]) => {
                                    if (err) {
                                        rej(err); // <-- cuidado, aquí usabas reject del scope de fuera
                                    } else {
                                        const nombres: string[] = [];
                                        for (const c of categoriaResults) {
                                            nombres.push(c.nombre);
                                        }
                                        res(nombres);
                                    }
                                }
                            )
                        );

                        // Asignamos las categorías al producto
                        producto.categorias = categorias;

                        // Lo añadimos al array final
                        productosCategoria.push(producto);
                    } catch (error) {
                        reject(error);
                        return;
                    }
                }

                resolve(productosCategoria);
            }
        });
    });
};

// Función para obtener un producto por su ID y su categoría asociada
export const obtenerProductoPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM productos WHERE id_producto = ?',
            [id],
            (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
                if (err) return reject(new Error(`Error al consultar el producto: ${err.message}`));

                const producto = results[0];
                if (!producto) return resolve(null);

                // Obtener las categorías asociadas
                db.query(
                    `SELECT c.nombre
                     FROM categorias c
                              INNER JOIN ProductoCategoria pc ON c.id_categoria = pc.id_categoria
                     WHERE pc.id_producto = ?`,
                    [id],
                    (err: QueryError | null, categoriasResults: any[], fields: FieldPacket[]) => {
                        if (err) return reject(new Error(`Error al consultar las categorías: ${err.message}`));

                        const categorias: string[] = [];

                        for (const c of categoriasResults) {
                            categorias.push(c.nombre);
                        }

                        producto.categorias = categorias;

                        resolve(producto);
                    }
                );
            }
        );
    });
};

// Función para crear un nuevo producto en la base de datos
export const crearProducto = async (producto: any): Promise<any> => {
    const {nombre, descripcion, precio, stock, categorias, imagen} = producto;
    try {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)',
                [nombre, descripcion, precio, stock, imagen],
                async (err: QueryError | null, results: any) => {
                    if (err) return reject(err);
                    const id_producto = results.insertId;

                    for (const nombre_categoria of categorias) {
                        const id_categoria = await obtenerIdCategoria(nombre_categoria);
                        await new Promise((resolve, reject) => {
                            db.query(
                                'INSERT INTO ProductoCategoria (id_producto, id_categoria) VALUES (?, ?)',
                                [id_producto, id_categoria],
                                (err) => err ? reject(err) : resolve(true),
                            )
                        })
                    }
                    resolve(results);
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
                ...producto1,
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
// Función para obtener los productos Destacados
const obtenerDestacados = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT p.*, 
             SUM(dp.cantidad) AS total_vendidos 
             FROM detallepedido dp 
             JOIN productos p ON dp.id_item = p.id_producto 
             WHERE dp.tipo_item = 'producto' 
             GROUP BY dp.id_item 
             ORDER BY total_vendidos DESC 
             LIMIT 4`,
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const productosTop = results.map((producto: any) => {
                        if (producto.imagen) {
                            producto.imagen = `data:image/jpeg;base64,${Buffer.from(producto.imagen).toString('base64')}`;
                        }
                        return producto;
                    });
                    resolve(productosTop);
                }
            }
        );
    });
};
