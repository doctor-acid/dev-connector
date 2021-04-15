const mongoose = require('mongoose')
const validator = require('validator')

const MONGODB_SERVER = process.env.MONGODB_SERVER || 'mongodb://127.0.0.1:27017/dev-connect'

mongoose.connect(MONGODB_SERVER, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})