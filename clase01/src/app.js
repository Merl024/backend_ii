import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/user.router.js'

const app = express()

// Se prepara el servidor para poder recibir JSON
app.use(express.json())
app.use(urlencoded({ extended: true }))

// Router
app.use('/api/users', usersRouter)

const SERVER_PORT = 8080
app.listen(SERVER_PORT, () => {
    console.log(`Server running in ${SERVER_PORT}`);
})

const localDB = 'mongodb://localhost:27017/clase1?retryWrites=true&w=majority'
const connectMongoDB = async () => {
    try {
        await mongoose.connect(localDB)
        console.log('conectado con exito a la DB de Mongo');

    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
}
connectMongoDB()