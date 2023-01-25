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
const { analyticsTypes } = require ('./types.js')
const { analyticsQuery } =require( './query.js')
const { analyticsMutation } =require( './mutation.js')

module.exports = {
    analyticsTypes,
    analyticsQuery,
    analyticsMutation

}
