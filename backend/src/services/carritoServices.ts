import db from './db';  // Importa la conexión a la base de datos
import {QueryError, RowDataPacket} from "mysql2";

export const obtenerCarritoCompletoUsuario = (id_usuario: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT c.id_carrito, c.tipo_item, c.id_item, c.cantidad,
                   CASE
                       WHEN c.tipo_item = 'producto' THEN p.nombre
                       ELSE ca.nombre
                   END AS nombre,
                   CASE
                       WHEN c.tipo_item = 'producto' THEN p.precio
                       ELSE ca.precio
                   END AS precio,
                   CASE
                       WHEN c.tipo_item = 'producto' THEN JSON_UNQUOTE(JSON_EXTRACT(p.imagenes, '$[0]'))
                       ELSE NULL
                   END AS imagen
            FROM carrito c
                     LEFT JOIN productos p ON c.tipo_item = 'producto' AND c.id_item = p.id_producto
                     LEFT JOIN cartas ca ON c.tipo_item = 'carta' AND c.id_item = ca.id_carta
            WHERE c.id_usuario = ?
        `;

        db.query(query, [id_usuario], (err: QueryError | null, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

export const agregarAlCarrito = (id_usuario: number, tipo_item: 'producto' | 'carta', id_item: number, cantidad: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO carrito (id_usuario, tipo_item, id_item, cantidad)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
        `;
        db.query(query, [id_usuario, tipo_item, id_item, cantidad], (err: QueryError | null, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export const actualizarCantidadCarrito = (id_usuario: number, id_carrito: number, cantidad: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE carrito SET cantidad = ? WHERE id_carrito = ? AND id_usuario = ?`,
            [cantidad, id_carrito, id_usuario],
            (err: QueryError | null, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export const eliminarItemCarritoSeguro = (id_usuario: number, tipo_item: string, id_item: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM carrito WHERE id_usuario = ? AND tipo_item = ? AND id_item = ?`,
            [id_usuario, tipo_item, id_item],
            (err: QueryError | null, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export const vaciarCarrito = (id_usuario: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM carrito WHERE id_usuario = ?`,
            [id_usuario],
            (err: QueryError | null, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export const existeItem = (tipo_item: 'producto' | 'carta', id_item: number): Promise<boolean> => {
    const tabla = tipo_item === 'producto' ? 'Productos' : 'cartas';
    const campo = tipo_item === 'producto' ? 'id_producto' : 'id_carta';

    return new Promise((resolve, reject) => {
        db.query(
            `SELECT COUNT(*) as total FROM ${tabla} WHERE ${campo} = ?`,
            [id_item],
            (err, results) => {
                if (err) return reject(err);
                const rows = results as RowDataPacket[];
                resolve(rows[0].total > 0);
            }
        );
    });
};

export const obtenerTotalItemsCarrito = (id_usuario: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT SUM(cantidad) AS total
            FROM carrito
            WHERE id_usuario = ?
        `;
        db.query(query, [id_usuario], (err: QueryError | null, results: RowDataPacket[]) => {
            if (err) {
                reject(err);
            } else {
                const total = results[0].total || 0;
                resolve(total);
            }
        });
    });
};
