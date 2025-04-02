import {Router, Request, Response} from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../services/productosServices';

const router = Router();

router.get('/api/products', async (req: Request, res: Response) => {
    try{
        const products = await obtenerProductos();
        res.json(products);
    }catch (err: any){
        console.log(err);
        res.status(500).json({message: 'Error al obtener los productos', error: err.message});
    }
});

router.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try{
        const producto = await obtenerProductoPorId(id);
        if (producto) {
            res.json(producto);
        } else{
            res.status(404).json({ message: 'Producto no encontrado'})
        }
    }catch (err: any){
        console.log(err);
        res.status(500).json({ message: 'Error al obtener el producto', error: err.message});
    }
})

router.post('/api/products', async (req: Request, res: Response) => {
    const producto= req.body;
    try{
        const result = await crearProducto(producto);
        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    } catch(err: any){
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message});
    }
});

router.put('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto= req.body;
    try {
        const result = await actualizarProducto(id, producto);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto actualizado correctamente', id: result.insertId });
        } else {
            res.status(404).json({ message: 'Producto no encontrado'})
        }
    } catch(err: any){
        console.error(err);
        res.status(500).json({ message: 'Error al crear los productos', error: err.message});
    }
})

router.delete('/api/products/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarProducto(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Producto eliminado'})
        } else{
            res.status(404).json({ message: 'Producto no encontrado'})
        }
    } catch(err: any){
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message});
    }
})

export default router;