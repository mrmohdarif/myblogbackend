const mongoose=require('mongoose')
const{Schema,model}=mongoose
const post_schema=new Schema({
title:String,
summary:String,
content:String,
cover:String,
auther:{
    type:Schema.Types.ObjectId,ref:'User'},
},

{ 
    timestamps: true
 }
)
const postModel=model('Post',post_schema)
module.exports=postModel