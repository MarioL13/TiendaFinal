import {Router, Request, Response} from 'express';
import {
    obtenerCartas,
    obtenerCartaPorId,
    crearCarta,
    actualizarCarta,
    eliminarCarta,
    buscarCartasPorNombres
} from '../services/cartasServices';
import {verificarAdmin, verificarToken} from "../middlewares/authMiddleware";

const router = Router();

/**
 * @api {get} /api/cartas Listar todas las cartas
 * @apiName ObtenerCartas
 * @apiGroup Cartas
 *
 * @apiSuccess {Object[]} cartas Lista de cartas.
 * @apiError (500) ErrorServer Error al obtener las cartas.
 */
router.get('/api/cartas', async (req: Request, res: Response) => {
    try {
        const cartas = await obtenerCartas();
        res.json(cartas);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener las cartas', error: err.message})
    }
})

/**
 * @api {get} /api/cartas/:id Obtener carta por ID
 * @apiName ObtenerCartaPorId
 * @apiGroup Cartas
 *
 * @apiParam {Number} id ID de la carta.
 *
 * @apiSuccess {Object} carta Datos de la carta.
 * @apiError (404) NoEncontrada Carta no encontrada.
 * @apiError (500) ErrorServer Error al obtener la carta.
 */
router.get('/api/cartas/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const carta = await obtenerCartaPorId(id);
        if (carta) {
            res.json(carta);
        } else {
            res.status(404).json({message: 'Carta no encontrada'})
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener la carta', error: err.message})
    }
});

/**
 * @api {post} /api/cartas Crear carta (requiere token y admin)
 * @apiName CrearCarta
 * @apiGroup Cartas
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {String} nombre Nombre de la carta.
 * @apiParam {String} set_code Código del set de la carta.
 * @apiParam {Number} stock Stock disponible (entero >=0).
 * @apiParam {Number} precio Precio (>=0).
 *
 * @apiSuccess (201) {String} message Mensaje de éxito.
 * @apiSuccess (201) {Number} id ID de la carta creada.
 *
 * @apiError (400) BadRequest Campos inválidos o faltantes.
 * @apiError (404) NotFound Carta no encontrada en Scryfall.
 * @apiError (500) ErrorServer Error al crear la carta.
 */
router.post('/api/cartas', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const error = validarCarta(req.body);
    if (error) {
        return res.status(400).json({message: error});
    }

    const {nombre, set_code, stock, precio} = req.body;

    try {
        const scryfallUrl = `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(nombre)}"+set:${set_code}`;
        const response = await fetch(scryfallUrl);
        if (!response.ok) throw new Error('Scryfall no respondió correctamente');
        const data = await response.json();

        const carta = data.data?.[0];

        if (!carta) {
            return res.status(404).json({message: `Carta "${nombre}" no encontrada en el set ${set_code}`});
        }

        const cartaNueva = {
            nombre: carta.name,
            stock,
            precio,
            scryfall_id: carta.id,
            set_code: carta.set,
            collector_number: carta.collector_number,
            imagen: carta.image_uris?.normal || ''
        };

        const resultado = await crearCarta(cartaNueva);
        res.status(201).json({message: 'Carta creada desde Scryfall', id: resultado.insertId});

    } catch (err: any) {
        console.error(err);
        res.status(500).json({message: 'Error al crear carta', error: err.message});
    }
});

/**
 * @api {post} /api/cartas/lote Crear cartas en lote (requiere token y admin)
 * @apiName CrearCartasLote
 * @apiGroup Cartas
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {Object[]} cartas Array de cartas a crear.
 *
 * @apiSuccess (201) {String} message Mensaje de proceso finalizado.
 * @apiSuccess (201) {Object[]} creadas Cartas creadas con sus IDs.
 * @apiSuccess (201) {Object[]} errores Cartas que no se pudieron crear con motivo.
 *
 * @apiError (400) BadRequest Si no envían un array válido.
 */
