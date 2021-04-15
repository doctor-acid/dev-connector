const jwt = require('jsonwebtoken')
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET || "what_the_hell_is_wrong_with_you"

const auth = async(req, res, next) => {
    try {        
        const token = req.headers['x-auth-token']

        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findOne({ _id: decoded._id, 'tokens.token' :token})

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user

        next();

    } catch (e){
        res.status(401).send({error: 'Please authenticate.' })
    }
}

module.exports = auth