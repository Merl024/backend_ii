import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

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

export default __dirname