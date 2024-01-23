// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { ApolloServer } = require( 'apollo-server-express' );
const { merge } = require( 'lodash' );
const express = require( 'express' );
const cors = require( 'cors' );
require( 'dotenv' ).config();
// ********************************OWN LIBRARIES*********************************
const courseResolvers = require( "./src/resolvers/courseResolvers" );
const userResolvers = require( "./src/resolvers/userResolvers" );
const courseTypesDefs = require( "./src/schemas/courseTypes" );
const userTypesDefs = require( "./src/schemas/userTypes" );
const { typeDefs } = require( './src/schemas/typeDefs' );
const context = require( './src/utils/context' );
const connectionDB = require( './src/db/db' );
// ******************************************************************************
// Conectar a la base de datos
connectionDB( process.env.MONGODB_URL );

// Crear una instancia de Express
const app = express();

// Aplicar middlewares
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );

// Crear una instancia de ApolloServer
const server = new ApolloServer( { 

    // Agrupar todos los types para crear una sola integración de types en el Schema
    typeDefs: [ typeDefs, courseTypesDefs, userTypesDefs ],

    // Agrupar todos los resolvers para crear una sola integración de resolvers en el Schema
    resolvers: merge( courseResolvers, userResolvers ),

    // Definir un contexto para pasar token y usuario a todos los resolvers
    context: context
} );

// Iniciar el servidor de Apollo y conectarlo a Express
server.start().then( () => {
    server.applyMiddleware( { app: app, path: "/graphql" } );
} );

// Levantar el servidor de Express
app.listen( process.env.PORT, () => {
    console.log( `Server started on port ${process.env.PORT}` );
} );


