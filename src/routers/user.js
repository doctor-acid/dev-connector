const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user')
const {check, validationResult} = require('express-validator/check')

const router = new express.Router()

//api/user      routes

router.post('/api/users',[
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty()
], async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const userT = {}
    userT.name = req.body.name
    userT.email = req.body.email
    userT.password = req.body.password
    const user = new User(userT)
    console.log(user)
    try{
        // await user.save()
        const token = await user.generateAuthToken()
        console.log('token next')
        console.log(token)
        res.status(201).send({user, token})
    }catch(e){
        console.log(e)
        const errors = [{msg: e.message}]
        res.status(500).send({errors})
    }
})

router.post('/api/users/login',async (req, res)=>{
    try{
        console.log('server says in')
        const user = await User.findByCredentials(req.body.email, req.body.password)//  const user = getUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({user, token})
    } catch(e){
        console.log(e.message)
        const errors = [{msg: 'Server Error'}]
        res.status(500).send({errors})
    }
})
//GET
router.get('/api/auth', auth ,async (req, res)=>{
    try{
        res.status(200).send({user: req.user})
    } catch(e){
        res.status(500).send({msg: 'Server Error'})
    }
})
//LOGOUT
router.post('/api/logout', auth , async (req, res) => {
    try{
        req.user.tokens =  req.user.tokens.filter((token) => {
            token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch(e){
        res.status(500).send({msg: e.message})
    }
})
//LOGOUT All
router.post('/api/logoutAll', auth , async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch(e){
        res.status(401).send({msg: e.message})
    }
})



module.exports = router