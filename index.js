const express = require("express");
const app = express();
const cookieParser = require("cookie-Parser");
app.use(cookieParser());
app.use(express.json());
require('./db/coneection'); // connectiong detabse
// we link the router file to make route easy
//app.use(require('./route/blog'));

// for config file
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

app.use(require('./route/login_signup'));
app.use(require('./route/profile'));
app.use(require('./route/wwc'));
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const EventSchema = require("./model/event");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
cloudinary.config({
  cloud_name: "darrtuoca",
  api_key: process.env.APIKEY,
  api_secret:process.env.APISECRET,
  secure: true,
});


         // writing post api for uploading images
app.post('/upload', (req, res) => {
   // console.log(req);
    // photo is name of file under which the image will come
    // that's why from frontend the image should come with name photo
    const file = req.files.file;
    console.log(file)
    // code for uploading on cloudinary
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        if (result) {
            try {
                // const newImage = new ImageModel({
                //     name: result.name,
                //     image: result.url,
                // });
                // await newImage.save();
                // here we are clearing temp file after saving and uploading
                var filePath = file.tempFilePath;
                fs.unlinkSync(filePath);
                res.json({ data: result , Success:true})
            } catch (error) {
                console.log(error);
                var filePath = file.tempFilePath;
                fs.unlinkSync(filePath);
            }
        }
    })
})

// deleting image from cloudinary
app.delete("/deletepic", (req, res) => {
    try {   //con.log(req)
           
            const imageUrl =req.query.Pic;
             
             console.log(imageUrl);
             // basically here we are finding out name of image from url
             //http://res.cloudinary.com/darrtuoca/image/upload/v1669488719/dpioebukjapfe9qreaqe.png
             // for example in above url the name of image is dpioebukjapfe9qreaqe
             const urlArray = imageUrl.split("/");
             console.log(urlArray);
             const img = urlArray[urlArray.length - 1];
             console.log(img);
             const imageName = img.split(".")[0];
             console.log(imageName);
             // code for deleting the image from cloudinary and document from mongodb

             cloudinary.uploader.destroy(imageName, (result, error) => {
               if (result) console.log(result);
               else console.log(error);
             });
             res.json({ message: "deleted" });
      
        } catch (error) {
            console.log(error);
        }
       
        
});
const port = process.env.PORT || 8000;
    if (process.env.NODE_ENV === "production") {
      app.use(express.static("Client/build"));
      app.get("*", (req, res) => {
        res.sendFile(
          path.resolve(__dirname + "/Client/build/index.html"),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
      });
    }
app.listen(port, () => { console.log("server is connected at 8000") });
