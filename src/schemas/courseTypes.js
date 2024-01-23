// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Definir los types de los cursos para el Schema y exportarlos
module.exports = `
type Course {
    id: String!
    title: String!
    views: Int,
    user: User
}

input CourseInput {
    title: String!
    views: Int
}

type Query {
    courses( options: PaginationInput ): [ Course ]
}

type Mutation {
    addCourse( input: CourseInput ): Course
    updateCourse( id: ID!, input: CourseInput ): Course
    deleteCourse( id: ID!): Alert
}
`;