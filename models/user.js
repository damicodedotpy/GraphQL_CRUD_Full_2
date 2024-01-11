// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");
const paginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
// ********************************OWN LIBRARIES*********************************

// ******************************************************************************
// Definir el esquema para el modelo User
const userSchema = new Schema({
    email: String,
    hashedPassword: String,
    token: String,
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course"
    }]
});

// Hashear el password antes de guardar en la base de datos
userSchema.virtual("password").set(function (password) {
    // Hashear el password
    this.hashedPassword = bcrypt.hashSync(password, 10);
});

// Crear un metodo para autenticar al usuario
userSchema.statics.authenticate = async function ({email, password}) {

    // Buscar el usuario por email
    const user = await this.findOne({ email: email });

    // Si no se encuentra el usuario, retornar un error
    if (!user) {
        throw new Error('User not found.');
    }

    // Si se encuentra el usuario, comparar el password
    const match = await bcrypt.compare(password, user.hashedPassword);

    // Si el password no coincide, retornar un error
    if (!match) throw new Error('Email or password is wrong.');

    // Crear el payload para el token
    const payload = {
        id: user.id,
    }

    // Rellenar la propiedad token del usuario con el token generado
    user.token = jsonwebtoken.sign(payload, process.env.SECRET_KEY);

    // Guardar el usuario
    await user.save();

    // Retornar el usuario
    return user;
}

// Agregar la paginacion al esquema
userSchema.plugin(paginate);

// Exportar el modelo User
module.exports = model("User", userSchema, "users")