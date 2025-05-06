import db from './db';  // Importa la conexión a la base de datos
import {QueryError} from "mysql2";

export const obtenerCarritoUsuario = (id_usuario: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT c.id_carrito, c.id_producto, c.cantidad, p.nombre, p.precio, p.imagen
             FROM carrito c
             JOIN productos p ON c.id_producto = p.id_producto
             WHERE c.id_usuario = ?`,
            [id_usuario],
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

export const eliminarItemCarrito = (id_carrito: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM carrito WHERE id_carrito = ?`,
            [id_carrito],
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