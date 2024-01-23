// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Definir los types de los usuarios para el Schema y exportarlos
module.exports = `
    type User {
        id: String!
        email: String!
        hashedPassword: String
        token: String
        courses: [Course]
    }

    extend type Query {
        users( options: PaginationInput ): [User]
    }

    input UserInput {
        email: String!
        password: String
    }

    extend type Mutation {
        singup(input: UserInput): User
        login(input: UserInput): User
        updateUser( id: String!, input: UserInput ): User
        deleteUser( id: String! ): Alert
    }
`;