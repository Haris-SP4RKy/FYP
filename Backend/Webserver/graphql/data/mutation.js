const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('@apollo/server');
const config = require('../../config');
const db = require('../../../KafkaEgress/db/pg/db');



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
                throw new UserInputError('Errors', { errors });
            }

            
            const user = await db('user').where({ "email": email })

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', { errors });
            }

            const token = generateToken({ "email": user[0].email, 'name': user[0].name, 'id':user[0].id });


            return {
                "email": user[0].email, 'name': user[0].name, 'id':user[0].id ,
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
                throw new UserInputError('Errors', { errors });
            }
            // TODO: Make sure user doesnt already exist
            const user = await db('user').where({ "email": email })
            if (user) {
                throw new UserInputError('name is taken', {
                    errors: {
                        name: 'This name is taken'
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

            const res = await await db('users').insert([
                newUser
            ]).returning('id');
            const token = generateToken({ "email": newUser.email, 'name:': newUser.name, 'id': res[0].id });

            return {
                "email": newUser.email, 'name:': newUser.name, 'id': res[0].id,
                token
            };
        }
    
};