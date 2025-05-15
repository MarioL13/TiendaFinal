"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmarCompra = void 0;
const db_1 = __importDefault(require("./db"));
const carritoServices_1 = require("./carritoServices");
const confirmarCompra = (id_usuario, tipoPago) => {
    return new Promise((resolve, reject) => {
        db_1.default.beginTransaction((err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return reject(err);
            if (!['tienda', 'online'].includes(tipoPago)) {
                return db_1.default.rollback(() => reject(new Error('Tipo de pago inválido.')));
            }
            try {
                const carrito = yield (0, carritoServices_1.obtenerCarritoCompletoUsuario)(id_usuario);
                if (carrito.length === 0) {
                    return db_1.default.rollback(() => reject(new Error('El carrito está vacío.')));
                }
                const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
                db_1.default.query(`INSERT INTO Pedidos (id_usuario, total, estado)
                     VALUES (?, ?, ?)`, [id_usuario, total, tipoPago === 'tienda' ? 'Pendiente' : 'Pagado'], (err, result) => {
                    if (err)
                        return db_1.default.rollback(() => reject(err));
                    const id_pedido = result.insertId;
                    const detallesQuery = `
                            INSERT INTO DetallePedido (id_pedido, tipo_item, id_item, cantidad, precio)
                            VALUES (?, ?, ?, ?, ?)
                        `;
                    const detallesPromises = carrito.map(item => {
                        return new Promise((res, rej) => {
                            db_1.default.query(detallesQuery, [id_pedido, item.tipo_item, item.id_item, item.cantidad, item.precio], (err) => {
                                if (err)
                                    return rej(err);
                                res(null);
                            });
                        });
                    });
                    Promise.all(detallesPromises)
                        .then(() => __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            yield (0, carritoServices_1.vaciarCarrito)(id_usuario);
                            db_1.default.commit(err => {
                                if (err)
                                    return db_1.default.rollback(() => reject(err));
                                resolve({ success: true, mensaje: 'Pedido confirmado', id_pedido });
                            });
                        }
                        catch (err) {
                            db_1.default.rollback(() => reject(err));
                        }
                    }))
                        .catch(err => db_1.default.rollback(() => reject(err)));
                });
            }
            catch (err) {
                db_1.default.rollback(() => reject(err));
            }
        }));
    });
};
exports.confirmarCompra = confirmarCompra;
