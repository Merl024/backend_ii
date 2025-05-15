import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Metodo para crear hash
export const creatHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // en genSaltSync hay que poner el costo

// Metodo para comparar hash
export const isValidPassword = (user, password) => {  
    console.log(`Datos a validar: user - password ${user.password}, password: ${password}`);
    /* El user.password es el que esta dentro de la base de datos, pero este se encuentra ya hasheado, 
    mientras que el password es la contra que pone el usuario para luego hashearlo 
    y poder comparar los hasheos con el de la base de datos */ 

    return bcrypt.compareSync(password, user.password) 
}

// JWT - por el momento se estara ocupando de forma local
const PRIVATE_KEY = 'CoderMelisaSecreto'

/*
 * Generate token JWT usando jwt.sign:
 * Primer argumento: objeto a cifrar dentro del JWT
 * Segundo argumento: La llave privada a firmar el token.
 * Tercer argumento: Tiempo de expiración del token.
 */
export const generateToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
}

export const authToken = (req, res, next) => {
    // El JWT se guarda en los header de autorizacion
    const authHeader = req.headers.authorization
    console.log("Token presente en el auth header");    
    console.log(authHeader);
    
    // Si no existe un token 
    if(!authHeader){
        return res.status(401).send({error: "Usuario no autorizado o token no encontrado"})
    }

    /* 
    Al principio del token hay un 'Bearer', pero al momento de recibirlo no nos interesa esa palabra, por lo que hacemos una split para que elimine
    esa palabra por un espacio y que continue con la siguiente posicion, que seria lo que viene despues del token 
    
    Token de demostracion
    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4MjUxMGRhZmVmYzY2OTY1ZjhmNTIxNyIsImZpcnN0TmFtZSI6Ik1lbGlzYSIsImxhc3
    ROYW1lIjoiUml2YXMiLCJlbWFpbCI6InJpdmFzbWVsaXNhMjAyNEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRCeGhuWHZwQ2xRb3laYzVSdWQ3N1Eub09QREg5N25QT
    mZHZDZ2ajRRYm1rQU5oQkhMcjQuRyIsImFnZSI6MTksInZlcnNpb24iOjB9LCJpYXQiOjE3NDcyODQ3NTUsImV4cCI6MTc0NzM3MTE1NX0.mcxTggP5Ol3uHKdd7UIWCt0lWP68e
    L1eWETJCFQr_6E

    */
    const token = authHeader.split(' ')[1] // Partir el string y obtener solo la info dentro del token

    // Validamos
    jwt.verify(token, PRIVATE_KEY, (error, credential) =>{
        if(error) return res.status(403).send({ msg: "Token invalido" })

        // SI todo esta bien entonces: 
        req.user = credential.user
        console.log(req.user);
        next()
        
    }) 
}

export default __dirname