"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerProductos = void 0;
const db_1 = __importDefault(require("../services/db"));
const obtenerProductos = () => {
    return new Promise((resolve, reject) => {
        db_1.default.query('SELECT * FROM productos', (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.obtenerProductos = obtenerProductos;
