import db from '../services/db';
import {QueryError, FieldPacket, RowDataPacket} from "mysql2";
import {obtenerCategoriaPorId, obtenerIdCategoria} from "./categoriasServices";
interface FiltrosProducto {
    page: number;
    limit: number;
    search: string;
    category: string;
    sort: 'asc' | 'desc';
}
// Función para obtener todos los productos de la base de datos
export const obtenerProductos = ({ page, limit, search, category, sort }: FiltrosProducto): Promise<any> => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;

        const filtros: any[] = [];
        const condiciones: string[] = [];

        if (search) {
            condiciones.push('p.nombre LIKE ?');
            filtros.push(`%${search}%`);
        }

        if (category) {
            condiciones.push('c.nombre = ?');
            filtros.push(category);
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const sql = `
            SELECT SQL_CALC_FOUND_ROWS p.*
            FROM productos p
            LEFT JOIN ProductoCategoria pc ON p.id_producto = pc.id_producto
            LEFT JOIN categorias c ON pc.id_categoria = c.id_categoria
            ${where}
            GROUP BY p.id_producto
            ORDER BY p.precio ${sort === 'desc' ? 'DESC' : 'ASC'}
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [...filtros, limit, offset], async (err: QueryError | null, results: any[]) => {
            if (err) return reject(err);

            // Consulta para contar el total sin paginación
            db.query('SELECT FOUND_ROWS() AS total', async (err2: QueryError | null, totalResult: any[]) => {
                if (err2) return reject(err2);

                const total = totalResult[0].total;
                const productosCategoria: any[] = [];

                for (let producto of results) {
                    try {
                        const categorias = await new Promise<string[]>((res, rej) =>
                            db.query(
                                'SELECT c.nombre FROM categorias c JOIN ProductoCategoria pc ON c.id_categoria = pc.id_categoria WHERE pc.id_producto = ?',
                                [producto.id_producto],
                                (err: QueryError | null, categoriaResults: any[]) => {
                                    if (err) return rej(err);
                                    const nombres = categoriaResults.map(c => c.nombre);
                                    res(nombres);
                                }
                            )
                        );

                        producto.categorias = categorias;
                        productosCategoria.push(producto);
                    } catch (error) {
                        return reject(error);
                    }
                }

                resolve({
                    productos: productosCategoria,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit)
                });
            });
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
    const { nombre, descripcion, precio, stock, categorias, imagenes } = producto;

    try {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO productos (nombre, descripcion, precio, stock, imagenes) VALUES (?, ?, ?, ?, ?)',
                [nombre, descripcion, precio, stock, JSON.stringify(imagenes)],
                async (err: QueryError | null, results: any) => {
                    if (err) return reject(err);
                    const id_producto = results.insertId;

                    // Insertar categorías relacionadas
                    for (const nombre_categoria of categorias) {
                        const id_categoria = await obtenerIdCategoria(nombre_categoria);
                        await new Promise((resolve, reject) => {
                            db.query(
                                'INSERT INTO ProductoCategoria (id_producto, id_categoria) VALUES (?, ?)',
                                [id_producto, id_categoria],
                                (err) => err ? reject(err) : resolve(true),
                            );
                        });
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
export const actualizarProducto = async (id: number, nuevosDatos: any): Promise<any> => {
    try {
        const productoActual = await obtenerProductoPorId(id);
        if (!productoActual) {
            throw new Error('Producto no encontrado');
        }

        // Combinamos los datos antiguos con los nuevos
        const productoActualizado = {
            ...productoActual,
            ...nuevosDatos
        };

        // Convertimos las imágenes a JSON string si es un array
        const imagenesJson = JSON.stringify(productoActualizado.imagenes || []);

        // Actualizamos el producto (sin id_categoria porque se gestiona en tabla intermedia)
        await new Promise((resolve, reject) => {
            db.query(
                'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagenes = ? WHERE id_producto = ?',
                [
                    productoActualizado.nombre,
                    productoActualizado.descripcion,
                    productoActualizado.precio,
                    productoActualizado.stock,
                    imagenesJson,
                    id
                ],
                (err: QueryError | null, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        // Actualizar categorías si vienen en la petición
        if (Array.isArray(nuevosDatos.categorias)) {
            await actualizarCategoriasProducto(id, nuevosDatos.categorias);
        }

        return { message: 'Producto actualizado correctamente' };
    } catch (error) {
        throw error;
    }
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
export const obtenerDestacados = (): Promise<any[]> => {
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
                    return reject(err);
                }

                const productosTop = (results as any[]).map(producto => {
                    if (producto.imagenes) {
                        try {
                            producto.imagenes = JSON.parse(producto.imagenes);
                        } catch {
                            producto.imagenes = [];
                        }
                    } else {
                        producto.imagenes = [];
                    }
                    return producto;
                });

                // Ahora hay que obtener categorías para cada producto
                const promisesCategorias = productosTop.map(producto => {
                    return new Promise<void>((resolveCat, rejectCat) => {
                        db.query(
                            `SELECT c.nombre
               FROM categorias c
                        INNER JOIN ProductoCategoria pc ON c.id_categoria = pc.id_categoria
               WHERE pc.id_producto = ?`,
                            [producto.id_producto],
                            (err, categoriasResults) => {
                                if (err) return rejectCat(err);

                                producto.categorias = (categoriasResults as any[]).map((c: any) => c.nombre);
                                resolveCat();
                            }
                        );
                    });
                });

                Promise.all(promisesCategorias)
                    .then(() => resolve(productosTop))
                    .catch(reject);
            }
        );
    });
};

export const actualizarCategoriasProducto = async (id_producto: number, nuevasCategorias: number[]) => {
    // Elimina las categorías actuales
    await new Promise((resolve, reject) => {
        db.query('DELETE FROM ProductoCategoria WHERE id_producto = ?', [id_producto], (err) => {
            if (err) reject(err);
            else resolve(null);
        });
    });

    // Inserta las nuevas
    for (const id_categoria of nuevasCategorias) {
        await new Promise((resolve, reject) => {
            db.query('INSERT INTO ProductoCategoria (id_producto, id_categoria) VALUES (?, ?)', [id_producto, id_categoria], (err) => {
                if (err) reject(err);
                else resolve(null);
            });
        });
    }
};
