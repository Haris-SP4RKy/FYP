// // const postsResolvers = require('./posts');
// const devicesResolvers = require('./mutation.js');

// module.exports = {
// //   Query: {
// //     ...postsResolvers.Query
// //   },
//   Mutation: {
//     ...devicesResolvers.Mutation
//   }
// };
const { deviceTypes } = require ('./types.js')
const { deviceQuery } =require( './query.js')
const { deviceMutations } =require( './mutation.js')

module.exports = {
    
    deviceTypes,
    deviceQuery,
    deviceMutations

}
