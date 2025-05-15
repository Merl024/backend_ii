// Aqui es donde vamos a cargar las estrategias 

import passport from 'passport'
import passportLocal from 'passport-local'
import { creatHash, isValidPassword } from '../utils.js'
import { userModel } from '../models/user.model.js'

// Declaramos la estrategia
const localStrategy = passportLocal.Strategy

// Funcion para inicializar passport y definir las estrategias de autenticidad
const initializePassport = () => {
    // Register
    /* Inicializando la estrategia local, username sera para nosotros email. 
     * Done será nuestro callback
    */  

    passport.use('register', new localStrategy(
      // Esto es un objeto de configuracion
      {
        // Permite acceder al objeto `req` dentro de la función de autenticación
        passReqToCallback: true, 
        // Definimos que el "username" será el campo "email"
        usernameField: 'email',
      },

        /*
        * 📌 Callback de autenticación
        * Recibe el request, el username (email), la contraseña y la función `done`
        */
      async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        console.log('Registrando un nuevo usario');
        console.log(req.body);

        
        try {
          const userExist = await userModel.findOne({ email })
          if (userExist) { 
            console.log("El usuario ya existe");
            return done(null, false, { message: 'Este usuario ya existe' })
            /* Como la autenticacion fallo es que se pone false, sino se devolveria el usuario */
            
          }

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
    /**
     * 📌 Estrategia de Login de Usuarios
     * Utilizamos 'login' como identificador de esta estrategia.
     */
      
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


export default initializePassport