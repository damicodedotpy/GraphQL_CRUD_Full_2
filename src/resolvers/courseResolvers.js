// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { v4: uuidv4 } = require('uuid');
// ********************************OWN LIBRARIES*********************************
const courseModel = require("../models/course"); 
const userModel = require("../models/user");
// ******************************************************************************
async function courses( _, { options = {} }, context ) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Crear el query para la busqueda de los cursos
        const query = {};

        // Desestructurar las opciones de paginacion y limitacion si existen
        const { id = null, page = 1, limit = 5 } = options;

        // Agregar el id al query si existe
        if ( id !== null ) query._id = String( id );

        // Crear opciones de aggregate para la busqueda de los cursos
        const aggregate = [
            { $match: query },
            { $skip: ( ( page - 1 ) * limit ) },
            { $limit: limit },
            { $addFields: { "id": "$_id" } }
        ]

        // Obtencion de los cursos de la base de datos
        const result = await courseModel.aggregate( aggregate );
        
        // Retornar los cursos obtenidos
        return result;
        
    } catch (error) {
        // Retornar un error si ocurre alguno
        return new Error(`There was an error retrieving the courses: ${error}`);
    }
};

async function addCourse( _, { input }, context ) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Crear una instancia del modelo Course
        const course = new courseModel( { _id: uuidv4(), user: context.currentUser._id, ...input } );

        // Guardar el curso en la base de datos
        await course.save();

        // Obtener el usuario por id
        const userObject = await userModel.findById( context.currentUser._id );
        
        // Agregar el curso al usuario
        await userObject.courses.push( course );
        
        // Guardar el usuario en la base de datos
        await userObject.save();
                
        // Retornar el curso guardado
        return course;

    } catch (error) {
        // Retornar un error si ocurre alguno
        return new Error(`There was an error saving the course: ${error}`);
    };
};

async function updateCourse( _, { id, input }, context ) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Buscar y actualizar el curso por id
        const courseUpdated = await courseModel.findOneAndUpdate( { "_id": id }, input, { new: true } );

        // Retornar el curso actualizado
        return courseUpdated

    } catch ( error ) {
        // Retornar un error si ocurre alguno
        return new Error( `There was an error updating the course: ${error}` )
    };
};

async function deleteCourse( _, { id }, context ) {
    try {
        // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
        if( !context || !context.currentUser ) throw new Error( "Authentication is required" );

        // Buscar y eliminar el curso por id
        const removeCourse = await courseModel.findByIdAndDelete( id );

        // Eliminar el curso de la lista de cursos del usuario logueado
        const removeCourseFromUser = await userModel.updateOne( { "_id": context.currentUser._id }, { $pull: { "courses": id } } );

        // Retornar el curso eliminado
        return { message: `The course "${removeCourse.title}" was deleted` };

    } catch ( error ) {
        // Retornar un error si ocurre alguno
        return new Error( `There was an error deleting the course: ${error}` )
    };
};

// Resolver para responder al campo user del type Course (Resolver de segundo nivel)
async function user( course ) {
    try {
        // Obtener el usuario por id
        const userObject = await userModel.findOne( { "_id": course.user } );
        
        console.log( { NUEVOOO: userObject })

        // Retornar el usuario
        return userObject;


    } catch (error) {
        // Retornar un error si ocurre alguno
        return new Error(`There was an error retrieving the user: ${error}`);
    };
};

// Crear objeto de resolvers para los cursos
const resolvers = {
    Course: {
        user,
    },
    Query: {
        courses,
    },
    Mutation: {
        addCourse,
        updateCourse,
        deleteCourse
    }
};

// Exportar los resolvers
module.exports = resolvers;


