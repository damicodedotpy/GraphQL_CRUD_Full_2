// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const mongoose = require('mongoose');
require("dotenv").config();
// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Crear conección a la base de datos
const connectionDB = (url) => {
    try {
        mongoose.connect(url);
        console.log(`Connected to database`);
    } catch (error) {
        return new Error(`There was an error connecting to the database: ${error}`);
    }
}

// Exportar funcion de conección a la base de datos
module.exports = connectionDB;