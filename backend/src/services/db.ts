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
    multipleStatements: true
});

const sql = `
    DROP TABLE IF EXISTS producto_categoria;
    DROP TABLE IF EXISTS detalle_pedido;
    DROP TABLE IF EXISTS carrito;
    DROP TABLE IF EXISTS deseados;
    DROP TABLE IF EXISTS pedidos;
    DROP TABLE IF EXISTS cartas;
    DROP TABLE IF EXISTS productos;
    DROP TABLE IF EXISTS categorias;
    DROP TABLE IF EXISTS usuarios;

    create table usuarios (
                              id_usuario int auto_increment primary key,
                              foto longtext,
                              nombre varchar(100) not null,
                              apellido varchar(100),
                              email varchar(100) unique not null,
                              password varchar(255) not null,
                              direccion varchar(255) not null,
                              telefono varchar(255) not null,
                              fecha_registro datetime default current_timestamp,
                              rol enum('user', 'admin') not null default 'user'
    );

    create table categorias (
                                id_categoria int auto_increment primary key,
                                nombre varchar(100) unique not null,
                                descripcion text
    );

    create table cartas (
                            id_carta int primary key auto_increment,
                            nombre varchar(255),
                            stock int,
                            precio decimal(10,2),
                            scryfall_id varchar(255) unique,
                            set_code varchar(10),
                            collector_number varchar(20),
                            imagen text
    );

    create table productos (
                               id_producto int auto_increment primary key,
                               nombre varchar(255) not null,
                               idioma varchar(100),
                               descripcion text,
                               precio decimal(10,2) not null,
                               stock int not null,
                               imagenes longtext
    );

    create table producto_categoria (
                                        id_producto int,
                                        id_categoria int,
                                        primary key (id_producto, id_categoria),
                                        foreign key (id_producto) references productos(id_producto) on delete cascade,
                                        foreign key (id_categoria) references categorias(id_categoria) on delete cascade
    );

    create table pedidos (
                             id_pedido int auto_increment primary key,
                             id_usuario int,
                             fecha_pedido timestamp default current_timestamp,
                             total decimal(10,2) not null,
                             estado enum('pendiente', 'pagado', 'entregado', 'cancelado') default 'pendiente',
                             foreign key (id_usuario) references usuarios(id_usuario) on delete cascade
    );

    create table detalle_pedido (
                                    id_detalle int auto_increment primary key,
                                    id_pedido int,
                                    tipo_item enum('producto', 'carta') not null,
                                    id_item int not null,
                                    cantidad int not null,
                                    precio decimal(10,2) not null,
                                    foreign key (id_pedido) references pedidos(id_pedido) on delete cascade
    );

    create table deseados (
                              id_deseado int auto_increment primary key,
                              id_usuario int not null,
                              id_carta int default null,
                              id_producto int default null,
                              unique (id_usuario, id_carta),
                              unique (id_usuario, id_producto),
                              foreign key (id_usuario) references usuarios(id_usuario) on delete cascade,
                              foreign key (id_carta) references cartas(id_carta) on delete set null,
                              foreign key (id_producto) references productos(id_producto) on delete set null
    );

    create table carrito (
                             id_carrito int auto_increment primary key,
                             id_usuario int not null,
                             tipo_item enum('producto', 'carta') not null,
                             id_item int not null,
                             cantidad int not null,
                             fecha_agregado timestamp default current_timestamp,
                             foreign key (id_usuario) references usuarios(id_usuario) on delete cascade
    );

    create table eventos (
                             id_evento int auto_increment primary key,
                             nombre varchar(255) not null,
                             juego varchar(255) not null,
                             fecha datetime not null,
                             precio_inscripcion decimal(10,2) default 0.00,
                             premios text,
                             aforo_maximo int default null,
                             descripcion text,
                             creado_en timestamp default current_timestamp
    );

    insert ignore into eventos (nombre, juego, fecha, precio_inscripcion, premios, aforo_maximo, descripcion)
    values (
        'torneo modern magic',
        'magic: the gathering',
        '2025-06-15 16:00:00',
        10.00,
        'sobres + cartas promocionales para el top 4',
        32,
        'formato moderno, partidas al mejor de 3. es obligatorio traer mazo propio.'
    );

    insert ignore into usuarios (foto, nombre, apellido, email, password, direccion, telefono, rol)
    values
    (null, 'joan', 'garcía', 'joan@gmail.com', '$2a$10$RB5YAjmpDVmzevf4nheBh.VJG..GBUGpsyY5s36OVedDIqyUKHEwK', 'calle principal 123, madrid', '612345678', 'user'),
    (null, 'mario', 'lópez', 'mario@gmail.com', '$2a$10$RB5YAjmpDVmzevf4nheBh.VJG..GBUGpsyY5s36OVedDIqyUKHEwK', 'av. del sol 45, barcelona', '678901234', 'admin');

    insert ignore into categorias (nombre, descripcion)
    values
    ('accesorios', 'dispositivos electrónicos y accesorios'),
    ('juegos de mesa', 'artículos para el hogar y decoración'),
    ('tcg', 'juguetes y juegos para niños y adultos');

    insert ignore into cartas (nombre, stock, precio, scryfall_id, set_code, collector_number)
    values
    ('ponder', 50, 3.99, 'dc69f960-68ba-4315-8146-6a7a82047503', 'tds', '001'),
    ('lightning bolt', 100, 2.99, '77c6fa74-5543-42ac-9ead-0e890b188e99', 'clu', '002');

    insert ignore into productos (nombre, idioma, descripcion, precio, stock, imagenes)
    values
    ('deckbox de marco', 'inglés', 'placa frontal magnética: cambia fácilmente la placa frontal desmontable...', 30.99, 20, '["https://reillytcg.com/cdn/shop/files/60837368-C033-4737-8BD7-FD4E8F7B6531.jpg?v=1726513463&width=1920"]'),
    ('rising sun', 'español', 'elige bien tus opciones para poder gobernar la tierra del sol naciente.', 99.99, 50, '["https://media.zacatrus.com/catalog/product/cache/f22f70ef8ee260256901b557cf6bf49a/r/i/rising1_1.png"]');

    insert ignore into producto_categoria (id_producto, id_categoria)
    values (1, 1), (2, 2);

    insert ignore into pedidos (id_usuario, total, estado)
    values (1, 59.99, 'pagado'), (2, 24.99, 'pendiente');

    insert ignore into detalle_pedido (id_pedido, tipo_item, id_item, cantidad, precio)
    values (1, 'producto', 1, 1, 30.99), (2, 'producto', 2, 1, 99.99);

    insert ignore into deseados (id_usuario, id_producto)
    values (1, 2), (2, 1);

    insert ignore into carrito (id_usuario, tipo_item, id_item, cantidad)
    values (1, 'producto', 1, 1), (2, 'carta', 1, 2);
`;

db.connect((err: mysql.QueryError | null) => {
    if (err) {
        console.error('error al conectar a la base de datos: ', err);
    } else {
        console.log('conectado a la base de datos');

        db.query(sql, (err) => {
            if (err) {
                console.error('error al crear las tablas o insertar datos: ', err);
            } else {
                console.log('tablas creadas e inserts ejecutados correctamente');
            }
        });
    }
});

export default db;
