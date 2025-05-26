// src/services/db.ts
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
    multipleStatements: true // ← importante para ejecutar múltiples queries
});

const sql = `
    CREATE TABLE IF NOT EXISTS Usuarios (
                                            id_usuario INT AUTO_INCREMENT PRIMARY KEY,
                                            FOTO LONGTEXT,
                                            nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        telefono VARCHAR(255) NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        rol ENUM('user', 'admin') NOT NULL DEFAULT 'user'
        );

    CREATE TABLE IF NOT EXISTS Categorias (
                                              id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                                              nombre VARCHAR(100) UNIQUE NOT NULL,
        descripcion TEXT
        );

    CREATE TABLE IF NOT EXISTS cartas (
                                          id_carta INT PRIMARY KEY AUTO_INCREMENT,
                                          nombre VARCHAR(255),
        stock INT,
        precio DECIMAL(10,2),
        scryfall_id VARCHAR(255) UNIQUE,
        set_code VARCHAR(10),
        collector_number VARCHAR(20),
        imagen TEXT
        );

    CREATE TABLE IF NOT EXISTS productos (
                                             id_producto INT AUTO_INCREMENT PRIMARY KEY,
                                             nombre VARCHAR(255) NOT NULL,
        idioma VARCHAR(100),
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        imagenes LONGTEXT
        );

    CREATE TABLE IF NOT EXISTS ProductoCategoria (
                                                     id_producto INT,
                                                     id_categoria INT,
                                                     PRIMARY KEY (id_producto, id_categoria),
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
        FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE CASCADE
        );

    CREATE TABLE IF NOT EXISTS Pedidos (
                                           id_pedido INT AUTO_INCREMENT PRIMARY KEY,
                                           id_usuario INT,
                                           fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           total DECIMAL(10,2) NOT NULL,
        estado ENUM('Pendiente', 'Pagado', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
        );

    CREATE TABLE IF NOT EXISTS DetallePedido (
                                                 id_detalle INT AUTO_INCREMENT PRIMARY KEY,
                                                 id_pedido INT,
                                                 tipo_item ENUM('producto', 'carta') NOT NULL,
        id_item INT NOT NULL,
        cantidad INT NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE
        );

    CREATE TABLE IF NOT EXISTS Deseados (
                                            id_deseado INT AUTO_INCREMENT PRIMARY KEY,
                                            id_usuario INT NOT NULL,
                                            id_carta INT DEFAULT NULL,
                                            id_producto INT DEFAULT NULL,
                                            UNIQUE (id_usuario, id_carta),
        UNIQUE (id_usuario, id_producto),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_carta) REFERENCES cartas(id_carta) ON DELETE SET NULL,
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE SET NULL
        );

    CREATE TABLE IF NOT EXISTS Carrito (
                                           id_carrito INT AUTO_INCREMENT PRIMARY KEY,
                                           id_usuario INT NOT NULL,
                                           tipo_item ENUM('producto', 'carta') NOT NULL,
        id_item INT NOT NULL,
        cantidad INT NOT NULL,
        fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
        );

    CREATE TABLE IF NOT EXISTS Eventos (
                                           id_evento INT AUTO_INCREMENT PRIMARY KEY,
                                           nombre VARCHAR(255) NOT NULL,
        juego VARCHAR(255) NOT NULL,
        fecha DATETIME NOT NULL,
        precio_inscripcion DECIMAL(10,2) DEFAULT 0.00,
        premios TEXT,
        aforo_maximo INT DEFAULT NULL,
        descripcion TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

-- INSERTS DE EJEMPLO
    INSERT IGNORE INTO Eventos (nombre, juego, fecha, precio_inscripcion, premios, aforo_maximo, descripcion)
VALUES (
    'Torneo Modern Magic',
    'Magic: The Gathering',
    '2025-06-15 16:00:00',
    10.00,
    'Sobres + cartas promocionales para el top 4',
    32,
    'Formato Moderno, partidas al mejor de 3. Es obligatorio traer mazo propio.'
);

INSERT IGNORE INTO Usuarios (FOTO, nombre, apellido, email, password, direccion, telefono, rol)
VALUES
(NULL, 'Joan', 'García', 'Joan@gmail.com', '$2a$10$RB5YAjmpDVmzevf4nheBh.VJG..GBUGpsyY5s36OVedDIqyUKHEwK', 'Calle Principal 123, Madrid', '612345678', 'user'),
(NULL, 'Mario', 'López', 'Mario@gmail.com', '$2a$10$RB5YAjmpDVmzevf4nheBh.VJG..GBUGpsyY5s36OVedDIqyUKHEwK', 'Av. del Sol 45, Barcelona', '678901234', 'admin');

INSERT IGNORE INTO Categorias (nombre, descripcion)
VALUES
('Accesorios', 'Dispositivos electrónicos y accesorios'),
('Juegos de Mesa', 'Artículos para el hogar y decoración'),
('TCG', 'Juguetes y juegos para niños y adultos');

INSERT IGNORE INTO cartas (nombre, stock, precio, scryfall_id, set_code, collector_number)
VALUES
('Ponder', 50, 3.99, 'dc69f960-68ba-4315-8146-6a7a82047503', 'TDS', '001'),
('Lightning Bolt', 100, 2.99, '77c6fa74-5543-42ac-9ead-0e890b188e99', 'CLU', '002');

INSERT IGNORE INTO productos (nombre, idioma, descripcion, precio, stock, imagenes)
VALUES
('Deckbox de Marco', 'Inglés', 'Placa frontal magnética: Cambia fácilmente la placa frontal desmontable...', 30.99, 20, '["https://reillytcg.com/cdn/shop/files/60837368-C033-4737-8BD7-FD4E8F7B6531.jpg?v=1726513463&width=1920"]'),
('Rising Sun', 'Español', 'Elige bien tus opciones para poder gobernar la tierra del Sol Naciente.', 99.99, 50, '["https://media.zacatrus.com/catalog/product/cache/f22f70ef8ee260256901b557cf6bf49a/r/i/rising1_1.png"]');

INSERT IGNORE INTO ProductoCategoria (id_producto, id_categoria)
VALUES (1, 1), (2, 2);

INSERT IGNORE INTO Pedidos (id_usuario, total, estado)
VALUES (1, 59.99, 'Pagado'), (2, 24.99, 'Pendiente');

INSERT IGNORE INTO DetallePedido (id_pedido, tipo_item, id_item, cantidad, precio)
VALUES (1, 'producto', 1, 1, 30.99), (2, 'producto', 2, 1, 99.99);

INSERT IGNORE INTO Deseados (id_usuario, id_producto)
VALUES (1, 2), (2, 1);

INSERT IGNORE INTO Carrito (id_usuario, tipo_item, id_item, cantidad)
VALUES (1, 'producto', 1, 1), (2, 'carta', 1, 2);
`;

db.connect((err: mysql.QueryError | null) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
    } else {
        console.log('Conectado a la base de datos');

        db.query(sql, (err) => {
            if (err) {
                console.error('Error al crear las tablas o insertar datos: ', err);
            } else {
                console.log('Tablas creadas e inserts ejecutados correctamente');
            }
        });
    }
});

export default db;
