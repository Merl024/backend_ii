import { Router } from "express";
import { userModel } from '../models/user.model.js';
import { creatHash, isValidPassword, generateToken } from "../utils.js";
import passport from "passport";

const router = Router();

// REGISTER 
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    try {
        /* A partir de ahora las validaciones se haran en el passport */
        res.send([{
            status: 'Success',
            msg: 'Usuario registrado con exito',
            payload: req.user._id
        }])

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// LOGIN
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
    try {
        console.log("Usuario encontrado para login");
        const user = req.user
        console.log(user);
        
        
        // Si encontramos al usuario
        // Creamos la session del user
        // req.session.user = {
        //     name: `${req.user.firstName} ${req.user.lastName}`,
        //     email: req.user.email,
        //     age: req.user.age
        // };

        const access_token = generateToken(user)

        res.send({ status: "Succes", payload: access_token })


    } catch (error) {
        res.status(400).send({ msg: "No se pudo realizar el logueo" })
    }
})

// ENDPOINTS en caso que falle el login o el registro
router.get('/fail-register', (req, res) => {
    res.status(401).send({ msg: 'Error al registrase' })
})

router.get('/fail-login', (req, res) => {
    res.status(401).send({ msg: 'Error al loguearse' })
})

export default router