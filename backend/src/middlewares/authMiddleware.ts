import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) return res.status(401).json({ message: 'Token no encontrado' });

    try {
        const decoded = jwt.verify(token, secret);
        (req as any).usuario = decoded; // 👈 evitar error de TypeScript
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

export const verificarAdmin = (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario; // 👈 usar "any" para evitar errores

    if (usuario?.rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso restringido solo a administradores' });
    }
    next();
};
