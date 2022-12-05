const mongoose = require('mongoose');

const EventModel = mongoose.Schema({
  description:String,
  phn:Number,
  email:String,
  rlink:String,
    ctype: String,
    Pic: String,
  userId:String
});
const EventSchema = mongoose.model("Event", EventModel);
module.exports = EventSchema;

