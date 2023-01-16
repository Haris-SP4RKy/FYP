const config = require('../../config');
const db = require('../../../KafkaEgress/db/pg/db');





module.exports.deviceMutations = {
   
        async Insert(_, { id, sensor_type ,group_id}) {
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
      
    
};