const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcrypt')
require('../db/mongoose')

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    company: {type: String},
    website: {type: String},
    status: {type: String, required: true},
    skills: {
        type: [String],
        required: true
    },
    bio: {type: String},
    gitHubUserName: {
        type: String
    },
    experience: [{
        title: {type: String, required: true},
        company: {type: String, required: true},
        location: {type: String},
        from: {type: Date, required: true},
        to: {type: Date},
        current: {type: Boolean, default: false},
        description: {type: String}
    }],
    education: [{
        school: {type: String, required: true},
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required: true
        },
        from: {type: Date, required: true},
        to: {type: Date},
        current: {type: Boolean, default: false},
        description: {type: String}
    }],
    social:{
        youtube: {type: String},
        twitter: {type: String},
        facebook: {type: String},
        linkedin: {type: String},
        instagram: {type: String},
    }
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile