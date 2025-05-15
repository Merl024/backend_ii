import { Router } from 'express';
import cookieParser from 'cookie-parser';

const router = Router()

/*  
    Cuando se tiene una cookie sin firma, significa que el usuario la puede alterar 
    Con una cookie firmada invalida la cookie, es decir la elimina.
*/

// Cookie sin firma 
// router.use(cookieParser()) // Cuando se ocupa el .use es porque es un middleware

// Cookie firmada
router.use(cookieParser('secreto')) // Se le pasa la clave secreta para firmar la cookie

// SET cookie
router.get('/setCookie', (req, res) => {
    let data = "Esto es una cookie" // info que quiero guardar en la cookie
    
    /*  
        REQ = es cuando recibo info del cliente
        RES = es cuando le envio info al cliente 
    */
    
    // sin firma = .cookie(nombre de la cookie, lo que quiero guardar en la cookie, configuraciones de la cookie en forma de objeto)
    // res.cookie('cookieCoder', data, { maxAge: 500000, }).send({ status: "Succes", msg: "Cookie asignada con exito"}) 
    
    // con firma - signed = true
    res.cookie('cookieCoder', data, { maxAge: 60000, signed: true }).send({ status: "Succes", msg: "Cookie asignada con exito"})
})

router.get('/getCookie', (req, res) => {
    // sin firma 
    // res.send(req.cookies) // output: Esto%20es%20una%20cookie
    // en el output el %20 es un espacio en blanco

    // Con firma
    res.send(req.signedCookies) // output:Esto es una cookie.faX0RBIOtig3r8PvFt4aIwXAEtDFsC4KU8PZsNNrb0E
})

router.get('/deleteCookie', (res, req) => {
    res.clearCookie('cookieCoder').send({ status: "Success", msg: "Cookie eliminada con exito"})
})

export default router