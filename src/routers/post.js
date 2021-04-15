const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/post');
const {check, validationResult} = require('express-validator/check')

const router = new express.Router()

router.post('/api/post/', [auth, [
    check('text', 'post Text is required').not().isEmpty()
]], async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send({error: errors.array()})
    }
    const postObj = {}
    postObj.text = req.body.text,
    postObj.user = req.user._id,
    postObj.name = req.user.name,
    postObj.avatar = req.user.avatar
    const post = new Post(postObj);
    try{
        console.log(post)
        await post.save()
        res.json(post)
    }catch(e){
        console.log(e.message)
        res.status(500).send({error: 'server error'})
    }
})
//get post by id
router.get('/api/posts', auth,async (req, res)=>{
    try{
        const post = await Post.find()
        if(!post){
            return res.status(404).send({error:'Posts not found'})
        }
        res.json(post)
    }catch(e){
        res.status(500).send({error: 'server error'})
    }
})
//get post by id
router.get('/api/post/:id', auth,async (req, res)=>{
    try{
        const post = await Post.findOne({_id:req.params.id})
        if(!post){
            return res.status(404).send({error:'Post not found'})
        }
        res.json(post)
    }catch(e){
        res.status(500).send({error: 'server error'})
    }
})
//delete post by id
router.delete('/api/post/:id', auth, async(req, res)=>{
    try{
        const post = await Post.findOne({_id:req.params.id})
        if(!post){
            return res.status(404).send({error:'Post not found'})
        }
        if(!post.user.equals(req.user._id)){
            return res.status(400).send({error:'User is not authorized to delete this post'})
        }
        await post.remove()
        res.json({post, msg: "post removed"})
    }catch(e){
        res.status(500).send({error: 'server error'})
    }
})
//like a post
router.put('/api/post/like/:id', auth, async (req,res) =>{
    try{
        const post = await Post.findOne({_id: req.params.id})

        if(post.likes.filter(like=> like.user.equals(req.user._id)).length >0){
            return res.status(400).json({error: 'post already liked'})
        }
        post.likes.unshift({user:req.user._id})
        await post.save()
        res.json(post.likes)
    }catch(e){
        res.status(500).send({error:'server error'})
    }
})
//unlike a post
router.put('/api/post/unlike/:id', auth, async (req,res) =>{
    try{
        const post = await Post.findOne({_id: req.params.id})

        if(post.likes.filter(like=> like.user.equals(req.user._id)).length =0){
            return res.status(400).json({error: 'post has not yet been liked'})
        }
        const remindex = post.likes.map(like=>like.user.toString()).indexOf(req.user._id)
        post.likes.splice(remindex, 1)
        await post.save()
        res.json(post.likes)
    }catch(e){
        res.status(500).send({error:'server error'})
    }
})

//comment on post
router.post('/api/post/:id/comment', [auth, [
    check('text', 'post Text is required').not().isEmpty()
]], async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send({error: errors.array()})
    }
    try{
        const post = await Post.findById(req.params.id)
        const newComment = {}
        newComment.text = req.body.text,
        newComment.user = req.user._id,
        newComment.name = req.user.name,
        newComment.avatar = req.user.avatar

        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)
    }catch(e){
        res.status(500).send({error: 'server error'})
    }
})
//delete comment by id (also needs post id)
router.delete('/api/post/:id/comment/:comment_id', auth, async (req, res)=>{
    try{
        const post = await Post.findOne({_id:req.params.id})
        if(!post){
            return res.status(404).send({error:'Post not found'})
        }
        const comment = post.comments.find(comment => comment._id.equals(req.params.comment_id))
        if(!comment){
            return res.status(404).send({error:'Comment not found'})
        }
        if(!(comment.user.equals(req.user._id) || post.user.equals(req.user._id))){
            return res.status(401).send({error:'User is not authorized to delete this comment'})
        }

        const removeIndex = post.comments.map(comment => comment._id).indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        await post.save()
        res.json(post.comments)
    }catch(e){
        res.status(500).send({error: 'server error'})
    }
})

module.exports = router