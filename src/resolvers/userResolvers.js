// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { v4: uuidv4 } = require( "uuid" );
// ********************************OWN LIBRARIES*********************************
const courseModel = require( '../models/course' );
const userModel = require( '../models/user' );
const mongoose = require( 'mongoose' );
// ******************************************************************************
const login = async( _, { input } ) => {
    try {
        // Verificar si el usuario existe en la base de datos
        const user = await userModel.authenticate( input );

        // Retornar el usuario si existe
        return user;

    } catch ( error ) {
        // Retornar un error si ocurre alguno
        return new Error( `There was an error logging in the user: ${ error }` )
    }

}

const singup = async( _, { input } ) => {
    try {
        // Crear el usuario
        var user = new userModel( { _id: uuidv4(), ...input } );
        
        // Activar la funcion virtual de password para hashear el password (ubicada en models/user.js)
        user.password = input.password;

        // Retornar el usuario
        return await user.save();

    } catch ( error ) {
        // Retornar un error si ocurre alguno
        return new Error( `There was an error saving the user: ${ error }` )
    }
}

async function users( _, { options = {} }, context) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Crear el query para la busqueda de los usuarios
        let query = {};
        // Desestructurar las opciones de paginacion y limitacion si existen
        let { id = null, page = 1, limit = 5 } = options;
        // Agregar el id al query si existe
        if ( id !== null ) query._id = String( id );
        
        // Crear opciones de aggregate para la busqueda de los usuarios
        const aggregate = [
            { $match: query },
            { $skip: ( (page - 1 ) * limit ) },
            { $addFields: { "id": "$_id" } },
            { $limit: limit },
            { $lookup: {
                from: 'courses',
                localField: 'courses',
                foreignField: '_id',
                as: 'courses'
            } },
        ];

        // Obtencion de los usuarios de la base de datos
        const users = await userModel.aggregate( aggregate );

        // Retornar los usuarios obtenidos
        return users;

    } catch ( error ) {
        // Lanzar error si ocurre alguno al obtener los usuarios
        throw new Error( `There was an error retrieving the users: ${ error }` )
    }
}

async function updateUser( _, { id, input }, context ) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Obtener el usuario por id
        let user = await userModel.findOne( { "_id": id } );

        // Lanzar error si el usuario no existe
        if( !user ) throw new Error( "User not found" );
        
        // Verificar si el nuevo email del usuario es valido
        user.email = input.email;

        // Si un password nuevo fue recibido, hashearlo y guardarlo en la base de datos
        if( input.password ) user.password = input.password;

        // Guardar los cambios del usuario en la base de datos
        await user.save();

        // Retornar el usuario
        return user;

    } catch (error) {
        throw new Error( `There was an error updating the user: ${ error }` )
    }
}

async function deleteUser( _, { id }, context ) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Obtener el usuario por id y eliminarlo de la base de datos
        const user = await userModel.findOneAndDelete( { "_id": id } );

        // Obtener los IDs de los cursos del usuario elimidado
        const coursesID = user.courses;

        // Iterar sobre cada ID de curso y actualizar el campo "user" a vacío
        coursesID.forEach( async ( id ) => {
            const course = await courseModel.findOneAndUpdate( { "_id": id }, { "user": "" } );
            course.save();
        })

        // Retornar un mensaje de éxito
        return { message: "User deleted successfully" };

    } catch (error) {
        // Lanzar un error si ocurre alguno durante el proceso
        throw new Error( `There was an error deleting the user: ${ error }` );
    }
}

// Resolver para responder al campo courses del type User (Resolver de segundo nivel)
async function courses( user ) {
    try {
        // Crear opciones de aggregate para la busqueda de los cursos
        const aggregate = [
            { $match: { "user": user.id } },
            { $addFields: { "id": "$_id" } }
        ]

        // Obtencion de los cursos de la base de datos
        const result = await courseModel.aggregate( aggregate );

        // Retornar los cursos obtenidos
        return result;

    } catch ( error ) {
        // Retornar un error si ocurre alguno
        return new Error( `There was an error retrieving the courses: ${ error }` )
    }
}

// Crear objeto de resolvers para los usuarios
const resolvers = {
    User: {
        courses
    },
    Query: {
        users
    },
    Mutation: {
        singup,
        login,
        updateUser,
        deleteUser
    },
}

// Exportar los resolvers
module.exports = resolvers