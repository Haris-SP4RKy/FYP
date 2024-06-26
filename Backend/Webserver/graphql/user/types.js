
module.exports.userTypes =`
  type User {
    id: ID!
    email: String
    token: String
    name: String
    createdAt: String
  }
  input RegisterInput {
    name: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  extend type Query {
    byId: User
  }
  extend type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    updateUser(email: String!, password: String! , confirmPassword: String! ,name: String!): User!
  }
`;