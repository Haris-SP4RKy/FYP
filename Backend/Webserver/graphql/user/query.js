const db = require('../../db/pg/db');
const { GraphQLError }= require('graphql');

module.exports.userQuery = {
         byId:async (parent, args, info, context) => {

        if(!info.Authenticated){
            throw new GraphQLError('Errors', { msg: 'Not Authenticated' });
        }
        const [user] = await db('users').where({ "id": info.user.id });

        if (!user) {
            errors.general = 'User does not exist';
            throw new GraphQLError('User does not exist', { errors });
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        }
    }
}