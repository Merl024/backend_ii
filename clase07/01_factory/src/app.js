import express from 'express';
import __dirname from './utils.js';
import config from './config/config.js';
import MongoSingleton from './config/mongo-singleton.js'
import cors from 'cors';

// ROUTERS IMOPRTS
// import routerProduct from './router/product.router.js';
import studentRouter from './router/students.router.js';
import coursesRouter from './router/courses.router.js';

const app = express();
const PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cuando queremos que ciertos clientes con ciertas IPs puedan acceder a la API
// const corsOptions = {
//     // Permitir solo solicitudes desde un cliente específico
//     origin: 'http://127.0.0.1:5500',

//     // Configura los métodos HTTP permitidos
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

//     // Configura las cabeceras permitidas
//     allowedHeaders: 'Content-Type,Authorization',

//     // Configura si se permiten cookies en las solicitudes
//     credentials: true,
// };
// app.use(cors(corsOptions));


// ROUTERS
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test endpoint is working!' });
}) 

// app.use('/api', routerProduct)
app.use('/api/students', studentRouter)
app.use('/api/courses', coursesRouter)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
