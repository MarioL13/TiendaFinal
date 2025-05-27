import db from '../services/db';
import { QueryError, FieldPacket, RowDataPacket, ResultSetHeader } from "mysql2";

interface FiltrosEvento {
    fecha?: string;
    juego?: string;
    nombre?: string;
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
}

// Obtener eventos con filtros
export const obtenerEventos = ({
                                   page = 1,
                                   limit = 10,
                                   fecha,
                                   juego,
                                   nombre,
                                   sort = 'asc'
                               }: FiltrosEvento): Promise<any> => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;
        const filtros: any[] = [];
        const condiciones: string[] = [];

        if (fecha) {
            condiciones.push('DATE(e.fecha) = ?');
            filtros.push(fecha);
        }
        if (juego) {
            condiciones.push('e.juego LIKE ?');
            filtros.push(`%${juego}%`);
        }
        if (nombre) {
            condiciones.push('e.nombre LIKE ?');
            filtros.push(`%${nombre}%`);
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const sql = `
            SELECT SQL_CALC_FOUND_ROWS e.*
            FROM eventos e
                ${where}
            ORDER BY e.fecha ${sort.toUpperCase()}
                LIMIT ? OFFSET ?
        `;

        db.query(sql, [...filtros, limit, offset], (err, results) => {
            if (err) return reject(err);

            db.query('SELECT FOUND_ROWS() AS total', (err2, totalResult) => {
                if (err2) return reject(err2);

                const total = (totalResult as RowDataPacket[])[0].total;
                const eventos = results as RowDataPacket[];

                resolve({
                    eventos,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit)
                });
            });
        });
    });
};

// Obtener evento por ID
export const obtenerEventoPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM eventos WHERE id_evento = ?', [id], (err, results) => {
            if (err) return reject(err);
            const filas = results as RowDataPacket[];
            const evento = filas[0];
            if (!evento) return resolve(null);
            resolve(evento);
        });
    });
};

// Crear evento
export const crearEvento = (evento: any): Promise<any> => {
    const {
        nombre,
        descripcion,
        fecha,
        juego,
        precio_inscripcion = 0,
        premios = '',
        aforo_maximo = null
    } = evento;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO eventos
            (nombre, descripcion, fecha, juego, precio_inscripcion, premios, aforo_maximo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
            sql,
            [nombre, descripcion, fecha, juego, precio_inscripcion, premios, aforo_maximo],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

// Actualizar evento
export const actualizarEvento = (id: number, datos: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const {
            nombre,
            descripcion,
            fecha,
            juego,
            precio_inscripcion,
            premios,
            aforo_maximo
        } = datos;

        const sql = `
            UPDATE eventos SET
                               nombre = ?, descripcion = ?, fecha = ?, juego = ?, precio_inscripcion = ?, premios = ?, aforo_maximo = ?
            WHERE id_evento = ?
        `;

        db.query(
            sql,
            [nombre, descripcion, fecha, juego, precio_inscripcion, premios, aforo_maximo, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

// Eliminar evento
export const eliminarEvento = (id_evento: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM eventos WHERE id_evento = ?', [id_evento], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};
