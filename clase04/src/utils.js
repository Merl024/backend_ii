import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Metodo para crear hash
export const creatHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // en genSaltSync hay que poner el costo

// Metodo para comparar hash
export const isValidPassword = (user, password) => {  
    console.log(`Datos a validar: user - password ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password) // <-- CORRECTO: plain, hash
}

// JWT - por el momento se estara ocupando de forma local
export const PRIVATE_KEY = 'CoderMelisaSecreto'

/*
 * Generate token JWT usando jwt.sign:
 * Primer argumento: objeto a cifrar dentro del JWT
 * Segundo argumento: La llave privada a firmar el token.
 * Tercer argumento: Tiempo de expiración del token.
 */
export const generateToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
}

// Se comporta como middleware
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ", strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);

            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }

            console.log("Usuario obtenido del strategy: ");
            console.log(user);

            req.user = user
            next()
        })(req, res, next);
    }
}

// para manejo de Auth
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next()
    }
}


/* export const authToken = (req, res, next) => {
    // El JWT se guarda en los header de autorizacion
    const authHeader = req.headers.authorization
    console.log("Token presente en el auth header");    
    console.log(authHeader);
    
    // Si no existe un token 
    if(!authHeader){
        return res.status(401).send({error: "Usuario no autorizado o token no encontrado"})
    }

    
    Al principio del token hay un 'Bearer', pero al momento de recibirlo no nos interesa esa palabra, por lo que hacemos una split para que elimine
    esa palabra por un espacio y que continue con la siguiente posicion, que seria lo que viene despues del token 
    
    Token de demostracion
    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

    const token = authHeader.split(' ')[1] // Partir el string y obtener solo la info dentro del token

    // Validamos
    jwt.verify(token, PRIVATE_KEY, (error, credential) =>{
        if(error) return res.status(403).send({ msg: "Token invalido" })

        // SI todo esta bien entonces: 
        req.user = credential.user
        console.log(req.user);
        next()
        
    }) 
} */

export default __dirname