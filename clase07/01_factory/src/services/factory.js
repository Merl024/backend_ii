/* Fabrica instanciasde la clase que tiene todo lo referente a mongo o la manipulacion de archivos en general. 
Es un switch que fabrica las instancias hacia las persistencias que queremos tomar  */
import MongoSingleton from "../config/mongo-singleton.js";
import config from "../config/config.js";

let studentService
let coursesService

async function initializeMongoService() {
    console.log("Initializing MongoDB Service..."); 
    try {
        await MongoSingleton.getInstance() // Inicializa la conexión a MongoDB
    } catch (error) {
        console.error("Error initializing MongoDB Service:", error);
        process.exit(1);
    }
}

/* Desde el cofig le mandamos la configuracion de la persistencia que queremos usar y dependiendo de eso se inicializan los servicios correspondientes
Si no se especifica nada, por defecto se usa mongo
Si se especifica un tipo de persistencia, se inicializa el servicio correspondiente */
switch(config.persistence){
    case 'mongo': 
        // conexion a la BD
        initializeMongoService() 

        // Imports dinamicos de los DAOs
        const { default: StudentServiceMongo } = await import('./dao/mongo/students.service.js');
        const { default: CoursesServiceMongo } = await import('./dao/mongo/courses.service.js');
        
        studentService = new StudentServiceMongo() 
        console.log("StudentServiceMongo initialized successfully");
        console.log(studentService);
        
        coursesService = new CoursesServiceMongo()
        console.log("CoursesServiceMongo initialized successfully");
        console.log(coursesService);
        break
    
    case 'file': 
        const { default: StudentServiceFileSystem } = await import('./dao/filesystem/students.service.js');
        const { default: CoursesServiceFileSystem } = await import('./dao/filesystem/coruses.service.js');
        
        studentService = new StudentServiceFileSystem() 
        console.log("StudentServiceMongo initialized successfully");
        console.log(StudentServiceFileSystem);
        
        coursesService = new CoursesServiceFileSystem()
        console.log("CoursesServiceMongo initialized successfully");
        console.log(StudentServiceFileSystem);
        break

    case 'sql':
        // logica
    default: 
        break
}

export {
    studentService,
    coursesService
}