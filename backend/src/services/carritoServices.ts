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
                       END AS precio
            FROM Carrito c
                     LEFT JOIN Productos p ON c.tipo_item = 'producto' AND c.id_item = p.id_producto
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
            INSERT INTO Carrito (id_usuario, tipo_item, id_item, cantidad)
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

export const actualizarCantidadCarrito = (id_carrito: number, cantidad: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE carrito SET cantidad = ? WHERE id_carrito = ?`,
            [cantidad, id_carrito],
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
    const tabla = tipo_item === 'producto' ? 'Productos' : 'Cartas';
    const campo = tipo_item === 'producto' ? 'id_producto' : 'id_cartas';

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