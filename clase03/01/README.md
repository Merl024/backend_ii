# BCRYPT
En este modulo se ve como se trabaja con el hasheo de las contraseñas y como crear las funciones que se encuentran en el utils. 
En ese archivo se encuentran aquellos metodos que ocuparemos para poder comparar y crear el hasheo de las contraseñas

Por lo que los pasos para encriptar esÑ
1. Instalar bcrypt
2. Importar el modulo de bcrypt
3. Crear y exportar una variable en donde se cree el hasheo de una contraseña
    `export const createHash`
4. Crear y exportar una funcion que permita comparar el hasheo de la contraseña
    `export const isValidPassword`

De igual forma hacemos cambios en el router para pasar los middleware en el passport. 

En los JWT no hay que guardar informacion sensible. Porque es info que esta expuesta del lado del cliente

### DATOS IMPORTANTES
La serialización de Passport se refiere al proceso de convertir el objeto de usuario de Passport en una cadena que puede ser almacenada o transmitida de manera segura. Esta cadena se utiliza típicamente para mantener la sesión de usuario entre las solicitudes del cliente y el servidor. La serialización es importante para persistir la información de autenticación del usuario de una manera que sea eficiente y segura

Estas funciones permiten a Passport.js manejar la información del usuario durante el proceso de autenticación, serializando y deserializando los usuarios para almacenar y recuperar información de la sesión. Estas funciones son esenciales cuando se implementa la autenticación de usuarios en una aplicación Node.js utilizando Passport.js.

