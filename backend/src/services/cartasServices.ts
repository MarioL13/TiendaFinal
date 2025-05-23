import db from './db';  // Importa la conexión a la base de datos
import {QueryError} from "mysql2";

export const obtenerCartas = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM cartas', (err: QueryError | null, results: any[]) => {
            if (err) {
                reject(new Error('Error al obtener las cartas: ' + err.message));
            } else {
                resolve(results);
            }
        })
    })
}

export const obtenerCartaPorId = async (id: number): Promise<any |null> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM cartas WHERE id_carta = ?',
            [id],
            (err: QueryError | null, results: any[]) => {
                if (err) {
                    reject(new Error('Error al obtener la carta: ' + err.message));
                } else {
                    resolve(results[0] || null);
                }
            }
        )
    })
}

export const crearCarta = async (carta: any): Promise<any> => {
    const { nombre, stock, precio, scryfall_id, set_code, collector_number, imagen } = carta;

    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO cartas (nombre, stock, precio, scryfall_id, set_code, collector_number, imagen)
             VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                                      stock = stock + VALUES(stock),
                                      precio = VALUES(precio)`,
            [nombre, stock, precio, scryfall_id, set_code, collector_number, imagen],
            (err: QueryError | null, results: any) => {
                if (err) {
                    reject(new Error('Error al crear la carta: ' + err.message));
                } else {
                    resolve(results);
                }
            }
        );
    });
};


export const actualizarCarta = async (id:number, carta: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const cartaActual = await obtenerCartaPorId(id);
            if (!cartaActual) {
                return reject(new Error('Carta no encontrada'))
            }

            const cartaActualizado = {
                ...cartaActual,
                ...carta,
            }

            db.query(
                'UPDATE cartas SET nombre = ?, stock = ?, precio = ? WHERE id_carta = ?',
                [
                    cartaActualizado.nombre,
                    cartaActualizado.stock,
                    cartaActualizado.precio,
                    id
                ],
                (err: QueryError | null, results: any[]) => {
                    if (err) {
                        reject(new Error('Error al actualizar la carta: ' + err.message));
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

export const eliminarCarta = async (id: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try{
            const carta = await obtenerCartaPorId(id);
            if(!carta){
                return reject(new Error('Carta no encontrada'))
            }

            db.query(
                'DELETE FROM cartas WHERE id_carta = ?',
                [id],
                (err: QueryError | null, results: any[]) => {
                    if (err) {
                        reject(new Error('Error al eliminar la carta: ' + err.message));
                    } else {
                        resolve(results);
                    }
                }
            )
        }catch (error) {
            reject(error);
        }
    })
}

export const buscarCartasPorNombres = async (nombres: string[]): Promise<{ encontradas: any[], noEncontradas: string[] }> => {
    return new Promise((resolve, reject) => {
        if (nombres.length === 0) return resolve({ encontradas: [], noEncontradas: [] });

        const placeholders = nombres.map(() => '?').join(',');
        db.query(
            `SELECT * FROM cartas WHERE nombre IN (${placeholders})`,
            nombres,
            (err: QueryError | null, results: any[]) => {
                if (err) {
                    return reject(new Error('Error al buscar cartas: ' + err.message));
                }

                const encontradasNombres = results.map(carta => carta.nombre.toLowerCase());
                const noEncontradas = nombres.filter(nombre => !encontradasNombres.includes(nombre.toLowerCase()));

                resolve({
                    encontradas: results,
                    noEncontradas
                });
            }
        )
    });
};