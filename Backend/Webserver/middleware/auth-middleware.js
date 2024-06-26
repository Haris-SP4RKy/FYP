const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.error = "No authentication header found."
        req.isAuth = false
        return next()
    }

    let decoded

    try {
        const token = authHeader.split(' ')[1]
        decoded = jwt.verify(token, config.SECRET_KEY)
    } catch (error) {
        req.isAuth = false
        req.decoded = decoded
        req.error = error.message
        return next()
    }

    if (!decoded) {
        req.isAuth = false
        req.error = "Unable to decode jwt"
        return next()
    }

    req.isAuth = true
    req.user = decoded
    req.error = null
    next()
}

module.exports = {authMiddleware}