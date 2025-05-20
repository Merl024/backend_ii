import { Router } from 'express'
import { passportCall,authorization } from '../utils.js'
import passport from 'passport'

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

router.get('/',
    // authToken, 
    passportCall('jwt'),
    authorization('admin'),
    (req, res) => {
        res.render("profile", {
            // user: req.session.user
            user: req.user
        })
    })


export default router