"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usuarios_1 = __importDefault(require("./routes/usuarios")); // Importa las rutas
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Para poder recibir datos JSON en el cuerpo de las solicitudes
// Usar las rutas de usuarios
app.use(usuarios_1.default);
app.get('/', (req, res) => {
    res.send('API funcionando');
});
app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
