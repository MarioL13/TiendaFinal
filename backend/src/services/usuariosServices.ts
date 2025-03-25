import db from './db';  // Importa la conexión a la base de datos

// Obtener todos los usuarios
export const obtenerUsuarios = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios', (err: Error, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err: Error, results: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]); // Solo un resultado
            }
        });
    });
};

// Crear un nuevo usuario
export const crearUsuario = (usuario: any): Promise<any> => {
    const { nombre, FOTO, email, password, direccion, telefono } = usuario;
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db.query('INSERT INTO usuarios (nombre, FOTO, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, FOTO, email, password, direccion, telefono],
            (err: Error, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
};

// Actualizar un usuario
export const actualizarUsuario = (id: number, usuario: any): Promise<any> => {
    const { nombre, FOTO, email, password, direccion, telefono } = usuario;
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db.query('UPDATE usuarios SET nombre = ?, FOTO = ?, email = ?, password = ?, direccion = ?, telefono = ? WHERE id_usuario = ?',
            [nombre, FOTO, email, password, direccion, telefono, id],
            (err: Error, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
};

// Eliminar un usuario
export const eliminarUsuario = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err: Error, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
