/* POR CUESTIONES DE TIEMPO NO SE TRABAJARA CON BASE DE DATOS EN ESTE EJEMPLO. 
 No se trae directamente los productos de memoria, esta capa no se encarga de esp */

import { obtenerDatos, createDato, deleteDato } from '../services/product.service.js';

const myProducts = []

export const getDatosController = async (req, res) => {
    let datos = await obtenerDatos(); // Simulamos una llamada a una base de datos  

    res.status(200).json(datos)
}

export const postDatosController = async (req, res) => {
    let dato = req.body 

    // TODO: validar
    await createDato(dato)

    res.status(201).json({ message: 'Dato creado exitosamente', dato });
}

export const deleteDatosController = async (req, res) => {
    let { id } = req.params

    await deleteDato(id)
    res.status(200).json({ message: 'Dato eliminado exitosamente' });
}
