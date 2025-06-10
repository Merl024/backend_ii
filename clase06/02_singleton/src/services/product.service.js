import { recuperarDatos, guardarDato, deleteById } from '../models/productsData.js';

export const obtenerDatos = async () => {
    return await recuperarDatos();
}
export const createDato = async (dato) => {
    // logica de negocio.
    // validar si el producto ya existe.

    dato.id = Math.random() // Simulamos un ID único

    await guardarDato(dato);
    return dato;
}
export const deleteDato = async (id) => {
    return await deleteById(id);
}