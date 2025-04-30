import db from './db';
import {QueryError, FieldPacket} from "mysql2";

export const obtenerDeseados = async (id: number): Promise<any[]> => {
    return new Promise((resolve, reject) =>{
        db.query(
            'SELECT * FROM deseados WHERE id_usuario = ?',
            [id],
            (err: QueryError | null, results: any[], fields: FieldPacket[]) => {
                if(err) {
                    reject(new Error('Error al obtener la lista' + err.message));
                }else {
                    resolve(results);
                }
            }
        )
    })
}

export const agregarProducto = async (deseado: any): Promise<any> => {
    let { id_carta, id_producto, id_usuario } = deseado;

    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO deseados (id_carta, id_producto, id_usuario) VALUES (?, ?, ?)',
            [id_carta, id_producto, id_usuario],
            (err: QueryError | null, results: any[]) => {
                if(err) {
                    reject(new Error('Error al crear el deseado' + err.message));
                } else {
                    resolve(results);
                }
            }
        )
    })
}

export const eliminarDeseado = async (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM deseados WHERE id_deseado = ?',
            [id],
            (err: QueryError | null, results: any) => {
                if (err) {
                    reject(new Error('Error al eliminar el deseado: ' + err.message));
                } else {
                    resolve(results);
                }
            }
        );
    });
};
