import { Router } from "express";
import PetsService from '../services/db/pets.service.js';

const router = Router();
const petsService = new PetsService();

router.get("/", async (req, res) => {
    try {
        const pets = await petsService.getAll();
        if (!pets) {
            res.status(202).json({ message: "No pets found: " });
        }
        res.json(pets);
    } catch (error) {
        console.error("Error consultando las mascotas");
        res.status(500).send({ error: "Error consultando las mascotas", message: error });
    }
});



router.post("/", async (req, res) => {
    const { name, type } = req.body;
    try {
        const result = await petsService.save({ name: name, type: type });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar la mascota." });
    }
});

/* TRABAJANDO CON REGEX */
// Aceptamos todas las letras del alfabeto en mayus o minus y caracteres especiales. Como acentos
router.get("/:word([a-zA-Z%C3%A1%C3%A9]+)", async (req, res) => {
    try {
        console.log("Mascota despues de la busqueda: ");

        // Lo siguiente hace un busqueda en la base de datos
        // const pets = await petsService.findByName(req.params.word); // Sin router.param

        const pets = req.pet; // usando router.param

        if (!pets) {
            res.status(202).send({ message: "No pets found" });
            throw new Error('No pets found');
        }

        res.json(pets)
    } catch (error) {
        console.error('Ocurrió un error:', error.message);
    }
});

// Ruta comodin por si tiran cualquier cosa al endpoint y evita que consulte a la base de datos
router.get("*", (req, res) => {
    res.status(400).send("Cannot get that URL."); // OUTPUT: 400 Bad Reuqest
});

// ESTE PUT Funciona con el Middleware router.params
router.put("/:word([a-zA-Z%C3%A1%C3%A9%20]+)", async (req, res) => {
    try {
        const result = await petsService.update({ _id: req.pet._id }, { isAdopted: false });
        console.log(result);
        // if (!result) {
        //     res.status(500).send({ message: "The pet could not be update" });
        //     throw new Error('The pet could not be update');
        // }
        res.status(202).json(result);
    } catch (error) {
        console.error('Ocurrió un error:', error);
        // res.status(500).send({ error: error, message: "No se pudo guardar la mascota." });
    }
});

router.param("word", async (req, res, next, name) => {
    console.log("Buscando nombre de mascota con valor: " + name);
    try {
        const result = await petsService.findByName(name)
        if (!result) {
            req.pet = null
            throw new Error('No pets found')
        } else {
            req.pet = result;
        }
        next()
    } catch (error) {
        console.error('Ocurrió un error:', error.message);
        res.status(500).send({ error: "Error:", message: error.message });
    }

});

export default router;