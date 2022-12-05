const express = require("express");
const router = express.Router();
const UserSchema = require('../model/signup');
const bcrypt = require("bcrypt");
const Authenticate = require('../middleware/authenticate')
// sign up root
router.post('/user', async(req, res) => {
    try {
        const { name, password, email, type, description, profilepic, education
            , subject, Address, phone, gender } = req.body;
        if (!name || !password || !email) {
            return res.status(422).json({ error: "please fill required fields" });
        }
        const result = await UserSchema.findOne({ email: email });
        if (result) {
            res.status(422).json({ error: "user already exist" });
            throw new Error ("User already exists!")
        }
        const encryptedpass = await bcrypt.hash(password, 12);
        const newUser = new UserSchema({
         name, password:encryptedpass, email, type, description, profilepic, education
            , subject, Address, phone, gender   
        })
        await newUser.save();
        res.json({success:true, message: "new user created"})
    } catch (error) {
        console.log("Getting an error");
        console.log(error);
        res.status(404).json({success:false, message:"user is not created"})
    }
})


// login route

router.post('/login',async (req, res) => {
   try {
     const { email, password } = req.body;
    if (!email || !password) {
        return res.status(402).json({ error: "plz filled the data" });

    }
       const userLogin = await UserSchema.findOne({ email: email });
        if (!userLogin) {
          return res.status(400).json({ error: "invalid email or password" });
        }

        const isMatched = await bcrypt.compare(password, userLogin.password);
    if (!isMatched) {
      return res.status(400).json({ error: "invalid email or password" });
       } 
    else {
        // getting token 
        let token = await userLogin.generateAuthToken();
         console.log("token ");
        console.log(token);
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000), // after this time token will expire and user will log out Date.now()+25892000000 is in mili second wich is eqaul to 30 days
          httpOnly: true,
          //secure:true  //it is applicable when we use https method
        });
         res.json({ success:true , message: "log in successfully" });
     }
       }


    catch (error) {
     console.log(error);
   }

})
// Log out ka page
router.get('/logout', (req, res) => {
  // we are clearing the cookie once cookie clear then user will log out
  res.clearCookie("jwtoken");
  res.status(200).json({success:true,message:'user logged out'})


})
router.get('/check',Authenticate, (req, res) => {
 try {
  res.json({success:true,message:"User is loged in"})
 } catch (error) {
  res.status(400).json({message:"user is not loged in"})
 }

})

module.exports = router;
 
