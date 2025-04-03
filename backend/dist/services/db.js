<<<<<<< Updated upstream
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/db.ts
const mysql2_1 = __importDefault(require("mysql2"));
// Crear la conexión a la base de datos
const db = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaonline'
});
// Verificar si la conexión se establece correctamente
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
    }
    else {
        console.log('Conectado a la base de datos');
    }
});
exports.default = db;
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/db.ts
const mysql2_1 = __importDefault(require("mysql2"));
// Crear la conexión a la base de datos
const db = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaonline',
    port: 3306,
});
// Verificar si la conexión se establece correctamente
// @ts-ignore
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
    }
    else {
        console.log('Conectado a la base de datos');
    }
});
exports.default = db;
>>>>>>> Stashed changes
