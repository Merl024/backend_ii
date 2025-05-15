import { Router } from 'express';
import { userModel } from '../models/user.model.js';

const router = Router();

// GET
router.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        console.log(users);
        res.status(200).json({ status: 'success', payload: users });        
    } catch (error) {
        res.status(500).json({ status: 'No se pudo obtener los usuarios con mongoose', error: error.message });
    }
})

// POST
router.post('/', async (req, res) => {
    try {
        // Esto sale del user.schema 
        const { firstName, lastName, email, password, age } = req.body;
        const user = await userModel.create({ firstName, lastName, email, password, age})
        res.status(201).json({ status: 'success', payload: user._id });
    
    } catch (error) {
        res.status(500).json({ status: 'No se pudo crear el usuario con mongoose', error: error.message });    
    }
})

// PUT 
router.put('/:id', async(req, res) => {
    try {
        let userUpdate = req.body;
        // La diferencia cuando ocupamos updateOne es que solo devuelve el estado de la operacion, no el objeto actualizado
        // Para ser conciso cuando ya tienes el ID, adema de agregar el new = true. Para que devuelva el objeto actualizado
        let user = await userModel.findByIdAndUpdate(req.params.id, userUpdate, {new: true});
        res.status(200).send({ status: 'success', payload: user });
    } catch (error) {
        res.status(500).send({ status: 'No se pudo actualizar el usuario con mongoose', error: error.message });
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        let result = await userModel.findOneAndDelete({ _id: req.params.id })
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'No se pudo eliminar el usuario con mongoose', error: error.message });
    }
})

export default router;