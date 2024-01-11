// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************
const courseModel = require("../models/course");
const userModel = require("../models/user");
// ******************************************************************************
const resolvers = {
    Query: {
        async getCourses(obj, {page, limit}, context) {
            try {
                // Verificar si hay contexto y contiene un usuario autenticado, sino lanzar un error
                if(!context || !context.currentUser) throw new Error("Authentication is required");
                
                // Opciones para la paginación y populacion de los cursos
                const options = {
                    page: page || 1,
                    limit: limit || 5,
                    sort: { _id: -1 },
                    populate: {path: "user"}
                }

                // Obtener los cursos de la base de datos con las opciones de paginación y populación
                const courses = await courseModel.paginate({}, options);

                // Retornar los cursos obtenidos de la paginacion y populacion
                return courses.docs;

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error retrieving the courses: ${error}`);
            }
        },
        async getCourse(obj, {id}) {
            try {
                // Obtener el curso por id
                const course = await courseModel.findById(id);

                // Retornar el curso obtenido
                return course.toObject();

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error retrieving the course: ${error}`);
            }
        }
    },
    Mutation: {
        async addCourse(obj, {input, user}) {
            try {
                // Crear una instancia del modelo Course
                const course = new courseModel({...input, user});

                // Guardar el curso en la base de datos
                await course.save();

                // Obtener el usuario por id
                const userObject = await userModel.findById(user);

                // Agregar el curso al usuario
                await userObject.courses.push(course);

                // Guardar el usuario en la base de datos
                await userObject.save();

                // Retornar el curso guardado
                return course.toObject();

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error saving the course: ${error}`);
            }
        },
        async updateCourse(obj, {id, input}) {
            try {
                // Buscar y actualizar el curso por id
                const courseUpdated = await courseModel.findOneAndUpdate({"_id": id}, input, {new: true});

                // Retornar el curso actualizado
                return courseUpdated

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error updating the course: ${error}`)
            }
        },
        async deleteCourse(obj, {id}) {
            try {
                // Buscar y eliminar el curso por id
                const removeCourse = await courseModel.findByIdAndDelete(id);

                // Retornar el curso eliminado
                return {message: `The course "${removeCourse.title}" was deleted`};

            } catch (error) {
                // Retornar un error si ocurre alguno
                return new Error(`There was an error deleting the course: ${error}`)
            }
        }
    }
};

// Exportar los resolvers
module.exports = {
    resolvers
};