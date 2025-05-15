import { Router } from "express";
import { userModel } from '../models/user.model.js';

const router = Router();

// REGISTER 
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, age } = req.body;
        console.log('Registrando un nuevo usario');
        console.log(req.body);
        
        // Verifica si el usuario registrandose ya existe
        const userExist = await userModel.findOne({ email })
        if (userExist) { return res.status(400).send({ msg: 'Este usuario ya existe' }) }
        
        // Crea el nuevo usuario
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            age
        }

        const result = await userModel.create(newUser)
        res.send([{
            status: 'Success',
            msg: 'Usuario registrado con exito',
            payload: result.id
        }])
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    try {
        // Pedimos primero que ingrese datos al cuerpo del handlebars
        const {email, password } = req.body

        // Luego lo buscamos
        const user = await userModel.findOne({ email, password })

        // Si encontramos al usuario
        // Creamos la session del user
        req.session.user = {
            name: `${user.firstName} ${user.lastName}`,
            email: `${user.email}`,
            age: `${user.age}`
        }

        res.send({ status: "Succes", payload: req.session.user, msg:"Primer logueo realizado" })


    } catch (error) {
        res.status(400).send({ msg: "No se pudo realizar el logueo" })
    }
})

export default router