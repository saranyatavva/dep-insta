const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Message =  mongoose.model("Message")
const requireLogin  = require('../middleware/requireLogin')


//add

router.post("/message",requireLogin, async (req, res) => {
    const newMessage = new Message(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.get("/message/:conversationId",requireLogin, async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  





















module.exports = router;