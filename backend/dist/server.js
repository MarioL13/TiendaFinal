"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql2_1 = __importDefault(require("mysql2"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
const db = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaonline'
});
// @ts-ignore
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
    }
    else {
        console.log('Conectado a la base de datos');
    }
});
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener los usuarios');
        }
        else {
            res.json(results);
        }
    });
});
app.get('/', (req, res) => {
    res.send('API funcionando');
});
app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
