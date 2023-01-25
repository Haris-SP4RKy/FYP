
module.exports.analyticsTypes =`
  type Device {
    id: ID!
    sensor_type: String!
    token: String!
    name: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  extend type Query {
    byId: User
    getAll: [User]
  }
  extend type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
  }
`;