// // const postsResolvers = require('./posts');
// const usersResolvers = require('./mutation.js');

// module.exports = {
// //   Query: {
// //     ...postsResolvers.Query
// //   },
//   Mutation: {
//     ...usersResolvers.Mutation
//   }
// };
const { userTypes } = require ('./types.js')
const { userQuery } =require( './query.js')
const { userMutation } =require( './mutation.js')
const { userResolvers } =require( './resolvers.js')

module.exports = {
    userResolvers,
    userTypes,
    userQuery,
    userMutation

}
