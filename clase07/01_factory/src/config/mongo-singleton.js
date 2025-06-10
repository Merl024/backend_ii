import mongoose from 'mongoose';
import config from './config.js';
/* Aqui es donde se accedera a la base de datos */

export default class MongoSingleton{
    static #instance

    constructor(){
        // este metodo es privado, por lo que no se puede instanciar directamente
        this.#connectMongoDB();
    }

    // Como metodo estatutoc no se instancia directamente, sino que se llama a traves de la clase
    static getInstance(){
        if(this.#instance){
            console.log('Ya existe una instancia de MongoSingleton');            
        }
        else{
            console.log('Creando una nueva instancia de MongoSingleton');
            this.#instance = new MongoSingleton();
        }

        return this.#instance;
    }
    // Estemetodo es el que resuelve la conexion a la base de datos por ello es asincronico
    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl)
            console.log('MongoDB connected successfully');
            
        } catch (error) {
            console.error("No se pudo conectar a la base de datos", error);
            process.exit();
            
        }
    }
}

