const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    role:{
        type:String,
        enum:["user","staff","admin"],
        default: 'user'
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:Date,
        default:Date.now
    },
  
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
        

})

module.exports=mongoose.model('user',UserSchema);