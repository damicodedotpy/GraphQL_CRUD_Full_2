// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const {merge} = require('lodash');
const cors = require('cors');
require('dotenv').config();
// ********************************OWN LIBRARIES*********************************
const courseResolvers = require("./resolvers/courseResolvers");
const { startApolloServer } = require('./apollo/startServer');
const userResolvers = require("./resolvers/userResolvers");
const courseTypesDefs = require("./types/courseTypes");
const userTypesDefs = require("./types/userTypes");
const {typeDefs} = require('./types/typeDefs');
const context = require('./apollo/context');
const userModel = require('./models/user');
const connectionDB = require('./db/db');
// ******************************************************************************
// Conectar a la base de datos
connectionDB(process.env.MONGODB_URL);

// Crear una instancia de Express
const app = express();

// Aplicar middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Crear una instancia de ApolloServer
const server = new ApolloServer({ 

    // Agrupar todos los types para crear una sola integración de types en el Schema
    typeDefs: [typeDefs, courseTypesDefs, userTypesDefs],

    // Agrupar todos los resolvers para crear una sola integración de resolvers en el Schema
    resolvers: merge(courseResolvers.resolvers, userResolvers.resolvers),

    // Definir un contexto para pasar token y usuario a todos los resolvers
    context: context
});

// Iniciar el servidor de Apollo y conectarlo a Express
startApolloServer(app, server);

// Levantar el servidor de Express
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});


