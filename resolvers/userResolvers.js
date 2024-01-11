// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************
const userModel = require('../models/user');
const courseModel = require('../models/course');
// ******************************************************************************

const resolvers = {
    Query: {
        async getUsers(obj, {page, limit}) {
            try {
                // Opciones para la paginación y populacion de los usuarios
                const options = {
                    page: page || 1,
                    limit: limit || 5,
                    sort: { _id: -1 },
                    populate: {path: "courses"}
                }

                // Obtener los usuarios de la base de datos con las opciones de paginación y populación
                const users = await userModel.paginate({}, options);

                // Retornar los usuarios obtenidos de la paginacion y populacion
                return users.docs;

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error retrieving the users: ${error}`)
            }
        },
        async getUser(obj, {id}) {
            try {
                // Obtener el usuario por id
                const user = await userModel.findById(id);

                // Retornar el usuario obtenido
                return user;

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error retrieving the user: ${error}`)
            }
        }
    },
    Mutation: {
        signUp(obj, {input}) {
            try {
                // Crear el usuario
                const user = new userModel(input);

                // Activar la funcion virtual de password para hashear el password (ver models/user.js)
                user.password = input.password;

                // Guardar el usuario
                user.save();

                // Retornar el usuario
                return user;

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error saving the user: ${error}`)
            }
        },
        async logIn(obj, {input}) {
            try {
                // Autenticar el usuario
                const user = await userModel.authenticate(input);

                // Retornar el usuario
                return user;

            } catch (error) {

                // Retornar un error si ocurre alguno
                return new Error(`There was an error logging in the user: ${error}`)
            }
        }
    }
}

// Exportar los resolvers
module.exports = {
    resolvers
};