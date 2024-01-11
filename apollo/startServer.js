// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Iniciar servidor de Apollo Server y conectarlo a Express
async function startApolloServer(app, server, path = "/graphql") {
    try {
        // Iniciar el servidor de Apollo
        await server.start();

        // Conectar Apollo Server a Express
        await server.applyMiddleware({ app: app, path: path });

    } catch (error) {
        return new Error(`Failed to start Apollo Server: ${error.message}`);
    }
}

module.exports = { startApolloServer }