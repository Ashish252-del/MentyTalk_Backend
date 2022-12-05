const express = require("express");
const UserSchema = require('../model/signup');
const app = express();
const eventSchema = require('../model/event');
const router = express.Router();

const Authenticate = require("../middleware/authenticate");


router.post('/posts',Authenticate, async(req, res) => {
   try {
       const id = req.userID;
       const {
           description,
           phn,
           email,
           rlink,
           ctype,
           Pic,
           userId } = req.body;
       if (!description || !phn || !email) {
           return res.status(422).json({message:"please require fields"})
       }
       const newUser = new eventSchema({
         description,
         phn,
         email,
         rlink,
         ctype,
         Pic,
         userId: id,
       });
       await newUser.save();
       res.json({success:true, message: "new post is created" });
   } catch (error) {
    console.log("error")
   }
   
})
// for uploading image on cloudinary

router.get('/workshop', Authenticate, async(req, res) => {
    try {
        const id = req.userID;
        const result = await eventSchema
          .find({ ctype: "Workshop_Webinar" }, { userId: 0 })
          .sort({ createdAt: -1 });
        res.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
    }
})
router.get('/webinar', Authenticate, async(req, res) => {
    try {
        const id = req.userID;
        const result = await eventSchema
          .find({ ctype: "Intern_Placement" }, { userId: 0 })
          .sort({ createdAt: -1 });
        res.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
    }
})
router.get('/cources', Authenticate, async(req, res) => {
    try {
        const id = req.userID;
        const result = await eventSchema
          .find(
            {
              ctype: "Cource",
            },
            { userId: 0 }
          )
          .sort({ createdAt: -1 });
        res.json({ success: true, data: result });
        console.log(result)
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;