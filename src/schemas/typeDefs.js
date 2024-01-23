// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Base del Schema
const typeDefs = `
    type Alert {
        message: String
    }

    input PaginationInput {
        id: String
        page: Int
        limit: Int
    }

    type Query {
        _ : Boolean
    }

    type Mutation {
        _ : Boolean
    }
`;

module.exports = {typeDefs};