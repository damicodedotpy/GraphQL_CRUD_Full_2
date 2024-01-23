// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { Schema, model } = require("mongoose");
const paginate = require("mongoose-paginate-v2");
// ********************************OWN LIBRARIES*********************************

// ******************************************************************************
// Definir el esquema para el modelo Course
const courseSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    title: String,
    views: Number,
    user: {
        type: String,
        ref: "User"
    }
},
{
    versionKey: false,
    _id: false
});

// Agregar el plugin de paginacion al esquema
courseSchema.plugin(paginate);

// Exportar el modelo
module.exports = model("Course", courseSchema, "courses");