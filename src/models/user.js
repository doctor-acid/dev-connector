const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcrypt')
require('../db/mongoose')

const JWT_SECRET = process.env.JWT_SECRET || "what_the_hell_is_wrong_with_you"

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    tokens: [{
        _id: false,
        token: {type: String}
    }]
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
   
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to find User or Password')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Username or Password not found')
    }
    return user
}

// userSchema.methods.toJSON = function(){
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.avatar

//     return userObject
// }

userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({_id: user._id.toString() }, JWT_SECRET, { expiresIn : '1 week'})
    
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}

const User = mongoose.model('User', userSchema)
module.exports = User