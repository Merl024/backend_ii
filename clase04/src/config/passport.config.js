// Aqui es donde vamos a cargar las estrategias 

import passport from 'passport'
import passportLocal from 'passport-local'
import jwtStrategy from 'passport-jwt'
import { creatHash, isValidPassword, PRIVATE_KEY } from '../utils.js'
import { userModel } from '../models/user.model.js'
import router from '../routes/user.router.js'

// Declaramos la estrategia
const localStrategy = passportLocal.Strategy

// JWT 
const JwtStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt

// Funcion para inicializar passport y definir las estrategias de autenticidad
const initializePassport = () => {
    
  // Register
    passport.use('register', new localStrategy(
      // Esto es un objeto de configuracion
      {
        passReqToCallback: true, 
        usernameField: 'email',
      },
      /**
       * @param req: request
       * @param username: email
       * @param password: password
       * @param done: callback
       */
      async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        console.log("Registrando usuario:");
        console.log(req.body);
        
        try {
          // Verifico si el user que me pasan ya existe
          const userExists = await userModel.findOne({ email })
          if (userExists) {
            console.log("El usuario ya existe.");
            return done(null, false); // Retorna `false` indicando que la autenticación falló
          }
          
          /* Como la autenticacion fallo es que se pone false, sino se devolveria el usuario */
          const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: creatHash(password) // Hasheamos la contraseña
        }
          
        const result = await userModel.create(newUser)
        return done(null, result)

        } catch (error) {
          /** Aqui se esta manejando el error, es que no se pone done(null) */
          return done("Error al registrar el usuario" + error)
        }
      }
    ))

    // Login

    /* =====================================
    =            JWTSTRATEGY              =
    ===================================== */

  passport.use('jwt', new JwtStrategy(
    {
      // Extra de una cookie el JWT. Es decir que ahora el JWT ya no queda al aire, sino que se almacenaba en una cookie. 
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),

      // Key con la que fue firmada el JWT
      secretOrKey: PRIVATE_KEY
    },
    async (jwt_payload, done) => {
      console.log("Entrando a passport Strategy con JWT.");
      try {
        console.log("JWT obtenido del Payload");
        console.log(jwt_payload);

        return done(null, jwt_payload.user)
      } catch (error) {
        return done(error)
      }
    }
  ))


    /**
     * 📌 Estrategia de Login de Usuarios
     * Utilizamos 'login' como identificador de esta estrategia.
    
    passport.use('login', new localStrategy(
      {
        passReqToCallback: true, 
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username }) 
          console.log("Usuario encontrado para login");
          console.log(user);
          
          if (!user) {
            console.log("El usuario no existe bajo el username de " + username);
            return done(null, false)
          }

          // Valida si la contraseña es correcta
          if(!isValidPassword(user, password)){
            return done(null, false, { message: "Credenciales incorrectas" }) 
          }
          
          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    ))
    */ 
   // TODO :: OJO si usamos passport-jwt lo reemplamzamos por login(localStrategy)
  
    
    /*
    * 📌 Serialización del Usuario
    * Se ejecuta después de una autenticación exitosa.
    * Passport almacena solo el `user._id` en la sesión en lugar de todo el objeto usuario.
    * 
    * Estos metodos siempre se dejan, independiente de que estrategia es
    */
   passport.serializeUser((user, done) => {
    /**
     * @param null captura el error
     * @param user._id id del usuario traido de mongo
     */
    done(null, user._id)
   })
   passport.deserializeUser( async (id, done) => {
    try {
        let user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        console.error("Error al deserializar el usuario:", error);
        
    }
   })
}

// CREAMOS EL COOKIEEXTRACTOR
const cookieExtractor = req => {
  let token = null;

  console.log("Entrando a Cookie Extractor");

  if (req && req.cookies) {//Validamos que exista el request y las cookies.
    console.log("Cookies presentes: ");
    console.log(req.cookies);

    token = req.cookies['jwtCookieToken']
    console.log("Token obtenido desde Cookie:");
    console.log(token);
  }
  return token;
}


export default initializePassport