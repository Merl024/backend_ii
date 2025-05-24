import { Router } from "express";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../../utils.js";

/* DESARROLLO DE LAS FUNCIONALIDADES PARA USERS.EXTEND.ROUTER */
export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    };

    getRouter() {
        return this.router;
    }

    // Metodo vacio
    init() { } //Esta inicialilzacion se usa para las clases heredadas.

    /*########## Customizar los metodos HTTP ##########*/
    get(path, policies, ...callbacks) {
        console.log("Entrando por GET a custom router con Path: " + path);
        console.log(policies);

        this.router.get(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.router.post(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };

    put(path, policies, ...callbacks) {
        this.router.put(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    };

    handlePolicies = policies => (req, res, next) => {
        console.log("Politicas a evaluar:");
        console.log(policies);

        //Validar si tiene acceso publico:
        /* Las policies es un array, por lo que en este caso el PUBLIC esta
        en la posicion 0. Por lo que si pasa por este endpoint, lo deja pasar */
        if (policies[0] === "PUBLIC") return next()

        //El JWT token se guarda en los headers de autorización.
        const authHeader = req.headers.authorization;
        console.log("Token present in header auth:");
        console.log(authHeader);

        if (!authHeader) {
            return res.status(401).send({ error: "User not authenticated or missing token." });
        }

        const token = authHeader.split(' ')[1] //Se hace el split para retirar la palabra Bearer.

        // validamos el token
        jwt.verify(token, PRIVATE_KEY, (error, credenciales) => {
            // Lo primero que hacemos es validar el error
            if (error) return res.status(403).send("Token invalid, Unauthorized!")

            // En credenciales va a estar la data del token y ese seria el payload
            const user = credenciales.user

            // Preguntamos si dentro del array policies se encuentra el user.role que me esta llegando con este usuario
            if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ error: "El usuario no tiene privilegios, revisa tus roles!" });

            // si el user.role se encuentra dentro de policies, podes ingresar
            req.user = user
            console.log(req.user);
            next();
        })
    }

    /* En vez de mandar las respuestas de forma nativa, buscamos mandarle las respuestas
    lo mas customizadas posible */
    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({ status: "Success", payload });
        res.sendInternalServerError = error => res.status(500).send({ status: "Error", error });
        res.sendClientError = error => res.status(400).send({ status: "Client Error, Bad request from client.", error });
        res.sendUnauthorizedError = error => res.status(401).send({ error: "User not authenticated or missing token." });
        res.sendForbiddenError = error => res.status(403).send({ error: "Token invalid or user with no access, Unauthorized please check your roles!" });

        next();

    }
    /* applyCallbacks solo prepara cada callback para que Express los ejecute en orden.
Express es quien los ejecuta uno tras otro cuando llega la petición, no el método applyCallbacks directamente.
Si un callback termina la respuesta (por ejemplo, con res.send()), los siguientes ya no se ejecutan.
Si un callback llama a next(), pasa al siguiente. */

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                console.error(error);
                // params[1] hace referencia al res
                params[1].status(500).send(error);
            }
        });
    };



};