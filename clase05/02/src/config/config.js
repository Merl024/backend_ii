import dotenv from 'dotenv';
import program from '../process.js';

/** Dependiendo del entorno, es el puerto que va acceder */

// const environment = "production"; // accede al pueto de produccion
const environment = program.opts().mode; // accede al puerto de development

// dotenv.config(); // accede al puesto generico
dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});


export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD
};