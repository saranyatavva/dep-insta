const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Conversation =  mongoose.model("Conversation")
const requireLogin  = require('../middleware/requireLogin')


router.post("/conversation",requireLogin, async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
  
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });



  router.get("/conver",requireLogin, async (req, res) => {
    try {
       Conversation.find({
        members: { $in: [req.user._id] }})
        .then((conversation)=>{
          res.render('mesenger.ejs',{conversation:conversation});
        })
      
    } catch (err) {
      res.status(500).json(err);
    }
  }); 

















module.exports = router;