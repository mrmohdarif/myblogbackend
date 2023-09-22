const mongoose=require('mongoose')
const {Schema,model}=mongoose
const UserScheme=new Schema({
    username:{
        type:String,
         unique: [true,"value should be unique"],
         required: true
    },
    password:{
        type:String,
        unique: [true,"value should be unique"],
        required: true   
    }
});

const UserModel=model('User',UserScheme)
module.exports=UserModel;
