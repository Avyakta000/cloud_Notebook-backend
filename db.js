const mongoose=require('mongoose');
const mongoURI="mongodb://127.0.0.1:27017/I-Notebook"

const connectMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{

        console.log("connected to mongoose successfully")
    })
}
module.exports=connectMongo