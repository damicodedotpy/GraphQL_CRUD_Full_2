// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const jsonwebtoken = require('jsonwebtoken');
// ********************************OWN LIBRARIES*********************************
const userModel = require('../models/user');
// ******************************************************************************
module.exports = async ({ req }) => {

    // Obtener el token de la cabecera de la petición
    const token = req.headers.authorization || '';

    // Variable con el objeto json decodificado del token
    let currentUser = null;

    // Verificar si se ha enviado un token y decodificarlo
    if(token) {
        try {
            // Verificar y decodificar el token
            decodedInfo = jsonwebtoken.verify(token, process.env.SECRET_KEY);

            // Lanzar error si el token no es válido
            if(!decodedInfo) throw new Error('INVALID_TOKEN');

            // Obtener el usuario asociado al token
            currentUser = await userModel.findById(decodedInfo.id);

            // Lanzar error si el usuario no existe
            if(!currentUser) throw new Error('USER_NOT_FOUND');
            
        } catch (error) {
            // Mensaje de error standar
            let errorMessage = "There was an error trying to verifying the token";

            // Mensaje de error personalizado: token no válido
            if(error.message == "INVALID_TOKEN") errorMessage = "The token is invalid, expired, manipulated or has been not provided";

            // Mensaje de error personalizado: usuario no encontrado
            if(error.message == "USER_NOT_FOUND") errorMessage = "The user associated to the token was not found";

            // Retornar el token, el usuario y el mensaje de error
            return { token, currentUser, errorMessage };
        }
    }
    // Retornar el token y el usuario
    return { token, currentUser };
}