router.post('/api/cartas/lote', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const cartas = req.body;

    if (!Array.isArray(cartas) || cartas.length === 0) {
        return res.status(400).json({message: 'Debes enviar un array de cartas'});
    }

    const resultados: any[] = [];
    const errores: any[] = [];

    for (const carta of cartas) {
        const error = validarCarta(carta);

        if (error) {
            errores.push({...carta, error});
            continue;
        }

        const {nombre, set_code, stock, precio} = carta;

        try {
            const url = `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(nombre)}"+set:${set_code}`;
            const response = await fetch(url);
            const data = await response.json();
            const resultado = data.data?.[0];

            if (!resultado) {
                errores.push({nombre, set_code, error: 'Carta no encontrada en Scryfall'});
                continue;
            }

            const cartaNueva = {
                nombre: resultado.name,
                stock,
                precio,
                scryfall_id: resultado.id,
                set_code: resultado.set,
                collector_number: resultado.collector_number,
                imagen: resultado.image_uris?.normal || ''
            };

            const insert = await crearCarta(cartaNueva);
            resultados.push({nombre, id: insert.insertId});

        } catch (err: any) {
            errores.push({nombre, set_code, error: err.message});
        }
    }

    res.status(201).json({
        message: 'Proceso de inserción finalizado',
        creadas: resultados,
        errores
    });
});


/**
 * @api {put} /api/cartas/:id Actualizar carta (requiere token y admin)
 * @apiName ActualizarCarta
 * @apiGroup Cartas
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {Number} id ID de la carta a actualizar.
 * @apiParam {String} nombre Nombre de la carta.
 * @apiParam {String} set_code Código del set.
 * @apiParam {Number} stock Stock disponible (entero >=0).
 * @apiParam {Number} precio Precio (>=0).
 *
 * @apiSuccess {String} message Mensaje de éxito.
 *
 * @apiError (400) BadRequest Campos inválidos.
 * @apiError (404) NotFound Carta no encontrada.
 * @apiError (500) ErrorServer Error al actualizar la carta.
 */
router.put('/api/cartas/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const carta = req.body;

    const error = validarCarta(carta);
    if (error) {
        return res.status(400).json({message: error});
    }

    try {
        const result = await actualizarCarta(id, carta);
        if (result.affectedRows > 0) {
            res.json({message: 'Carta actualizada'});
        } else {
            res.status(404).json({message: 'Carta no encontrada'});
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({message: 'Error al actualizar carta', error: err.message});
    }
});

/**
 * @api {delete} /api/cartas/:id Eliminar carta (requiere token y admin)
 * @apiName EliminarCarta
 * @apiGroup Cartas
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {Number} id ID de la carta a eliminar.
 *
 * @apiSuccess {String} message Mensaje de éxito.
 *
 * @apiError (404) NotFound Carta no encontrada.
 * @apiError (500) ErrorServer Error al eliminar la carta.
 */
router.delete('/api/cartas/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarCarta(id);
        if (result.affectedRows > 0) {
            res.json({message: 'Carta eliminada'});
        } else {
            res.status(404).json({message: 'Carta no encontrada'})
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({message: 'Error al eliminar la carta', error: err.message})
    }
})

/**
 * @api {post} /api/cartas/buscar-por-nombre Buscar cartas por nombre
 * @apiName BuscarCartasPorNombre
 * @apiGroup Cartas
 *
 * @apiParam {String} nombres Nombres separados por coma en el body.
 *
 * @apiSuccess {Object[]} encontradas Cartas encontradas.
 * @apiSuccess {String} mensaje Mensaje indicando cartas no encontradas o éxito.
 *
 * @apiError (400) BadRequest Si no se envían nombres.
 * @apiError (500) ErrorServer Error al buscar cartas.
 */
router.post('/api/cartas/buscar-por-nombre', async (req: Request, res: Response) => {
    const nombresRaw = req.body.nombres as string;

    if (!nombresRaw) {
        return res.status(400).json({ message: 'Debes proporcionar nombres de cartas separados por comas en el body' });
    }

    const nombres = nombresRaw.split(',').map(n => n.trim()).filter(n => n !== '');

    try {
        const { encontradas, noEncontradas } = await buscarCartasPorNombres(nombres);

        res.json({
            encontradas,
            mensaje: noEncontradas.length > 0
                ? `Cartas no encontradas: ${noEncontradas.join(', ')}`
                : 'Todas las cartas fueron encontradas'
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al buscar cartas', error: err.message });
    }
});

/**
 * Función para validar los campos obligatorios y valores de una carta
 * @param {Object} carta Objeto carta con campos nombre, set_code, stock y precio
 * @returns {string | null} Mensaje de error si hay fallo, null si está correcto
 */
function validarCarta({nombre, set_code, stock, precio}: any) {
    if (!nombre || !set_code) {
        return 'Faltan campos obligatorios: nombre o set_code';
    }

    if (stock === undefined || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        return 'Stock debe ser un número entero mayor o igual a 0';
    }

    if (precio === undefined || isNaN(precio) || precio < 0) {
        return 'Precio debe ser un número mayor o igual a 0';
    }

    return null; //bien
}

export default router;
