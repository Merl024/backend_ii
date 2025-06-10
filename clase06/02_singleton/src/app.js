import express from 'express';
import config from './config/config.js';
import routerProduct from './router/product.router.js';
import MongoSingleton from './config/mongo-singleton.js'
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cualquier cliente puede acceder a la API
// app.use(cors())

// Cuando queremos que ciertos clientes con ciertas IPs puedan acceder a la API
const corsOptions = {
    // Permitir solo solicitudes desde un cliente específico
    origin: 'http://127.0.0.1:5500',

    // Configura los métodos HTTP permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    // Configura las cabeceras permitidas
    allowedHeaders: 'Content-Type,Authorization',

    // Configura si se permiten cookies en las solicitudes
    credentials: true,
};
app.use(cors(corsOptions));


// ROUTER
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test endpoint is working!' });
})

app.use('/api', routerProduct)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})



const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.log(error);
    }
}
mongoInstance();

/* En cambio con las instancias se detecta que ya se ha creado una conexion a la base de datos, al detectarla una vez, no lo vuelve a hacer, sino que manda un log avisando que ya se ha creado la conexion

En el caso de hacerlo sin singleton, no detecta si hay mas de una conexion a la base de datos, simplemente proceder sin ninguna validacion */

// const mongoInstance2 = async () => {
//     try {
//         await MongoSingleton.getInstance()
//     } catch (error) {
//         console.log(error);
//     }
// }
// mongoInstance2();

// Sin singleton - conexion directa
// const connectMongoDB = async () => {
//     try {
//         await mongoose.connect(config.mongoUrl);
//         console.log("Conectado con exito a MongoDB usando Moongose en app.js");
//     } catch (error) {
//         console.error("No se pudo conectar a la BD usando Moongose: " + error);
//         process.exit();
//     }
// };
// connectMongoDB();
// connectMongoDB(); // Esto no se debe hacer, ya que se esta creando una nueva conexion a la base de datos cada vez que se llama a la funcion