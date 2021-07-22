const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const Joi = require("joi");
const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    pic:{
        type:String,
        default:"https://www.searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon-715x715.png"
       }

})


mongoose.model("User",userSchema);




