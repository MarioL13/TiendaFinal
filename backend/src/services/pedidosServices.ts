import db from './db';
import { obtenerCarritoCompletoUsuario, vaciarCarrito } from './carritoServices';
import { QueryError, OkPacket } from 'mysql2';

export const confirmarCompra = (
    id_usuario: number,
    tipoPago: 'tienda' | 'online'
): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.beginTransaction(async err => {
            if (err) return reject(err);

            if (!['tienda', 'online'].includes(tipoPago)) {
                return db.rollback(() => reject(new Error('Tipo de pago inválido.')));
            }

            try {
                const carrito = await obtenerCarritoCompletoUsuario(id_usuario);

                if (carrito.length === 0) {
                    return db.rollback(() => reject(new Error('El carrito está vacío.')));
                }

                const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

                db.query(
                    `INSERT INTO Pedidos (id_usuario, total, estado)
                     VALUES (?, ?, ?)`,
                    [id_usuario, total, tipoPago === 'tienda' ? 'Pendiente' : 'Pagado'],
                    (err, result) => {
                        if (err) return db.rollback(() => reject(err));

                        const id_pedido = (result as OkPacket).insertId;

                        const detallesQuery = `
                            INSERT INTO DetallePedido (id_pedido, tipo_item, id_item, cantidad, precio)
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        const detallesPromises = carrito.map(item => {
                            return new Promise((res, rej) => {
                                db.query(
                                    detallesQuery,
                                    [id_pedido, item.tipo_item, item.id_item, item.cantidad, item.precio],
                                    (err) => {
                                        if (err) return rej(err);
                                        res(null);
                                    }
                                );
                            });
                        });

                        Promise.all(detallesPromises)
                            .then(async () => {
                                try {
                                    await vaciarCarrito(id_usuario);

                                    db.commit(err => {
                                        if (err) return db.rollback(() => reject(err));
                                        resolve({ success: true, mensaje: 'Pedido confirmado', id_pedido });
                                    });
                                } catch (err) {
                                    db.rollback(() => reject(err));
                                }
                            })
                            .catch(err => db.rollback(() => reject(err)));
                    }
                );
            } catch (err) {
                db.rollback(() => reject(err));
            }
        });
    });
};
