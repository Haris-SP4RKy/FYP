const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('@apollo/server');
const config = require('../../config');
const db = require('../../../KafkaEgress/db/pg/db');
const { GraphQLError }= require('graphql');

const {
    validateRegisterInput,
    validateLoginInput
} = require('../../utils/validators');


function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        config.SECRET_KEY,
        { expiresIn: '24h' }
    );
}

module.exports.userMutations = {

    async login(_, { email, password }) {
        const { errors, valid } = validateLoginInput(email, password);

        if (!valid) {
            throw new GraphQLError('Errors', { errors });
        }

        

        const [user] = await db('users').where({ "email": email });

        if (!user) {
            errors.general = 'Wrong crendetials';
            throw new GraphQLError('Wrong crendetials', { errors });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            errors.general = 'Wrong crendetials';
            throw new GraphQLError('Wrong crendetials', { errors });
        }

        const token = generateToken({ "email": user.email, 'name': user.name, 'id': user.id });


        return {
            "email": user.email, 'name': user.name, 'id': user.id,
            token
        };
    },
    async register(
        _,
        {
            registerInput: { name, email, password, confirmPassword }
        }
    ) {
        // Validate user data
        const { valid, errors } = validateRegisterInput(
            name,
            email,
            password,
            confirmPassword
        );
        if (!valid) {
            throw new GraphQLError('Errors', { errors });
        }
        // TODO: Make sure user doesnt already exist
        const [user] = await db('users').where({ "email": email })
        if (user) {
            throw new GraphQLError('email is already taken', {
                errors: {
                    name: 'This email is taken'
                }
            });
        }
        // hash password and create an auth token
        password = await bcrypt.hash(password, 12);

        const newUser = {
            email,
            name,
            password,
        };

        const [res] = await await db('users').insert([
            newUser
        ]).returning('id');
        const token = generateToken({ "email": newUser.email, 'name': newUser.name, 'id': res.id });

        return {
            "email": newUser.email, 'name': newUser.name, 'id': res.id,
            token
        };
    },
    async updateUser(_,{email,password,confirmPassword,name},info){

        if(!info.Authenticated){
            throw new GraphQLError('Errors', { msg: 'Not Authenticated' });
        }

        
        const { valid, errors } = validateRegisterInput(
            name,
            email,
            password,
            confirmPassword
        );
        if (!valid) {
            throw new GraphQLError('Errors', { errors });
        }
        const [user] = await db('users').where({ "email": email });

        if (!user) {
            errors.general = 'User does not exist';
            throw new GraphQLError('User does not exist', { errors });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            errors.general = 'Wrong crendetials/password';
            throw new GraphQLError('Wrong crendetials/password', { errors });
        }
        const [res] = await await db('users').where('id',info.user.id).update({name:name,email:email}).returning([id,name,email]);
        
        
        return {
            "email": res.email, 'name': res.name, 'id': res.id
            
        };
    }


};