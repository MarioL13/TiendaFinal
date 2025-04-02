import { Router, Request, Response} from 'express';
import {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from '../services/categoriasServices';

const router = Router();

router.get('/api/categorias', async (req: Request, res: Response) => {
    try{
        const categorias = await obtenerCategorias();
        res.json(categorias);
    }catch(err: any){
        console.log(err);
        res.status(500).json({ message: 'Error al obtener las categorias', error: err.message });
    }
})

router.get('/api/categorias/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const categoria = await obtenerCategoriaPorId(id);
        if (categoria) {
            res.json(categoria);
        } else{
            res.status(404).json({message: 'No se encontrado'});
        }
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: 'Error al obtener las categorias', error: err.message});
    }
})

router.post('/api/categorias', async (req: Request, res: Response) => {
    const categoria = req.body;
    try{
        const result = await crearCategoria(categoria);
        res.status(201).json({message: 'Categoria creada', id: result.insertId});
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: 'Error al obtener las categorias', error: err.message});
    }
});

router.put('/api/categorias/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = req.body;
    try{
        const result = await actualizarCategoria(id, categoria);
        if (result.affectedRows > 0) {
            res.status(200).json({message: 'Categoria actualizado', id: result.insertId});
        }else{
            res.status(404).json({message: 'No se encontrado'});
        }
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: 'Error al obtener la categorias', error: err.message});
    }
})

router.delete('/api/categorias/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try{
        const result = await eliminarCategoria(id);
        if (result.affectedRows > 0) {
            res.json({message: 'Categoria Eliminada'});
        }else{
            res.status(404).json({message: 'No se encontrado'});
        }
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: 'Error al obtener la categorias', error: err.message});
    }
});
export default router;