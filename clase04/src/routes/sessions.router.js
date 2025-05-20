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

// LOGIN / passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }

        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);


        // Creamos la cookie y almacenamos el access_token en la cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie
        })

        res.send({ status: "Login success" });

    } catch (error) {
        res.status(400).json({ error: error.message });
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