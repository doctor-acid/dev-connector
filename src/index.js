const express = require('express')
require('./db/mongoose')
const bodyParser = require('body-parser')
const userRouter = require('./routers/user')
const profileRouter = require('./routers/profile')
const postRouter = require('./routers/post')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3005

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(userRouter)
app.use(profileRouter)
app.use(postRouter)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(port, () => {
    console.log('Server is up and running on port: '+port)
})
