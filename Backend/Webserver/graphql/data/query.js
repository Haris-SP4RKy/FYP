module.exports.userQuery = {
    byId: (parent, args, info, context) => {

        context.info
        info
        // whatever
        return {
            id: 1,
            email: 'abcd@gmail.com',
            name: 'John Doe'
        }
    },
    getAll: (parent, args) => {
        // whatever
        console.log("get users")
        return [ {
            id: 1,
            email: 'abcd@gmail.com',
            name: 'John Doe'
        }]
    }
}