const { gql } = require('@apollo/server');
const {GraphQLJSON} = require('graphql-type-json');
const { userResolvers,
    userTypes,
    userQuery,
    userMutations } = require('./user');
const { 
    deviceTypes,
    deviceQuery,
    deviceMutations } = require('./devices');

module.exports.typeDefs = `#graphql
    scalar JSON
    type Query  
    type Mutation
    ${userTypes}
    ${deviceTypes}`

module.exports.resolvers = {
    JSON: GraphQLJSON,
    Query: {
        ...userQuery,
        ...deviceQuery
    },
    Mutation: {
        ...userMutations,
        ...deviceMutations
    },
    User: userResolvers,
    

}