// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Definir los types de los cursos para el Schema y exportarlos
module.exports = `
type Course {
    id: ID!
    title: String!
    views: Int,
    user: User
}

input CourseInput {
    title: String!
    views: Int
}

type Query {
    getCourses(page: Int, limit: Int = 1): [Course]
    getCourse(id: ID!): Course
}

type Mutation {
    addCourse(input: CourseInput, user: ID!): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): Alert
}
`;