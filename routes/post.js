const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")



router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,photo} = req.body 
    if(!title || !body || !photo){
        req.flash('message','Please enter all fields'),
        res.redirect('/allpost')
    }
    req.user.password = undefined;

    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })
    post.save().then(result=>{
        
        console.log(post);
        res.redirect('/allpost');
    })
    .catch(err=>{
        console.log(err)
    })
})




router.get('/hello',(req,res)=>{
    console.log(req.cookies.jwt);
    console.log(req.cookies.user);
})



router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
       console.log(posts);
        res.render('home.ejs',{message:req.flash('message'),posts:posts});
    }).catch(err=>{
        console.log(err)
    })
    
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        console.log( mypost[1].postedBy.name );
        res.render('myprofile.ejs',{message:req.flash('message'),mypost:mypost});
    })
    .catch(err=>{
        console.log(err)
    })
})
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})








module.exports=router