const express = require('express');
const auth = require('../middleware/auth');
const Profile = require('../models/profile');
const User = require('../models/user')
const {check, validationResult} = require('express-validator/check')
const router = new express.Router()

//get My profile
router.get('/api/profile/me', auth,async (req, res)=>{
    console.log('returning profile')
    try{
        const profile = await Profile.findOne({user: req.user._id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(404).send('There is no profile for the User')
        }
        res.json(profile)
    } catch(e){
        res.status(500).send('Server Error')
    }
})
//create or update
router.post('/api/profile', [auth,[
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
] ],async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors: errors.array()})
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        linkedin,
        instagram,
        twitter
    } = req.body;

    console.log(req.body)
    //Build profile object
    const profileFields= {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill=> skill.trim());
    }
    profileFields.social = {}
    if(facebook) profileFields.facebook = facebook;
    if(twitter) profileFields.twitter = twitter;
    if(instagram) profileFields.instagram = instagram;
    if(linkedin) profileFields.linkedin = linkedin;
    if(youtube) profileFields.youtube = youtube;

    try{
        let profile = await Profile.findOne({user: req.user._id})

        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                { $set: profileFields},
                {new: true}
            )
            return res.json(profile)
        }
        profile = new Profile(profileFields)
        await profile.save()

        res.json(profile)
    }catch(e){
        console.log(e.message)
        res.status(500).send(e)
    }
})
//get All profiles
router.get('/api/profiles',async (req, res)=>{
    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.status(200).send(profiles)
    } catch(e){
        res.status(500).send('Server Error')
    }
})
//get a profile by id
router.get('/api/profile/:id',async (req, res)=>{
    try{
        console.log('inside out')
        const profile = await Profile.findOne({user: req.params.id}).populate('user', ['name', 'avatar'])
        console.log(profile)
        if(!profile) return res.status(400).json({msg: 'there is no profile for the user'})
        res.status(200).send(profile)
    } catch(e){
        res.status(500).send('Server Error')
    }
})

//Delete User and Profile
router.delete('/api/profile/me',auth , async (req, res) => {
    try{
        await Profile.findOneAndRemove({user: req.user._id})
        const user = await req.user.remove()
        res.send({user: req.user, msg:'user deleted'})
    } catch(e){
        res.status(500).send(e)
    }
})

//Work Experience
router.put('/api/profile/experience', [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {title, company, location, from, to, current, description}

    if(!current){
        newExp.current = null
    }


    try{
        const profile = await Profile.findOne({user: req.user._id})
        profile.experience.unshift(newExp);
        console.log(profile.experience)
        await profile.save()

        res.status(200).send(profile)
    }catch(e){
        console.log(e.message)
        res.status(500).send({error: "server error"})
    }
})
//Delete Work Experience
router.delete('/api/profile/experience/:exp_id',auth, async(req, res)=>{
try{
        const profile = await Profile.findOne({user: req.user._id})
        const remIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        profile.experience.splice(remIndex, 1)
        await profile.save()
        res.json(profile)
    }catch(e){
        res.status(500).send({error: "server error"})
    }
})
//add Education
router.put('/api/profile/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {            
        school,
        degree,
        fieldofstudy, from, to, current, description
    }
    if(!current){
        newEdu.current = null
    }

    try{
        const profile = await Profile.findOne({user: req.user._id})
        console.log(profile)
        profile.education.unshift(newEdu);
        await profile.save()
        res.json(profile)
    }catch(e){
        console.log(e.message)
        res.status(500).send("server error")
    }
})
//Delete Education
router.delete('/api/profile/education/:edu_id',auth, async(req, res)=>{
    try{
        const profile = await Profile.findOne({user: req.user._id})
        const remIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(remIndex, 1)
        await profile.save()
        res.json(profile)
    }catch(e){
        res.status(500).send("server error")
    }
})
//get Github repos (public, and would require to register on github OAuth)
router.get('/api/profile/github/:username', (req, res)=>{
    try{
        const options = {
            uri: `https://api.github.com/users/${req.params.usernam}/repos?per_page=5&sort=created:asc`,     //might need client id etc
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }

        request(options, (error, response, body)=>{
            if(error) console.log(error)

            if(response.statusCode !==200){
                res.status(404).send({error: 'No github profile found'})
            }
            res.json(JSON.parse(body))
        })
    } catch(e){
        res.status(500).send('Server Error')
    }
})

module.exports = router