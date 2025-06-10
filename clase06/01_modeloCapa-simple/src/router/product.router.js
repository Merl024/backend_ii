import express from 'express';
import { getDatosController, postDatosController, deleteDatosController } from '../controller/productControles.js';

const router = express.Router();

/* Aqui no se espera que se meta directamente la logica, sino meter a un controlador que contiene la logica del cogido. 
El router de lo unico que se encarga es de llamar al controlador cuando le corresponde */

// GET
router.get('/', getDatosController);

// POST
router.post('/', postDatosController);


// DELETE
router.delete('/', deleteDatosController);





export default router;