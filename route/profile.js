const express = require("express");

const router = express.Router();
const UserSchema = require('../model/event')
const Authenticate = require('../middleware/authenticate');
const eventSchema = require('../model/event');
const EventSchema = require("../model/event");

router.get("/profile", Authenticate, async (req, res) => {
  console.log("hello from my profile");
  console.log(req.rootUser);
  res.json({ success: true, data: req.rootUser });
});
router.get("/profilepost", Authenticate, async (req, res) => {
  const id = req.userID;
 const result = await UserSchema.find({userId:id})
  res.json({ success: true, data: result});
});
// updating posts 
router.put('/update/post', Authenticate, async (req, res) => {
  try {
    const { description, phn, email, rlink } = req.body;
    const updt = await EventSchema.findByIdAndUpdate(
      { _id: req.body.postId },
      { description,phn, email, rlink }
    );
    res.json({message:"updated", success:true})
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"failed to update"})
  }
    
})

// deleting posts
router.delete("/deletposts/:id", Authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const del = await EventSchema.findByIdAndDelete(id); // which document is to be deleted: name of the document
    res.json({ success: true, Data:del });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});
module.exports = router;