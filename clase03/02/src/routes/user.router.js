import { Router } from 'express'
import { authToken } from '../utils.js'

const router = new Router()

/* =====================================
=  ESTO RENDERIZA SOLO VISTAS DE HBS   =
===================================== */

router.get('/login', (req, res) => {
    res.render("login")
})

router.get('/register', (req, res) => {
    res.render("register")
})

// El middleware authToken valida y autoriza si se tiene un token.
// En caso de no tenerlo devuelve un 401

router.get('/', authToken, (req, res) => {
    res.render("profile", {
        /* 
        Se pasa primero por el middleware de authToken, ppr lo que una vez que se haya aceptado y encontrado, se renderiza la data
        */
        user: req.user
    })
})

export default router