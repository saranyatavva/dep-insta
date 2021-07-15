const express = require('express')
const router = express.Router()
const Conversation =  mongoose.model("Conversation")


router.post("/",requireLogin, async (req, res) => {
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

















module.exports = router;